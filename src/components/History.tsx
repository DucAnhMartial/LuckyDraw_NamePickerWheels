import { useState, useEffect } from 'react'
import { History as HistoryIcon, Trophy, User, Calendar, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { getDataLuckyDrawHistory, getDataListPrizes } from '@/api/getData'
import type { LuckyDrawLog } from '@/types/history'
import type { Attendee } from '@/types/attendee'

interface HistoryWithAttendee extends LuckyDrawLog {
  attendee?: Attendee
}

interface PrizeInfo {
  id: number
  name: string
  prize?: string
  amount?: number
}

interface GroupedHistory {
  prize: PrizeInfo
  winners: HistoryWithAttendee[]
}

export default function History() {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<HistoryWithAttendee[]>([])
  const [prizes, setPrizes] = useState<PrizeInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedPrizes, setExpandedPrizes] = useState<Set<number>>(new Set())

  // Fetch data khi mở
  const fetchHistory = async () => {
    setLoading(true)
    try {
      const [historyData, prizesData] = await Promise.all([
        getDataLuckyDrawHistory(),
        getDataListPrizes()
      ])
      setHistory(historyData)
      
      // Lấy tất cả prizes (kể cả đã hết)
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/v1/lucky-draw/prizes`, {
        headers: {
          'Authorization': `Basic ${btoa(`${import.meta.env.VITE_USERNAME}:${import.meta.env.VITE_PASSWORD}`)}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const allPrizes = await response.json()
        setPrizes(allPrizes)
      } else {
        setPrizes(prizesData)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen])

  // Nhóm lịch sử theo giải thưởng
  const groupedHistory: GroupedHistory[] = prizes.map(prize => {
    const winners = history.filter(h => h.prize === prize.id)
    return {
      prize,
      winners
    }
  }).filter(group => group.winners.length > 0) // Chỉ hiện giải có người trúng

  // Toggle expand/collapse
  const togglePrize = (prizeId: number) => {
    setExpandedPrizes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(prizeId)) {
        newSet.delete(prizeId)
      } else {
        newSet.add(prizeId)
      }
      return newSet
    })
  }

  // Expand all
  const expandAll = () => {
    setExpandedPrizes(new Set(groupedHistory.map(g => g.prize.id)))
  }

  // Collapse all
  const collapseAll = () => {
    setExpandedPrizes(new Set())
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 hover:scale-105 flex items-center gap-2"
          title="Lịch sử quay"
        >
          <HistoryIcon className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Lịch sử</span>
        </button>
      </SheetTrigger>
      <SheetContent className="bg-gradient-to-b from-[#002f4b] to-[#00599b] border-l-2 border-amber-400/50 text-white overflow-y-auto w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-white text-xl flex items-center gap-2">
            <HistoryIcon className="h-5 w-5" />
            Lịch sử quay thưởng
          </SheetTitle>
          <SheetDescription className="text-blue-200">
            Danh sách người trúng thưởng theo từng giải
          </SheetDescription>
        </SheetHeader>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={expandAll}
            className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-all"
          >
            Mở tất cả
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-all"
          >
            Thu gọn
          </button>
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <p className="text-sm text-blue-200">
            Tổng cộng: <span className="font-bold text-white">{history.length}</span> người trúng thưởng
            {' • '}
            <span className="font-bold text-white">{groupedHistory.length}</span> giải đã có người trúng
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-400"></div>
            <span className="mt-3 text-blue-200">Đang tải...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && groupedHistory.length === 0 && (
          <div className="mt-8 text-center text-blue-200">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có lịch sử quay thưởng</p>
          </div>
        )}

        {/* Grouped list */}
        {!loading && groupedHistory.length > 0 && (
          <div className="mt-6 space-y-3">
            {groupedHistory.map(({ prize, winners }) => (
              <div key={prize.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                {/* Prize header - clickable */}
                <button
                  onClick={() => togglePrize(prize.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Trophy className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white">{prize.name}</h3>
                      {prize.prize && (
                        <p className="text-sm text-amber-300">{prize.prize}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-amber-500/30 rounded-full text-sm font-bold text-amber-300">
                      {winners.length} người
                    </span>
                    {expandedPrizes.has(prize.id) ? (
                      <ChevronUp className="h-5 w-5 text-white/50" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white/50" />
                    )}
                  </div>
                </button>

                {/* Winners list - collapsible */}
                {expandedPrizes.has(prize.id) && (
                  <div className="border-t border-white/10">
                    {winners.map((winner, idx) => (
                      <div
                        key={winner.id}
                        className={`p-3 flex items-center gap-3 ${idx !== winners.length - 1 ? 'border-b border-white/5' : ''}`}
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-500/20 rounded-full text-sm font-bold text-blue-300">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-300 flex-shrink-0" />
                            <span className="font-medium text-white truncate">
                              {winner.attendee?.display_name || `Ticket #${winner.ticket}`}
                            </span>
                          </div>
                          {winner.attendee?.lucky_id && (
                            <p className="text-xs text-blue-300 mt-0.5">
                              Mã số: {winner.attendee.lucky_id}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
                            <Calendar className="h-3 w-3" />
                            {formatDate(winner.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
