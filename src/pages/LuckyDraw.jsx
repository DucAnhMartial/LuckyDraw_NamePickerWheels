
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

import PluseDots from '@/components/PluseDots'
import ButtonDraw from '@/components/ButtonDraw'
import BorderBg from '@/components/BorderBg'
import PopMenu from '@/components/PopMenu'
import Confetti from '@/components/confetti'

import { getDataListPrizes, getListAttendees } from '@/api/getData'

function LuckyDraw() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isDrawing, setDrawing] = useState(false)
  const [winner, setWinner] = useState(null)
  const [selectedGift, setSelectedGift] = useState(null) // ✅ Lưu phần quà quay trúng
  const [drawCount, setDrawCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const [attendees, setAttendees] = useState([])
  const [gift, setGift] = useState([])
  const [optionRemovePlayer, setOptionRemovePlayer] = useState(false)
  const [optionRemoveGift, setOptionRemoveGift] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const prizeData = await getDataListPrizes()
      const attendeesFetch = await getListAttendees()
      setGift(prizeData)
      setAttendees(attendeesFetch)
    }

    fetchData()
  }, [])

  const handleClick = () => {
    const nextIndex = (selectedIndex + 1) % gift.length
    setSelectedIndex(nextIndex)
  }

  const drawWiner = () => {
    if (attendees.length === 0 || isDrawing || gift.length === 0) return

    const prizeToAssign = gift[selectedIndex]
    setSelectedGift(prizeToAssign)

    setDrawing(true)
    setWinner(null)
    setShowConfetti(false)

    const randomIndex = Math.floor(Math.random() * attendees.length)
    const selectedWinner = attendees[randomIndex]

    setTimeout(() => {
      setWinner(selectedWinner)
      setDrawing(false)
      setDrawCount(prev => prev + 1)
      setShowConfetti(true)

      if (optionRemovePlayer) {
        setAttendees(prev => prev.filter(p => p.uuid !== selectedWinner.uuid))
      }

      if (optionRemoveGift) {
        const indexToRemove = selectedIndex

        setGift(currentGifts => {
          const newGifts = currentGifts.filter((_, index) => index !== indexToRemove)

          if (newGifts.length === 0) {
            setSelectedIndex(0)
          } else if (indexToRemove >= newGifts.length) {
            setSelectedIndex(0)
          }

          return newGifts
        })
      }

    }, 6500)
  }

  return (
    <div className='text-center flex-col'>
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
        <div className='pt-10 pb-6 w-[700px] '>
          <h2 className='text-xl text-yellow-200 mb-4'>GIẢI THƯỞNG HIỆN TẠI</h2>
          <select
            className='
              bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600
              text-red-900 font-bold text-2xl py-4 px-6 rounded-lg shadow-inner
              border-2 border-yellow-300 cursor-pointer w-full text-center
              hover:from-yellow-500 hover:to-yellow-400 transition-all
              appearance-none
            '
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            {gift.map((item, index) => (
              <option
                key={index}
                value={index}
                className='hover:bg-red-600 font-bold text-2xl text-red-900 text-center bg-yellow-500'
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <PluseDots
          winner={winner}
          isDrawing={isDrawing}
          participants={attendees}
          selectedPrize={selectedGift?.name ?? 'Đang tải...'}
        />

        <div className='mt-6 text-center'>
          <p className='text-yellow-200'>
            <span className='font-bold'>{attendees.length}</span> Người tham gia •
            <span className='font-bold ml-1'>{drawCount}</span> lượt quay
          </p>
        </div>

        <ButtonDraw onClick={drawWiner} />
      </div>

      <BorderBg />

      <PopMenu
        optionRemovePlayer={optionRemovePlayer}
        setOptionRemovePlayer={setOptionRemovePlayer}
        optionRemoveGift={optionRemoveGift}
        setOptionRemoveGift={setOptionRemoveGift}
      />
    </div>
  )
}

export default LuckyDraw
