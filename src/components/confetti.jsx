import ReactConfetti from 'react-confetti'

export default function Confetti({ active }) {


  if (!active) return null

  return (
    <ReactConfetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false}
      numberOfPieces={1000}
      gravity={0.15}
      colors={['#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#FF0000', '#FF3333', '#FFFFFF']}
      tweenDuration={10000}
    />
  )
}
