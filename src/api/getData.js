const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT // For Vite projects
//  For Next.js, move this code to getServerSideProps or getStaticProps if using process.env
const username = import.meta.env.VITE_USER_NAME
const password = import.meta.env.VITE_PASSWORD
const base64Credentials = btoa(`${username}:${password}`)
export async function getDataListPrizes () {
  const response = await fetch(`${API_ENDPOINT}/lucky-draw/prizes`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type' : 'Application/json'
    }
  })
  const data = await response.json()

  return data
}

export async function getListAttendees() {
  const response = await fetch (`${API_ENDPOINT}/accounts/personal-info`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type' : 'Application/json'
    }
  })

  const data = await response.json()
  return data
}

