import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

import PluseDots from '@/components/PluseDots'
import ButtonDraw from '@/components/ButtonDraw'
import BorderBg from '@/components/BorderBg'
import Confetti from '@/components/confetti'

import { getDataListPrizes, getDataListAttendees } from '@/api/getData'

// Biến cache ngoài component
let attendeesCache = null
let prizesCache = null

function LuckyDraw() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isDrawing, setDrawing] = useState(false)
  const [winner, setWinner] = useState(null)
  const [selectedGift, setSelectedGift] = useState(null)
  const [drawCount, setDrawCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [attendees, setAttendees] = useState([])
  const [gift, setGift] = useState([])
  const [loading, setLoading] = useState(true)

  // Prefetch khi hover vào nút quay hoặc khi trang load
  const prefetchData = async () => {
    if (!attendeesCache) {
      attendeesCache = await getDataListAttendees()
    }
    if (!prizesCache) {
      prizesCache = await getDataListPrizes()
    }
  }

  // Lọc unique theo tên prize
  const uniqueGifts = useMemo(() => {
    const seen = new Set()
    return gift.reduce((arr, item) => {
      if (!seen.has(item.name)) {
        seen.add(item.name)
        arr.push(item)
      }
      return arr
    }, [])
  }, [gift])

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      setLoading(true)
      try {
        // Nếu đã có cache thì dùng luôn, không thì fetch và cache lại
        if (!attendeesCache) attendeesCache = await getDataListAttendees()
        if (!prizesCache) prizesCache = await getDataListPrizes()
        if (!cancelled) {
          setAttendees(attendeesCache)
          setGift(prizesCache)
        }
      } catch (e) {
        //console.error('Error when calling API', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    // Cleanup tránh memory leak
    return () => { cancelled = true }
  }, [])

  // Nhận kết quả từ SlotMachine
  const handleWinnerSelected = (selectedWinner) => {
    setWinner(selectedWinner)
    // Xóa người chơi vừa trúng
    if (selectedWinner?.id) {
      setAttendees(prev => prev.filter(p => p.id !== selectedWinner.id))
      attendeesCache = attendeesCache?.filter(p => p.id !== selectedWinner.id)
    }
    // Xóa giải thưởng đã trao
    if (selectedGift?.id) {
      setGift(prev => prev.filter(item => item.id !== selectedGift.id))
      prizesCache = prizesCache?.filter(item => item.id !== selectedGift.id)
      setSelectedIndex(0)
    }
  }

  // Thực hiện quay
  const drawWinner = () => {
    if (attendees.length === 0 || isDrawing || uniqueGifts.length === 0) return

    const prizeToAssign = uniqueGifts[selectedIndex]
    setSelectedGift(prizeToAssign)
    setDrawing(true)
    setWinner(null)
    setShowConfetti(false)

    setTimeout(() => {
      setDrawing(false)
      setDrawCount(prev => prev + 1)
    }, 6500)
  }

  // Xử lý mở/đóng dialog
  const handleDialogOpen = (isOpen) => {
    setShowConfetti(isOpen)
    if (!isOpen) {
      setWinner(null)
    }
  }

  // Overlay loading toàn màn hình
  const loadingOverlay = loading && (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#002f4bcc] backdrop-blur-sm">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <span className="mt-6 text-white text-2xl font-bold">Đang tải dữ liệu...</span>
    </div>
  )

  return (
    <div className='text-center flex-col relative'>
      {loadingOverlay}
      {showConfetti && <Confetti active={showConfetti} />}
      <motion.div
        className='relative mb-8 text-center'
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-6xl md:text-8xl font-extrabold text-white drop-shadow-2xl tracking-wide'>
          Lucky Draw
        </h1>
        <Sparkles className='absolute bottom-0 left-0 w-12 h-12 text-white opacity-75 animate-pulse' />
      </motion.div>

      <div className='flex flex-col items-center border-[#00599b] bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-[10px] w-[800px]'>
        <div className='pt-10 pb-6 w-[700px]'>
          <h2 className='text-xl text-white font-bold mb-4'>GIẢI THƯỞNG HIỆN TẠI</h2>
          <select
            className='bg-gradient-to-r from-[#00599b] via-blue-400 to-[#00599b] text-white font-bold text-2xl py-4 px-6 rounded-lg shadow-inner border border-white/30 cursor-pointer w-full text-center hover:from-blue-600 hover:to-blue-400 transition-all appearance-none'
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            disabled={uniqueGifts.length === 0}
            onMouseEnter={prefetchData} // Prefetch khi hover vào select
          >
            {uniqueGifts.length === 0 ? (
              <option className='text-center'>Đang tải...</option>
            ) : (
              uniqueGifts.map((item, idx) => (
                <option
                  key={item.id}
                  value={idx}
                  className='hover:bg-[#00599b] font-bold text-2xl text-white text-center bg-blue-500'
                >
                  {item.name}
                </option>
              ))
            )}
          </select>
        </div>

        <PluseDots
          isDrawing={isDrawing}
          participants={attendees}
          selectedPrize={selectedGift?.name ?? 'Đang tải...'}
          selectedPrizeId={selectedGift?.id ?? null}
          prize={selectedGift}
          onDialogOpen={handleDialogOpen}
          onWinnerSelected={handleWinnerSelected}
        />

        <div className='mt-6 text-center'>
          <p className='text-white font-semibold'>
            <span className='font-bold'>{attendees.length}</span> Người tham gia •{' '}
            <span className='font-bold'>{drawCount}</span> lượt quay
          </p>
          {winner && (
            <div className='mt-3 text-white bg-[#00599b]/80 p-2 rounded-lg shadow'>
              <p>
                Người chiến thắng: <span className='font-bold'>{winner.display_name}</span>
              </p>
            </div>
          )}
        </div>

        <ButtonDraw
          onClick={drawWinner}
          disabled={isDrawing || uniqueGifts.length === 0 || attendees.length === 0}
          onMouseEnter={prefetchData} // Prefetch khi hover vào nút quay
        />
      </div>

      <BorderBg />
    </div>
  )
}

export default LuckyDraw