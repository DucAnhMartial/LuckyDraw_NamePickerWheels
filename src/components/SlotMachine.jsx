import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Màu nền xen kẽ cho các item
const COLORS = ['bg-gradient-to-r from-red-600/30 to-red-700/30', 'bg-gradient-to-r from-red-700/30 to-red-800/30']

// Style chữ khi đang quay và khi dừng
const TEXT_STYLES = {
  spinning: 'text-white text-opacity-90',
  stopped: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 font-bold'
}

const ITEM_HEIGHT = 60
const VISIBLE_ITEMS = 3

export default function SlotMachine({ participants, onWinner, isDrawing }) {
  const containerRef = useRef(null)
  const [displayList, setDisplayList] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [winnerIndex, setWinnerIndex] = useState(null)
  const [winnerDisplayIndex, setWinnerDisplayIndex] = useState(null)
  const animationRef = useRef(null)

  // Tạo list dài để quay liên tục (nhân 100 lần)
  const extendedList = useMemo(() => {
    let extended = []
    for (let i = 0; i < 100; i++) {
      extended = extended.concat(participants)
    }
    return extended
  }, [participants])


  // Hàm easing để giảm tốc khi dừng
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  const spin = () => {
    console.log(participants)
    if (spinning) return
    setSpinning(true)
    setWinnerIndex(null)
    setWinnerDisplayIndex(null)

    const len = participants.length
    const winner = Math.floor(Math.random() * len)

    const totalSteps = 400
    let currentStep = 0
    let scrollPos = 0

    // Vị trí dừng dựa trên index người thắng ở trong list dài
    const winnerIdxOnList = len * 80 + winner
    const stopPos = winnerIdxOnList * ITEM_HEIGHT - ITEM_HEIGHT

    function animate() {
      if (!containerRef.current) return

      currentStep++

      const t = currentStep / totalSteps
      const speed = easeOutCubic(1 - t) * 15

      scrollPos += speed

      // Xử lý cuộn vòng tròn (nếu scroll vượt max, thì reset)
      if (scrollPos > containerRef.current.scrollHeight - containerRef.current.clientHeight) {
        scrollPos -= containerRef.current.scrollHeight - containerRef.current.clientHeight
      }

      // Dừng khi đủ bước hoặc đạt vị trí dừng
      if (currentStep >= totalSteps || scrollPos >= stopPos) {
        containerRef.current.scrollTop = stopPos
        setSpinning(false)
        setWinnerIndex(winner)
        setWinnerDisplayIndex(winnerIdxOnList)
        cancelAnimationFrame(animationRef.current)
        if (onWinner) {
          onWinner(participants[winner])
        }
        return
      }

      containerRef.current.scrollTop = scrollPos
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Khi props isDrawing thay đổi thành true thì bắt đầu quay
  useEffect(() => {
    if (isDrawing) {
      spin()
    }
  }, [isDrawing])

  return (
    <div className='w-full h-full flex items-center justify-center relative overflow-hidden'>
      {/* Background radial gradient */}
      <div className='absolute inset-0 bg-gradient-radial from-red-800/40 via-red-900/30 to-red-950/30' />

      {/* Các viền gradient trang trí */}
      <div className='absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-yellow-500/20 to-transparent' />
      <div className='absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-yellow-500/20 to-transparent' />
      <div className='absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-yellow-500/20 to-transparent' />
      <div className='absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-yellow-500/20 to-transparent' />

      {/* Vạch chọn (highlight) */}
      <div className='absolute top-1/2 left-0 w-full h-[60px] -translate-y-1/2 bg-gradient-to-r from-yellow-500/5 via-yellow-400/30 to-yellow-500/5 border-y-2 border-yellow-400/70 z-20 flex items-center justify-between px-4'>
        <motion.div
          className='w-4 h-4 rounded-full bg-yellow-300'
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              '0 0 0px rgba(253, 224, 71, 0)',
              '0 0 10px rgba(253, 224, 71, 0.7)',
              '0 0 0px rgba(253, 224, 71, 0)'
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className='w-4 h-4 rounded-full bg-yellow-300'
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              '0 0 0px rgba(253, 224, 71, 0)',
              '0 0 10px rgba(253, 224, 71, 0.7)',
              '0 0 0px rgba(253, 224, 71, 0)'
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
        />
      </div>

      {/* Fade trên dưới */}
      <div className='absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-red-800 to-transparent z-10' />
      <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-red-800 to-transparent z-10' />

      {/* Container chứa list */}
      <div
        ref={containerRef}
        className='relative w-full overflow-hidden'
        style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
      >
        <AnimatePresence>
          {extendedList.map((p, i) => {
            const isWinner = i === winnerDisplayIndex
            const isCenter = i === winnerDisplayIndex
            const isAlmostCenter = i === winnerDisplayIndex - 1 || i === winnerDisplayIndex + 1
            const bgColor = i % 2 === 0 ? COLORS[0] : COLORS[1]
            const textStyle = isWinner ? TEXT_STYLES.stopped : TEXT_STYLES.spinning
            const blurAmount = spinning && !isCenter ? (isAlmostCenter ? 'blur-[1px]' : 'blur-sm') : 'blur-none'
            const glowEffect = isWinner ? 'drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]' : ''

            return (
              <motion.div
                key={i}
                className={`flex items-center justify-center h-[60px] text-lg font-semibold ${bgColor} ${textStyle} ${blurAmount} ${glowEffect}`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isCenter ? 1 : isAlmostCenter ? 0.85 : 0.7,
                  scale: isCenter ? 1.05 : 1
                }}
                transition={{ duration: spinning ? 0.1 : 0.4, ease: 'easeOut' }}
              >
                {p.display_name}
                {isWinner && (
                  <>
                    <motion.div
                      className='absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-300 rounded-full'
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                        boxShadow: [
                          '0 0 5px rgba(253, 224, 71, 0.5)',
                          '0 0 15px rgba(253, 224, 71, 0.8)',
                          '0 0 5px rgba(253, 224, 71, 0.5)'
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div
                      className='absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-300 rounded-full'
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                        boxShadow: [
                          '0 0 5px rgba(253, 224, 71, 0.5)',
                          '0 0 15px rgba(253, 224, 71, 0.8)',
                          '0 0 5px rgba(253, 224, 71, 0.5)'
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    />
                  </>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Trạng thái */}
      <div className='absolute bottom-3 right-3 text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-red-900/70 to-red-800/70 border border-yellow-500/30 text-yellow-200 shadow-inner'>
        {spinning ? 'Đang quay...' : 'Hoàn thành!'}
      </div>
    </div>
  )
}
