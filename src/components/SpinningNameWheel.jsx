import { useEffect, useState } from 'react'

export default function SpinningNameWheel({ participants }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!participants || participants.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % participants.length)
    }, 100)

    return () => clearInterval(interval)
  }, [participants])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-4xl font-bold text-white animate-pulse">
        {`${participants[currentIndex].name} - ${participants[currentIndex].luckycode}`}
      </div>
    </div>
  )
}
