import type { Attendee, AttendeesResponse, EligibleAttendee } from '@/types/attendee'
import type { Session, SessionsResponse } from '@/types/session'
import type { LuckyDrawLog, LuckyDrawHistoryResponse } from '@/types/history'

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT as string // For Vite projects
//  For Next.js, move this code to getServerSideProps or getStaticProps if using process.env
const username = import.meta.env.VITE_USERNAME as string
const password = import.meta.env.VITE_PASSWORD as string
const base64Credentials = btoa(`${username}:${password}`)

interface AuthHeaderObject {
  [key: string]: string;
}

function getAuthHeader(): AuthHeaderObject {
  return {
    'Authorization': `Basic ${base64Credentials}`,
    'Content-Type': 'application/json'
  }
}

export async function getDataListPrizes() {
  const response = await fetch(`${API_ENDPOINT}/api/v1/lucky-draw/prizes`, {
    method: 'GET',
    headers: getAuthHeader()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.filter((item: any) => item.level < item.amount)
}

export async function getDataListAttendees(): Promise<EligibleAttendee[]> {
  const response = await fetch(`${API_ENDPOINT}/api/v1/attendances?page_size=1000`, {
    method: 'GET',
    headers: getAuthHeader()
  })
  if (!response.ok) {
    //console.error('Lỗi khi gọi API getDataListAttendees:', response.status)
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data: AttendeesResponse = await response.json()
  console.log('Attendances', data.results)
  return data.results.filter((item: Attendee) => item.has_prize !== true && item.checkin_status === true)
}

/**
 * Fetch sessions with optional filters
 * @param eventId - Optional event ID to filter sessions
 * @param pageSize - Number of items per page (default: 20)
 * @returns List of sessions
 */
export async function getDataListSessions(eventId?: number, pageSize: number = 20): Promise<Session[]> {
  let allResults: Session[] = []
  const params = new URLSearchParams()
  params.append('page_size', pageSize.toString())
  if (eventId) {
    params.append('event_id', eventId.toString())
  }
  
  let nextUrl: string | null = `${API_ENDPOINT}/api/v1/sessions?${params.toString()}`

  // Fetch all pages of sessions
  while (nextUrl) {
    const response = await fetch(nextUrl, {
      method: 'GET',
      headers: getAuthHeader()
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: SessionsResponse = await response.json()
    console.log('Sessions page:', data.results.length, 'Total so far:', allResults.length + data.results.length)
    
    // Add results from current page
    allResults = [...allResults, ...data.results]
    
    // Check if there's a next page
    nextUrl = data.next || null
  }

  return allResults
}


interface PostDataHistoryLuckyPayload {
  attendance: any;
  history: any;
  prize: any;
}

interface WinnerData {
  id: number;
  [key: string]: any;
}

interface PrizeData {
  id: number;
  name: string;
  level: number;
  [key: string]: any;
}

export async function postDataHistoryLucky(
  winner: WinnerData,
  prize: PrizeData
): Promise<PostDataHistoryLuckyPayload | void> {
  const attendanceUrl = `${API_ENDPOINT}/api/v1/attendances/${winner.id}`
  const historyUrl = `${API_ENDPOINT}/api/v1/histories/lucky-draw`
  const updatePrizeLevel = `${API_ENDPOINT}/api/v1/lucky-draw/prizes/${prize.id}`
  const headers = getAuthHeader()

  // Payload cho mỗi request
  const attendancePayload = {
    has_prize: true,
    prize_id: prize.id
  }
  const historyPayload = {
    attendance_id: winner.id,
    prize_id: prize.id
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

/**
 * Fetch lucky draw history logs with attendee details
 * @param sessionId - Optional session ID to filter history
 * @returns List of lucky draw log entries with attendee information, sorted by created_at
 */
export async function getDataLuckyDrawHistory(sessionId?: number): Promise<(LuckyDrawLog & { attendee?: Attendee })[]> {
  const response = await fetch(`${API_ENDPOINT}/api/v1/histories/lucky-draw`, {
    method: 'GET',
    headers: getAuthHeader()
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data: LuckyDrawHistoryResponse = await response.json()
  console.log('Lucky Draw History:', data)
  
  // Fetch all attendances to match with tickets
  const attendancesResponse = await fetch(`${API_ENDPOINT}/api/v1/attendances?page_size=1000`, {
    method: 'GET',
    headers: getAuthHeader()
  })
  if (!attendancesResponse.ok) {
    throw new Error(`HTTP error! status: ${attendancesResponse.status}`)
  }
  const attendancesData: AttendeesResponse = await attendancesResponse.json()
  
  // Create a map of ticket ID to attendee for quick lookup
  const ticketToAttendee = new Map<number, Attendee>()
  attendancesData.results.forEach(attendee => {
    if (attendee.ticket) {
      ticketToAttendee.set(attendee.ticket, attendee)
    }
  })
  
  // Enrich history logs with attendee data and filter by session if provided
  let enrichedHistory = data.map(log => {
    const attendee = ticketToAttendee.get(log.ticket)
    return {
      ...log,
      attendee
    }
  })
  
  // Filter by session if provided
  if (sessionId) {
    enrichedHistory = enrichedHistory.filter(log => log.attendee?.session === sessionId)
  }
  
  // Sort by created_at in descending order (newest first)
  return enrichedHistory.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}
