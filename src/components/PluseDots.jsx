'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Trophy, SnowflakeIcon as Confetti, X, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SpinningNameWheel from '@/components/SpinningNameWheel'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function PulseDots({ winner, isDrawing, participants, selectedPrize }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (winner) {
      setOpen(true)
    }
  }, [winner])

  return (
    <div className='mt-8 relative w-full'>
      <div
        className={cn(
          'h-64 flex items-center justify-center rounded-xl border-4 border-dashed border-yellow-400 bg-gradient-to-b from-red-800/50 to-red-900/50 transition-all overflow-hidden',
          (winner || isDrawing) && 'bg-red-700/50 border-solid'
        )}
      >
        {isDrawing ? (
          <div className='w-full h-full relative'>
            <SpinningNameWheel participants={participants} />
          </div>
        ) : (
          <div className='text-center text-white/80'>
            <p className='text-xl mb-2'>Người chiến thắng sẽ xuất hiện ở đây</p>
            <p className='text-lg'>Nhấn 'Quay Ngay!' để chọn người may mắn</p>
          </div>
        )}

        {/* Decorative elements */}
        <div className='absolute top-2 left-2 w-4 h-4 rounded-full bg-yellow-300 animate-pulse' />
        <div className='absolute top-2 right-2 w-4 h-4 rounded-full bg-yellow-300 animate-pulse' />
        <div className='absolute bottom-2 left-2 w-4 h-4 rounded-full bg-yellow-300 animate-pulse' />
        <div className='absolute bottom-2 right-2 w-4 h-4 rounded-full bg-yellow-300 animate-pulse' />
      </div>

      {/* Dialog hiển thị người chiến thắng */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className='w-[95%] max-w-2xl'
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  >
                    {/* Visually Hidden Title for accessibility */}
                    <VisuallyHidden>
                      <Dialog.Title>Thông báo người chiến thắng</Dialog.Title>
                    </VisuallyHidden>

                    <div className='relative overflow-hidden rounded-2xl bg-gradient-to-b from-red-600 to-red-800 p-2'>
                      {/* Confetti background pattern */}
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
                        {/* Close button */}
                        <Dialog.Close asChild>
                          <button className='absolute right-5 top-5 p-1.5 rounded-full bg-red-100 hover:bg-red-200 transition-colors'>
                            <X className='h-5 w-5 text-red-600' />
                            <span className='sr-only'>Đóng</span>
                          </button>
                        </Dialog.Close>

                        {/* Animated confetti icons */}
                        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                          {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: -20, x: i % 2 === 0 ? -10 : 10, opacity: 0 }}
                              animate={{
                                y: 100 + i * 30,
                                x: i % 2 === 0 ? 20 : -20,
                                opacity: [0, 1, 0],
                                rotate: i % 2 === 0 ? 180 : -180
                              }}
                              transition={{
                                duration: 2 + i * 0.2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: 'loop',
                                delay: i * 0.2
                              }}
                              className='absolute'
                              style={{ left: `${10 + i * 10}%` }}
                            >
                              <Confetti className='h-5 w-5 text-yellow-500' />
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className='mb-4 text-red-600 font-bold text-2xl uppercase tracking-wider'
                        >
                          CHÚC MỪNG
                        </motion.div>

                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 15,
                            delay: 0.3
                          }}
                          className='relative'
                        >
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-24 h-24 rounded-full bg-yellow-500/20 animate-ping' />
                          </div>
                          <div className='relative bg-gradient-to-b from-yellow-500 to-yellow-600 p-6 rounded-full w-36 h-36 mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/20'>
                            <Trophy className='h-20 w-20 text-yellow-100' />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className='mt-6'
                        >
                          <h3 className='text-4xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent'>
                            {winner?.name}
                          </h3>
                          <div className='inline-flex items-center justify-center gap-2 bg-red-100 text-red-700 px-5 py-2.5 rounded-full text-xl font-medium mt-3'>
                            <span>Mã số:</span>
                            <span className='font-bold'>{winner?.luckycode}</span>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                          className='mt-8 flex items-center justify-center gap-2 text-2xl text-gray-700'
                        >
                          <Award className='h-7 w-7 text-red-500' />
                          <span>
                            Đã trúng <span className='font-bold text-red-600'>{selectedPrize}</span>
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                        >
                          <button
                            onClick={() => setOpen(false)}
                            className='mt-10 px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-2xl rounded-full hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 font-medium'
                          >
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
    </div>
  )
}
