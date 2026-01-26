import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useAnimation } from 'framer-motion'
import YouTube from 'react-youtube'
import type { Attendee } from '@/types/attendee'

// Các hằng số cho Slot Machine
const ITEM_HEIGHT = 60
const VISIBLE_ITEMS = 5
const CENTER_SLOT = Math.floor(VISIBLE_ITEMS / 2)
const MIN_ITEMS_TO_SPIN = 150 // Số items tối thiểu phải quay qua (tăng để quay nhanh hơn)
const PLAY_TIME = 0

// Helper function để kiểm tra có phải YouTube ID không
function isYouTubeId(str: string): boolean {
  // YouTube ID thường có 11 ký tự và chỉ chứa chữ cái, số, gạch ngang, gạch dưới
  return /^[a-zA-Z0-9_-]{11}$/.test(str)
}

// Helper function để extract YouTube ID từ URL
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  if (isYouTubeId(url)) return url
  
  // Thử parse URL YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  
  return null
}

// Hàm shuffle Fisher–Yates
function shuffleArray<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = a[i]!
    a[i] = a[j]!
    a[j] = temp
  }
  return a
}

interface SlotMachineProps {
  participants?: Attendee[];
  isDrawing?: boolean;
  onWinner?: (winner: Attendee) => void;
  gifts?: {
    description: string;
    [key: string]: any;
  };
  spinningAudioUrl?: string; // YouTube ID, YouTube URL, hoặc direct audio URL
  spinDuration?: number; // Thời gian quay (giây)
}

export default function SlotMachine({
  participants = [],
  isDrawing = false,
  onWinner,
  gifts,
  spinningAudioUrl = '',
  spinDuration = 6
}: SlotMachineProps) {
  const controls = useAnimation()
  const [winnerListIdx, setWinnerListIdx] = useState<number | null>(null)
  const [shuffledList, setShuffledList] = useState<Attendee[]>([])
  const prevIsDrawing = useRef(false)
  const playerRef = useRef<any>(null)
  const directAudioRef = useRef<HTMLAudioElement>(null)
  const hasCalledWinner = useRef(false) // Track để không gọi onWinner nhiều lần

  // Xác định loại audio source
  const youtubeId = extractYouTubeId(spinningAudioUrl)
  const isDirectAudio = spinningAudioUrl && !youtubeId

  const onReady = (event: any) => {
    playerRef.current = event.target
    playerRef.current.seekTo(PLAY_TIME, true)
  }

  // Xử lý khi trạng thái trình phát YouTube thay đổi
  const onStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.PLAYING && !isDrawing) {
      event.target.pauseVideo()
    }
  }

  // Khi bắt đầu quay: shuffle danh sách và reset trạng thái
  useEffect(() => {
    if (isDrawing && !prevIsDrawing.current) {
      // Reset flag khi bắt đầu quay mới
      hasCalledWinner.current = false
      setShuffledList(shuffleArray(participants))
      setWinnerListIdx(null)

      // Phát nhạc khi bắt đầu quay
      if (youtubeId && playerRef.current) {
        playerRef.current.seekTo(PLAY_TIME, true)
        playerRef.current.playVideo()
      } else if (isDirectAudio && directAudioRef.current) {
        directAudioRef.current.currentTime = 0
        directAudioRef.current.play().catch(() => {})
      }
    }
    
    // Dừng nhạc khi ngừng quay (nhưng không dừng ngay khi component update)
    if (!isDrawing && prevIsDrawing.current) {
      // Dừng nhạc direct audio
      if (directAudioRef.current) {
        directAudioRef.current.pause()
        directAudioRef.current.currentTime = 0
      }
    }
    
    prevIsDrawing.current = isDrawing
  }, [isDrawing, participants, youtubeId, isDirectAudio])

  // Tạo extendedList đủ dài để quay nhiều vòng (đảm bảo tối thiểu MIN_ITEMS_TO_SPIN items)
  const extendedList = useMemo(() => {
    if (shuffledList.length === 0) return []
    // Tính số lần lặp cần thiết để đạt tối thiểu MIN_ITEMS_TO_SPIN items
    const repeatCount = Math.max(Math.ceil(MIN_ITEMS_TO_SPIN / shuffledList.length) + 2, 3)
    return Array.from({ length: repeatCount }, () => shuffledList).flat()
  }, [shuffledList])

  // Easing curve: nhanh lâu, chậm rất ngắn ở cuối
  // [0.02, 0.95, 0.05, 1] - quay nhanh 95% thời gian, chỉ chậm 5% cuối
  const easeSmooth = [0.02, 0.99, 0.01, 1]

  // Animation quay - chỉ chạy khi shuffledList thay đổi và isDrawing = true
  useEffect(() => {
    if (!isDrawing || shuffledList.length === 0 || hasCalledWinner.current) return
    
    // Tìm người chiến thắng
    let winnerIdx: number
    const targetId = parseInt(gifts?.description || '0')
    winnerIdx = shuffledList.findIndex(p => p.id === targetId)
    if (winnerIdx === -1) {
      winnerIdx = Math.floor(Math.random() * shuffledList.length)
    }
    
    // Tính vị trí dừng: đảm bảo quay qua ít nhất MIN_ITEMS_TO_SPIN items
    const minSpinItems = MIN_ITEMS_TO_SPIN
    const repeatCount = Math.floor(minSpinItems / shuffledList.length)
    const targetIdx = repeatCount * shuffledList.length + winnerIdx
    const targetY = -(targetIdx * ITEM_HEIGHT - CENTER_SLOT * ITEM_HEIGHT)

    controls.set({ y: 0 })
    controls
      .start({ y: targetY, transition: { duration: spinDuration, ease: easeSmooth } })
      .then(() => {
        // Kiểm tra lại để tránh gọi nhiều lần
        if (hasCalledWinner.current) return
        hasCalledWinner.current = true
        
        // Dừng nhạc YouTube
        if (playerRef.current) {
          playerRef.current.stopVideo()
        }
        // Dừng direct audio
        if (directAudioRef.current) {
          directAudioRef.current.pause()
          directAudioRef.current.currentTime = 0
        }
        setWinnerListIdx(targetIdx)
        const winner = extendedList[targetIdx]
        if (winner) {
          onWinner?.(winner)
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffledList]) // Chỉ phụ thuộc vào shuffledList - shuffledList chỉ thay đổi khi bắt đầu quay mới

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
                {p.display_name ?? p.attendee_email ?? 'Unknown'}
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Nhạc nền YouTube (ẩn) */}
      {youtubeId && (
        <div style={{ width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
          <YouTube
            videoId={youtubeId}
            opts={{
              playerVars: {
                autoplay: 0,
                controls: 0,
                start: PLAY_TIME,
                playlist: youtubeId, // cần thiết để loop
                loop: 1,
                modestbranding: 1,
                fs: 0
              }
            }}
            onReady={onReady}
            onStateChange={onStateChange}
          />
        </div>
      )}

      {/* Nhạc nền direct audio (ẩn) */}
      {isDirectAudio && (
        <audio
          ref={directAudioRef}
          src={spinningAudioUrl}
          preload="auto"
          loop
          hidden
        />
      )}
    </div>
  )
}
