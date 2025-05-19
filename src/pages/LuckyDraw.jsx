import giftsData from '@/data/gifts.json'
import { useEffect, useState } from 'react'
import peopleData from '@/data/people.json'
import PluseDots from '@/components/PluseDots'
import ButtonDraw from '@/components/ButtonDraw'
import BorderBg from '@/components/BorderBg'
import PopMenu from '@/components/PopMenu'
import Confetti from '@/components/confetti'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
function LuckyDraw() {

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isDrawing, setDrawing] = useState(false)
  const [winner, setWinner] = useState(null)
  const [drawCount, setDrawCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const [people, setPeople] = useState(peopleData)
  const [gift, setGift] = useState(giftsData)
  const [optionRemovePlayer, setOptionRemovePlayer] = useState(false)
  const [optionRemoveGift, setOptionRemoveGift] = useState(false)

  const handleClick = () => {
    const nextIndex = ( selectedIndex + 1 ) % gift.length
    setSelectedIndex(nextIndex)
  }

  const drawWiner = () => {
    if (people.length === 0 || isDrawing) return

    setDrawing(true)
    setWinner(null)
    setShowConfetti(false)

    const randomIndex = Math.floor(Math.random() * people.length)
    const selectedWinner = people[randomIndex]

    setTimeout(() => {
      setWinner(selectedWinner)
      setDrawing(false)
      setDrawCount(drawCount + 1)
      setShowConfetti(true)


      if (optionRemovePlayer) {
        setPeople(currentPeople =>
          currentPeople.filter(person => person.uuid !== selectedWinner.uuid)
        )
      }

      if (optionRemoveGift) {
        setGift(currentGifts => {
          const newGifts = currentGifts.filter((_, index) => index !== selectedIndex)

          if (newGifts.length === 0) {
            setSelectedIndex(0)
          } else if (selectedIndex >= newGifts.length) {
            setSelectedIndex(0)
          }

          return newGifts
        })
      }
      //console.log('Người trúng:', selectedWinner)
    }, 6500)
  }

  return (

    <div className='text-center flex-col' >
      {showConfetti && <Confetti active={showConfetti} />}
      <motion.div
        className='relative mb-8 text-center'
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-6xl md:text-8xl font-bold text-yellow-300 drop-shadow-[0_0_25px_rgba(255,255,0,0.6)] tracking-wider'>
          Lucky Draw
        </h1>
        <div className='absolute -top-10 -right-10 text-yellow-300 animate-pulse'>
          <Sparkles className='w-16 h-16' />
        </div>
        <div className='absolute -bottom-10 -left-10 text-yellow-300 animate-pulse'>
          <Sparkles className='w-16 h-16' />
        </div>
        <div className='absolute inset-0 bg-gradient-radial from-red-500/50 to-transparent -z-10 blur-xl rounded-full scale-150' />
      </motion.div>
      <div className='flex flex-col items-center border-8 border-yellow-400 p-[10px] w-[800px]'>
        <div className='pt-10 pb-6 w-[700px] transform transition-transform duration-300 hover:scale-110  '>
          <h2 className='text-xl text-yellow-200 mb-4'>GIẢI THƯỞNG HIỆN TẠI</h2>
          <div
            className='bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-red-900 font-bold text-2xl py-4 px-6 rounded-lg shadow-inner border-2 border-yellow-300 cursor-pointer hover:from-yellow-500 hover:to-yellow-500 transition-all'
            onClick={handleClick}
          >
            {gift[selectedIndex].name}
          </div>
        </div>
        <PluseDots
          winner = {winner}
          isDrawing = {isDrawing}
          participants={people}
          selectedPrize={gift[selectedIndex].name}
        />
        <div className='mt-6 text-center'>
          <p className='text-yellow-200'>
            <span className='font-bold'>{people.length}</span> Người tham gia •
            <span className='font-bold ml-1'>{drawCount}</span> lượt quay
          </p>
        </div>
        <ButtonDraw onClick = {drawWiner} />
      </div>
      <BorderBg />
      <PopMenu
        optionRemovePlayer={optionRemovePlayer}
        setOptionRemovePlayer={setOptionRemovePlayer}
        optionRemoveGift={optionRemoveGift}
        setOptionRemoveGift={setOptionRemoveGift} />
    </div>
  )
}
export default LuckyDraw