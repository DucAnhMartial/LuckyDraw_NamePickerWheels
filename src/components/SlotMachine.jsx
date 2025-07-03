import React, { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useAnimation } from 'framer-motion'
import YouTube from 'react-youtube'

// Các hằng số cho Slot Machine
const ITEM_HEIGHT = 60
const VISIBLE_ITEMS = 5
const CENTER_SLOT = Math.floor(VISIBLE_ITEMS / 2)
const ROUNDS = 5
const BUFFER_LOOPS = 2
const REPEAT = ROUNDS + BUFFER_LOOPS + 1
const DURATION = 20
const YOUTUBE_ID = 'atq9S7pp1rQ'
const PLAY_TIME = 0

// Hàm shuffle Fisher–Yates
function shuffleArray(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SlotMachine({ participants = [], isDrawing = false, onWinner, gifts }) {
  const controls = useAnimation()
  const [winnerListIdx, setWinnerListIdx] = useState(null)
  const [shuffledList, setShuffledList] = useState([])
  const prevIsDrawing = useRef(false)
  const playerRef = useRef(null)

  const onReady = event => {
    playerRef.current = event.target
    playerRef.current.seekTo(PLAY_TIME, true)
  }

  // Xử lý khi trạng thái trình phát YouTube thay đổi
  const onStateChange = event => {
    if (event.data === YouTube.PlayerState.PLAYING && !isDrawing) {
      event.target.pauseVideo()
    }
  }

  // Khi bắt đầu quay: shuffle danh sách và reset trạng thái
  useEffect(() => {
    if (isDrawing && !prevIsDrawing.current) {
      setShuffledList(shuffleArray(participants))
      setWinnerListIdx(null)

      if (playerRef.current) {
        playerRef.current.seekTo(PLAY_TIME, true)
        playerRef.current.playVideo()
      }
    }
    prevIsDrawing.current = isDrawing
  }, [isDrawing, participants])

  // Tạo extendedList đủ dài để quay nhiều vòng
  const extendedList = useMemo(
    () => Array.from({ length: REPEAT }, () => shuffledList).flat(),
    [shuffledList]
  )

  const easeExpo = [0.19, 1, 0.22, 1]

  useEffect(() => {
    if (!isDrawing || shuffledList.length === 0) return
    let winnerIdx
    const targetId = parseInt(gifts.description)
    winnerIdx = shuffledList.findIndex(p => p.id === targetId)
    if (winnerIdx === -1) {
      winnerIdx = Math.floor(Math.random() * shuffledList.length) // chọn ngẫu nhiên
    }
    const targetIdx = ROUNDS * shuffledList.length + winnerIdx
    const targetY = -(targetIdx * ITEM_HEIGHT - CENTER_SLOT * ITEM_HEIGHT)

    controls.set({ y: 0 })
    controls
      .start({ y: targetY, transition: { duration: DURATION, ease: easeExpo } })
      .then(() => {
        if (playerRef.current) {
          playerRef.current.stopVideo()
        }
        setWinnerListIdx(targetIdx)
        onWinner?.(extendedList[targetIdx])
      })
  }, [isDrawing, shuffledList, controls, onWinner, extendedList])

  if (!participants.length) {
    return (
      <div className="text-center text-white text-xl font-semibold">
        Chưa có người tham gia
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#002f4b] rounded-lg shadow-lg">
      {/* Fade top/bottom */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <div className="absolute top-0 w-full h-[100px] bg-gradient-to-b from-[#002f4b] to-transparent" />
        <div className="absolute bottom-0 w-full h-[100px] bg-gradient-to-t from-[#002f4b] to-transparent" />
      </div>

      {/* Highlight center */}
      <div className="absolute top-1/2 left-0 w-full h-[60px] -translate-y-1/2 border-y-2 border-[#00aaff] bg-[#00aaff]/20 z-20 pointer-events-none rounded-sm shadow-inner" />

      {/* Slot list */}
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
                className={`flex items-center justify-center h-[60px] text-2xl font-semibold border-b border-white/10 transition-all duration-300 ${
                  isWinner
                    ? 'text-yellow-300 bg-[#0072c6]/30 scale-105 shadow-inner'
                    : 'text-white/80'
                }`}
              >
                {p.display_name ?? p.name ?? p}
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Nhạc nền YouTube (ẩn) */}
      {YOUTUBE_ID && (
        <div style={{ width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
          <YouTube
            videoId={YOUTUBE_ID}
            opts={{
              playerVars: {
                autoplay: 0,
                controls: 0,
                start: PLAY_TIME,
                playlist: YOUTUBE_ID, // cần thiết để loop
                loop: 1,
                modestbranding: 1,
                fs: 0
              }
            }}
            onReady={onReady}
            onStateChange={onStateChange} // Thêm sự kiện này
          />
        </div>
      )}
    </div>
  )
}