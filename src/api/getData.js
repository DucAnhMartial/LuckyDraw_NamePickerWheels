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
  const response = await fetch(`${API_ENDPOINT}/lucky-draw/prizes`, {
    method: 'GET',
    headers: getAuthHeader()
  })
  if (!response.ok) {
    console.error('Lỗi khi gọi API getDataListPrizes:', response.status)
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data
}

async function getDataTicketHolders() {
  const response = await fetch(`${API_ENDPOINT}/api/v1/ticketing/tickets`, {
    method: 'GET',
    headers: getAuthHeader()
  })

  if (!response.ok) {
    console.error('Lỗi khi gọi API getDataTicketHolders:', response.status)
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
    console.log('day',data)

  return data.map(item => ({
    lucky_id: item.lucky_id,
    ticketHolder_id: item.ticket_holder,
    ticketId : item.id
  }))
}

// Hàm lấy thông tin chi tiết ticket holder theo ID
async function getTicketHolderDetail(ticketHolder_id) {
  const response = await fetch(`${API_ENDPOINT}/api/v1/ticketing/ticket-holders/${ticketHolder_id}`, {
    method: 'GET',
    headers: getAuthHeader()
  })

  if (!response.ok) {
    console.error(`Lỗi khi gọi API ticket-holder ${ticketHolder_id}:`, response.status)
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json() // return full object (assume it's { display_name, ... })
}

export async function getDataListAttendees() {
  const ticketData = await getDataTicketHolders()

  const results = await Promise.all(ticketData.map(async ({ lucky_id, ticketHolder_id, ticketId }) => {
    const holderDetail = await getTicketHolderDetail(ticketHolder_id)
    return {
      lucky_id,
      display_name: holderDetail.display_name,
      ticketId
    }
  }))

  return results
}


export async function postDataHistoryLucky(ticketId, prizes_id, desc) {
  console.log(JSON.stringify({
    'description': desc,
    'ticket_id': ticketId,
    'prize_id': prizes_id
  })
  )
  const response = await fetch(`${API_ENDPOINT}/api/v1/histories/lucky-draw`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({
      'ticket_id': ticketId,
      'prize_id': prizes_id,
      'description': desc
    })
  })

  if (!response.ok) {
    console.error('Lỗi khi gọi API postDataHistoryLucky:', response.status)
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data
}
