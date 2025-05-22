import { useEffect, useState } from 'react'
import AttendeesData from '@/data/attendees'

export function TestData() {
  const [attendees, setAttendees] = useState( )

  useEffect(() => {
    async function fetchData() {
      const data = await AttendeesData()
      if (data) setAttendees(data)
    }
    fetchData()
  }, []) // chạy 1 lần khi mount

  console.log(attendees)

  return (
    <>
      <h1>DANH SACH NGUOI THAM GIA</h1>
      <h1>{attendees}</h1>
    </>
  )
}
