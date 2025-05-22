const API_ENDPONINT = `${import.meta.env.VITE_URL_ENDPOINT}/${import.meta.env.VITE_API_ENDPOINT}`
const basicAuth = 'Basic ' + btoa(import.meta.env.VITE_USERNAME + ':' + import.meta.env.VITE_PASSWORD)

async function PrizesList () {
  try {
    const response = await fetch(`${API_ENDPONINT}/lucky-draw/prizes`, {
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
    return data
  }
  catch (e) {
    return null
  }
}