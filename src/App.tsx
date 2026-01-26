import LuckyDraw from './pages/LuckyDraw'
import { useBackgroundImage, useSpinDuration } from './components/Settings'

function App() {
  const [backgroundImage, setBackgroundImage] = useBackgroundImage()
  const [spinDuration, setSpinDuration] = useSpinDuration()

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundPosition: 'center 1px'
      }}
    >
      <LuckyDraw 
        backgroundImage={backgroundImage}
        onBackgroundImageChange={setBackgroundImage}
        spinDuration={spinDuration}
        onSpinDurationChange={setSpinDuration}
      />
    </main>
  )
}
export default App
