import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Volume2, Music, Users, Image, Timer } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import type { Session } from '@/types/session'

// Keys cho localStorage
const STORAGE_KEYS = {
  SPINNING_AUDIO: 'lucky_draw_spinning_audio',
  WINNER_AUDIO: 'lucky_draw_winner_audio',
  BACKGROUND_IMAGE: 'lucky_draw_background_image',
  SPIN_DURATION: 'lucky_draw_spin_duration'
}

// Default values
const DEFAULT_SPINNING_AUDIO = '' // YouTube ID hoặc direct URL
const DEFAULT_WINNER_AUDIO = 'https://res.cloudinary.com/dyub0dnkb/video/upload/v1748331626/audio_pyrrli.mp4'
const DEFAULT_BACKGROUND_IMAGE = '/luckydraw.jpg'
const DEFAULT_SPIN_DURATION = 30 // giây

export interface AudioSettings {
  spinningAudio: string
  winnerAudio: string
}

// Hook để lấy và lưu background image
export function useBackgroundImage(): [string, (url: string) => void] {
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_BACKGROUND_IMAGE)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BACKGROUND_IMAGE)
    if (saved) {
      setBackgroundImage(saved)
    }
  }, [])

  const updateBackgroundImage = (url: string) => {
    const finalUrl = url || DEFAULT_BACKGROUND_IMAGE
    setBackgroundImage(finalUrl)
    localStorage.setItem(STORAGE_KEYS.BACKGROUND_IMAGE, finalUrl)
  }

  return [backgroundImage, updateBackgroundImage]
}

// Hook để lấy và lưu spin duration
export function useSpinDuration(): [number, (duration: number) => void] {
  const [spinDuration, setSpinDuration] = useState(DEFAULT_SPIN_DURATION)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPIN_DURATION)
    if (saved) {
      const parsed = parseInt(saved)
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 300) {
        setSpinDuration(parsed)
      }
    }
  }, [])

  const updateSpinDuration = (duration: number) => {
    const finalDuration = Math.max(1, Math.min(300, duration)) // Giới hạn 1-300 giây
    setSpinDuration(finalDuration)
    localStorage.setItem(STORAGE_KEYS.SPIN_DURATION, finalDuration.toString())
  }

  return [spinDuration, updateSpinDuration]
}

// Hook để lấy và lưu audio settings
export function useAudioSettings(): [AudioSettings, (settings: Partial<AudioSettings>) => void] {
  const [settings, setSettings] = useState<AudioSettings>({
    spinningAudio: DEFAULT_SPINNING_AUDIO,
    winnerAudio: DEFAULT_WINNER_AUDIO
  })

  // Load từ localStorage khi mount
  useEffect(() => {
    const spinningAudio = localStorage.getItem(STORAGE_KEYS.SPINNING_AUDIO) ?? DEFAULT_SPINNING_AUDIO
    const winnerAudio = localStorage.getItem(STORAGE_KEYS.WINNER_AUDIO) ?? DEFAULT_WINNER_AUDIO
    setSettings({ spinningAudio, winnerAudio })
  }, [])

  // Hàm update settings
  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      if (newSettings.spinningAudio !== undefined) {
        localStorage.setItem(STORAGE_KEYS.SPINNING_AUDIO, newSettings.spinningAudio)
      }
      if (newSettings.winnerAudio !== undefined) {
        localStorage.setItem(STORAGE_KEYS.WINNER_AUDIO, newSettings.winnerAudio)
      }
      return updated
    })
  }

  return [settings, updateSettings]
}

// Helper function để lấy settings từ localStorage (dùng cho components không dùng hook)
export function getAudioSettings(): AudioSettings {
  return {
    spinningAudio: localStorage.getItem(STORAGE_KEYS.SPINNING_AUDIO) ?? DEFAULT_SPINNING_AUDIO,
    winnerAudio: localStorage.getItem(STORAGE_KEYS.WINNER_AUDIO) ?? DEFAULT_WINNER_AUDIO
  }
}

interface SettingsProps {
  audioSettings: AudioSettings
  onAudioSettingsChange: (settings: Partial<AudioSettings>) => void
  sessions: Session[]
  selectedSession: Session | null
  onSessionChange: (session: Session | null) => void
  backgroundImage: string
  onBackgroundImageChange: (url: string) => void
  spinDuration: number
  onSpinDurationChange: (duration: number) => void
}

