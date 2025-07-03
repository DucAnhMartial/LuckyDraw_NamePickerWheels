import LuckyDraw from './pages/LuckyDraw'

function App() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: 'url(\'/luckydraw.jpg\')',
        backgroundPosition: 'center 1px'
      }}
    >
      <LuckyDraw />
    </main>
  )
}
export default App