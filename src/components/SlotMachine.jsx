import React, { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useAnimation } from 'framer-motion'

// Các hằng số cho slot
const ITEM_HEIGHT = 60
const VISIBLE_ITEMS = 5
const CENTER_SLOT = Math.floor(VISIBLE_ITEMS / 2)
const ROUNDS = 60 // số vòng “full” để quay
const BUFFER_LOOPS = 2 // số vòng đệm tránh blank khi easing overshoot
const REPEAT = ROUNDS + BUFFER_LOOPS + 1 // lặp thêm buffer để đảm bảo không bị blank
const DURATION = 20 // thời gian quay (s)

// Hàm shuffle Fisher–Yates
function shuffleArray(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SlotMachine({ participants = [], isDrawing = false, onWinner }) {
  const controls = useAnimation()
  const [winnerListIdx, setWinnerListIdx] = useState(null)
  const [shuffledList, setShuffledList] = useState([])
  const prevIsDrawing = useRef(false)

  // Khi isDrawing chuyển từ false -> true, shuffle và lưu vào state
  useEffect(() => {
    if (isDrawing && !prevIsDrawing.current) {
      setShuffledList(shuffleArray(participants))
      setWinnerListIdx(null)
    }
    prevIsDrawing.current = isDrawing
  }, [isDrawing, participants])

  // Tạo extendedList đủ dài: REPEAT vòng, dựa trên shuffledList
  const extendedList = useMemo(
    () => Array.from({ length: REPEAT }, () => shuffledList).flat(),
    [shuffledList]
  )

  // approximate cubic-bezier cho hiệu ứng expo
  const easeExpo = [0.19, 1, 0.22, 1]

  // Chạy animation khi bắt đầu draw và shuffledList đã được thiết lập
  useEffect(() => {
    if (!isDrawing || shuffledList.length === 0) return

    // Chọn ngẫu nhiên winner từ shuffledList
    const winnerIdx = Math.floor(Math.random() * shuffledList.length)
    const targetIdx = ROUNDS * shuffledList.length + winnerIdx
    const targetY = -(targetIdx * ITEM_HEIGHT - CENTER_SLOT * ITEM_HEIGHT)

    controls.set({ y: 0 })
    controls
      .start({ y: targetY, transition: { duration: DURATION, ease: easeExpo } })
      .then(() => {
        setWinnerListIdx(targetIdx)
        onWinner?.(extendedList[targetIdx])
      })
  }, [isDrawing, shuffledList, controls, onWinner, extendedList])

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Khung highlight giữa */}
      <div className="absolute top-1/2 left-0 w-full h-[60px] -translate-y-1/2 border-y-2 border-yellow-300 bg-yellow-500/10 z-20 pointer-events-none" />
      {/* Container overflow */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
      >
        <motion.div animate={controls} style={{ willChange: 'transform' }}>
          {extendedList.map((p, i) => {
            const isWinner = i === winnerListIdx
            return (
              <div
                key={i}
                className={`flex items-center justify-center h-[60px] text-2xl font-extrabold border-b-[0.1px] transition-all ${
                  isWinner
                    ? 'text-yellow-400 bg-yellow-700/20 shadow-inner scale-105'
                    : 'text-white/80'
                }`}
              >
                {p.display_name ?? p.name ?? p}
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