export default function Settings({ 
  audioSettings, 
  onAudioSettingsChange,
  sessions,
  selectedSession,
  onSessionChange,
  backgroundImage,
  onBackgroundImageChange,
  spinDuration,
  onSpinDurationChange
}: SettingsProps) {
  const [localSpinningAudio, setLocalSpinningAudio] = useState(audioSettings.spinningAudio)
  const [localWinnerAudio, setLocalWinnerAudio] = useState(audioSettings.winnerAudio)
  const [localBackgroundImage, setLocalBackgroundImage] = useState(backgroundImage)
  const [localSpinDuration, setLocalSpinDuration] = useState(spinDuration)
  const [isOpen, setIsOpen] = useState(false)

  // Sync local state khi settings thay đổi
  useEffect(() => {
    setLocalSpinningAudio(audioSettings.spinningAudio)
    setLocalWinnerAudio(audioSettings.winnerAudio)
  }, [audioSettings])

  useEffect(() => {
    setLocalBackgroundImage(backgroundImage)
  }, [backgroundImage])

  useEffect(() => {
    setLocalSpinDuration(spinDuration)
  }, [spinDuration])

  const handleSave = () => {
    onAudioSettingsChange({
      spinningAudio: localSpinningAudio,
      winnerAudio: localWinnerAudio
    })
    onBackgroundImageChange(localBackgroundImage)
    onSpinDurationChange(localSpinDuration)
    setIsOpen(false)
  }

  const handleReset = () => {
    setLocalSpinningAudio(DEFAULT_SPINNING_AUDIO)
    setLocalWinnerAudio(DEFAULT_WINNER_AUDIO)
    setLocalBackgroundImage(DEFAULT_BACKGROUND_IMAGE)
    setLocalSpinDuration(DEFAULT_SPIN_DURATION)
    onAudioSettingsChange({
      spinningAudio: DEFAULT_SPINNING_AUDIO,
      winnerAudio: DEFAULT_WINNER_AUDIO
    })
    onBackgroundImageChange(DEFAULT_BACKGROUND_IMAGE)
    onSpinDurationChange(DEFAULT_SPIN_DURATION)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="fixed top-3 right-6 z-50 p-2.5 bg-gradient-to-r from-[#00599b] to-blue-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-400 transition-all duration-200 hover:scale-110"
          title="Cài đặt"
        >
          <SettingsIcon className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="bg-gradient-to-b from-[#002f4b] to-[#00599b] border-l-2 border-blue-400/50 text-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-xl flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Cài đặt
          </SheetTitle>
          <SheetDescription className="text-blue-200">
            Tùy chỉnh session và âm thanh cho Lucky Draw
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Session Selector */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100">
              <Users className="h-4 w-4" />
              Chọn Session
            </label>
            <select
              value={selectedSession?.id.toString() ?? ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  onSessionChange(null)
                } else {
                  const session = sessions.find(s => s.id === parseInt(e.target.value))
                  if (session) {
                    onSessionChange(session)
                  }
                }
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer appearance-none"
            >
              <option value="" className="bg-[#002f4b] text-white">Tất cả Session</option>
              {sessions.length === 0 ? (
                <option className="bg-[#002f4b] text-white">Đang tải...</option>
              ) : (
                sessions.map((session) => (
                  <option
                    key={session.id}
                    value={session.id.toString()}
                    className="bg-[#002f4b] text-white"
                  >
                    {session.name}
                  </option>
                ))
              )}
            </select>
            <p className="text-xs text-blue-200/70">
              Chọn session để lọc danh sách người tham gia.
            </p>
          </div>

          {/* Background Image */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100">
              <Image className="h-4 w-4" />
              Ảnh nền (URL)
            </label>
            <input
              type="text"
              value={localBackgroundImage}
              onChange={(e) => setLocalBackgroundImage(e.target.value)}
              placeholder="VD: https://example.com/background.jpg"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <p className="text-xs text-blue-200/70">
              Dán link ảnh để thay đổi background. Để trống để dùng ảnh mặc định.
            </p>
            {/* Preview background */}
            {localBackgroundImage && (
              <div className="mt-2 rounded-lg overflow-hidden border border-white/20">
                <img 
                  src={localBackgroundImage} 
                  alt="Background preview" 
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/luckydraw.jpg'
                  }}
                />
              </div>
            )}
          </div>

          {/* Spin Duration */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100">
              <Timer className="h-4 w-4" />
              Thời gian quay (giây)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="50"
                value={localSpinDuration}
                onChange={(e) => setLocalSpinDuration(parseInt(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <input
                type="number"
                min="1"
                max="50"
                value={localSpinDuration}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (!isNaN(val)) {
                    setLocalSpinDuration(Math.max(1, Math.min(50, val)))
                  }
                }}
                className="w-16 px-2 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-blue-200 text-sm">giây</span>
            </div>
            <p className="text-xs text-blue-200/70">
              Thời gian vòng quay chạy (1-50 giây). Mặc định: 30 giây.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20" />

          {/* Spinning Audio */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100">
              <Music className="h-4 w-4" />
              Nhạc khi quay (YouTube ID hoặc URL)
            </label>
            <input
              type="text"
              value={localSpinningAudio}
              onChange={(e) => setLocalSpinningAudio(e.target.value)}
              placeholder="VD: atq9S7pp1rQ hoặc https://..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <p className="text-xs text-blue-200/70">
              Để trống nếu không muốn nhạc khi quay. Dùng YouTube ID (11 ký tự) hoặc link MP3/MP4 trực tiếp.
            </p>
          </div>

          {/* Winner Audio */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100">
              <Volume2 className="h-4 w-4" />
              Nhạc khi trúng thưởng (URL)
            </label>
            <input
              type="text"
              value={localWinnerAudio}
              onChange={(e) => setLocalWinnerAudio(e.target.value)}
              placeholder="VD: https://example.com/winner.mp3"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <p className="text-xs text-blue-200/70">
              Link trực tiếp đến file MP3/MP4 cho nhạc chiến thắng.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
            >
              Lưu cài đặt
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Mặc định
            </button>
          </div>

          {/* Preview Section */}
          <div className="pt-4 border-t border-white/20">
            <h4 className="text-sm font-medium text-blue-100 mb-3">Xem trước âm thanh</h4>
            <div className="space-y-2">
              {localWinnerAudio && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-200">Nhạc chiến thắng:</span>
                  <audio controls src={localWinnerAudio} className="h-8 flex-1" />
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
