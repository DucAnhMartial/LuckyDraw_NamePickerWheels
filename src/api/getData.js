const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT // For Vite projects
//  For Next.js, move this code to getServerSideProps or getStaticProps if using process.env
const username = import.meta.env.VITE_USERNAME
const password = import.meta.env.VITE_PASSWORD
const base64Credentials = btoa(`${username}:${password}`)

function getAuthHeader() {
  return {
    'Authorization': `Basic ${base64Credentials}`,
    'Content-Type' : 'application/json'
  }
}

export async function getDataListPrizes () {
  const response = await fetch(`${API_ENDPOINT}/api/v1/lucky_draw/prizes`, {
    method: 'GET',
    headers: getAuthHeader()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.filter(item => item.level < item.amount)
}

export async function getDataListAttendees() {
  const response = await fetch(`${API_ENDPOINT}/api/v1/event_manager/attendances?page_size=1000`, {
    method: 'GET',
    headers: getAuthHeader()
  })
  if (!response.ok) {
    //console.error('Lỗi khi gọi API getDataListAttendees:', response.status)
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  //console.log('Attendances', data.results)
  return data.results.filter(item => item.has_prize !== true && item.checkin_status === true)
}

export async function postDataHistoryLucky(winner, prize) {
  const attendanceUrl = `${API_ENDPOINT}/api/v1/event_manager/attendances/${winner.id}`
  const historyUrl = `${API_ENDPOINT}/api/v1/histories/luckydraw`
  const updatePrizeLevel = `${API_ENDPOINT}/api/v1/lucky_draw/prizes/${prize.id}`
  const headers = getAuthHeader()

  // Payload cho mỗi request
  const attendancePayload = {
    has_prize: true,
    prize_id: prize.id
  }
  const historyPayload = {
    attendance_id: winner.id,
    description: `${prize.name}`
  }
  const updatePrizePayload = {
    level: prize.level + 1
  }

  try {
    // Chạy song song hai fetch
    const [res1, res2, res3] = await Promise.all([
      fetch(attendanceUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(attendancePayload)
      }),
      fetch(historyUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(historyPayload)
      }),
      fetch(updatePrizeLevel, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updatePrizePayload)
      })
    ])

    // Kiểm tra HTTP status của cả hai
    if (!res1.ok || !res2.ok) {
      const msg1 = res1.ok ? 'OK' : `Error ${res1.status}`
      const msg2 = res2.ok ? 'OK' : `Error ${res2.status}`
      const msg3 = res3.ok ? 'OK' : `Error ${res3.status}`
      throw new Error(`postDataHistoryLucky failed: attendance=${msg1}, history=${msg2}, updatePrize=${msg3}`)
    }

    // Đọc JSON trả về nếu cần
    const [attendanceData, historyData, prizeData] = await Promise.all([res1.json(), res2.json(), res3.json()])

    return { attendance: attendanceData, history: historyData, prize: prizeData }
  } catch (err) {
    //console.error('postDataHistoryLucky error:', err)
    //throw err
  }
}

