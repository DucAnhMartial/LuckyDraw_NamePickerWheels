import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Trophy, SnowflakeIcon as Confetti, X, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SlotMachine from './SlotMachine'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { postDataHistoryLucky } from '@/api/getData'
import type { Attendee } from '@/types/attendee'

interface PlusedotsProps {
  isDrawing: boolean;
  participants: Attendee[];
  onDialogOpen?: (isOpen: boolean) => void;
  onWinnerSelected?: (winner: Attendee) => void;
  selectedPrizeId?: number | null;
  prize?: {
    id: number;
    name: string;
    description: string;
    level?: number;
    prize?: string;
    [key: string]: any;
  };
  spinningAudioUrl?: string;
  winnerAudioUrl?: string;
  spinDuration?: number;
}

export default function PulseDots({
  isDrawing,
  participants,
  onDialogOpen,
  onWinnerSelected,
  selectedPrizeId,
  prize,
  spinningAudioUrl = '',
  winnerAudioUrl = '',
  spinDuration = 6
}: PlusedotsProps) {
  const [open, setOpen] = useState(false)
  const [localWinner, setLocalWinner] = useState<Attendee | null>(null)
  const [shouldPlayWinnerAudio, setShouldPlayWinnerAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Khi localWinner thay đổi - chỉ mở dialog, không phát nhạc ngay
  useEffect(() => {
    if (!localWinner) {
      setOpen(false)
      setShouldPlayWinnerAudio(false)
      return
    }
    setOpen(true)
    onDialogOpen?.(true)
    onWinnerSelected?.(localWinner)
    // Đánh dấu cần phát nhạc
    setShouldPlayWinnerAudio(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localWinner]) // Chỉ phụ thuộc vào localWinner để tránh gọi lại khi callback reference thay đổi

  // Phát nhạc winner khi dialog mở và được đánh dấu
  useEffect(() => {
    if (open && shouldPlayWinnerAudio && winnerAudioUrl && audioRef.current) {
      // Delay một chút để đảm bảo dialog đã render
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => {})
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open, shouldPlayWinnerAudio, winnerAudioUrl])

  // Gửi lịch sử quay thưởng
  useEffect(() => {
    if (!localWinner || !selectedPrizeId || !prize) return
    if (prize.level !== undefined) {
      postDataHistoryLucky(localWinner, prize as any).catch(console.error)
    }
  }, [localWinner, selectedPrizeId, prize])

  const handleWinner = (winner: Attendee) => setLocalWinner(winner)

  const handleDialogClose = () => {
    // Dừng nhạc trước
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    // Reset states
    setShouldPlayWinnerAudio(false)
    setOpen(false)
    setLocalWinner(null)
    onDialogOpen?.(false)
  }

  return (
    <div className='mt-8 relative w-[750px]'>
      {/* Phần SlotMachine và các hiệu ứng */}
      <div
        className={cn(
          'h-80 flex items-center justify-center rounded-xl border-4 border-dashed border-yellow-400 bg-gradient-to-b from-red-800/50 to-red-900/50 overflow-hidden',
          (localWinner || isDrawing)
        )}
      >
        <div className='w-full h-full relative'>
          <SlotMachine
            participants={participants}
            onWinner={handleWinner}
            isDrawing={isDrawing}
            gifts={prize}
            spinningAudioUrl={spinningAudioUrl}
            spinDuration={spinDuration}
          />
        </div>
        {/* Pulse dots */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos, i) => {
          const classes: Record<string, string> = {
            'top-left': 'top-2 left-2',
            'top-right': 'top-2 right-2',
            'bottom-left': 'bottom-2 left-2',
            'bottom-right': 'bottom-2 right-2'
          }
          return (
            <div
              key={i}
              className={`absolute ${classes[pos]} w-4 h-4 rounded-full bg-yellow-300 animate-pulse`}
            />
          )
        })}
      </div>

      {/* Dialog người chiến thắng */}
      <Dialog.Root open={open} onOpenChange={handleDialogClose}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className='fixed inset-0 flex items-center justify-center z-50'
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.div
                    className='w-[95%] max-w-2xl'
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  >
                    <VisuallyHidden><Dialog.Title>Thông báo người chiến thắng</Dialog.Title></VisuallyHidden>
                    <div className='relative overflow-hidden rounded-2xl bg-gradient-to-b from-red-600 to-red-800 p-2'>
                      {/* Confetti background */}
                      <div className='absolute inset-0 opacity-10'>
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className='absolute w-4 h-4 rounded-full bg-yellow-300'
                            style={{
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              opacity: Math.random() * 0.5 + 0.5
                            }}
                          />
                        ))}
                      </div>
                      <div className='relative bg-gradient-to-b from-yellow-50 to-orange-50 rounded-xl p-10 shadow-xl text-center'>
                        <Dialog.Close asChild>
                          <button className='absolute right-5 top-5 p-1.5 rounded-full bg-red-100 hover:bg-red-200'>
                            <X className='h-5 w-5 text-red-600' /><span className='sr-only'>Đóng</span>
                          </button>
                        </Dialog.Close>
                        {/* Animated confetti icons */}
                        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                          {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: -20, x: i%2===0?-10:10, opacity: 0 }}
                              animate={{ y: 100+i*30, x: i%2===0?20:-20, opacity:[0, 1, 0], rotate: i%2===0?180:-180 }}
                              transition={{ duration:2+i*0.2, repeat:Infinity, repeatType:'loop', delay:i*0.2 }}
                              className='absolute'
                              style={{ left: `${10+i*10}%` }}
                            >
                              <Confetti className='h-5 w-5 text-yellow-500' />
                            </motion.div>
                          ))}
                        </div>
                        <motion.div initial={{ y:10, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.2, duration:0.5 }}
                          className='mb-4 text-red-600 font-bold text-2xl uppercase tracking-wider'>
                          CHÚC MỪNG
                        </motion.div>
                        <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:300, damping:15, delay:0.3 }}
                          className='relative flex flex-col items-center gap-4'>
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-40 h-40 rounded-full bg-yellow-500/20 animate-ping' />
                          </div>
                          <div className='relative bg-gradient-to-b from-yellow-400 to-yellow-500 p-4 rounded-full w-40 h-40 flex items-center justify-center shadow-lg shadow-yellow-500/30'>
                            <Trophy className='h-20 w-20 text-yellow-100' />
                          </div>
                        </motion.div>
                        <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.5, duration:0.5 }}
                          className='mt-6'>
                          <h3 className='text-4xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent'>
                            {localWinner?.display_name}
                          </h3>
                          <div className='inline-flex items-center justify-center gap-2 bg-red-100 text-red-700 px-5 py-2.5 rounded-full text-xl font-medium mt-3'>
                            <span>Mã số:</span> <span className='font-bold'>{localWinner?.lucky_id}</span>
                          </div>
                        </motion.div>
                        <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.7, duration:0.5 }}
                          className='mt-8 flex items-center justify-center gap-2 text-2xl text-gray-700'>
                          <Award className='h-7 w-7 text-red-500' />
                          <span>Đã trúng <span className='font-bold text-red-600'>{prize?.name} - {prize?.prize}</span></span>
                        </motion.div>
                        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.9, duration:0.5 }}>
                          <button onClick={handleDialogClose}
                            className='mt-10 px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-2xl rounded-full hover:from-red-700 hover:to-red-800 shadow-lg'>
                            Đóng
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Audio phát khi có người chiến thắng */}
      {winnerAudioUrl && (
        <audio ref={audioRef} src={winnerAudioUrl} preload="auto" hidden />
      )}
    </div>
  )
}
