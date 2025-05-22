const API_ENDPONINT = `${import.meta.env.VITE_URL_ENDPOINT}/${import.meta.env.VITE_API_ENDPOINT}`
const basicAuth = 'Basic ' + btoa(import.meta.env.VITE_USERNAME + ':' + import.meta.env.VITE_PASSWORD)
async function AttendeesData() {
  try {
    const display_name = []
    const response = await fetch(`${API_ENDPONINT}/events/attendances`, {
      method: 'GET',
      headers: {
        'Authorization': basicAuth,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    for ( let i = 0 ; i < data.length; i ++ ) {
      const response2 = await fetch(`${API_ENDPONINT}/events/attendances`, {
        method: 'GET',
        headers: {
          'Authorization': basicAuth,
          'Content-Type': 'application/json'
        }
      })
    }
    return display_name
  } catch (error) {
    return null
  }
}
export default AttendeesData
