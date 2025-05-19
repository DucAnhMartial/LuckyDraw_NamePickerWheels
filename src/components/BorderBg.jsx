export default function BorderBg() {
  return (
    <>
      <div className="fixed top-0 left-0 w-20 h-20 border-t-8 border-l-8 border-yellow-400 rounded-tl-xl" />
      <div className="fixed top-0 right-0 w-20 h-20 border-t-8 border-r-8 border-yellow-400 rounded-tr-xl" />
      <div className="fixed bottom-0 left-0 w-20 h-20 border-b-8 border-l-8 border-yellow-400 rounded-bl-xl" />
      <div className="fixed bottom-0 right-0 w-20 h-20 border-b-8 border-r-8 border-yellow-400 rounded-br-xl" />
    </>
  )
}
