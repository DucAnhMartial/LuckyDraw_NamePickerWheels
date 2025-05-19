import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export default function SettingsSheet( { optionRemovePlayer, setOptionRemovePlayer, optionRemoveGift, setOptionRemoveGift }) {


  return (
    <Sheet>
      {/* Nút mở settings */}
      <SheetTrigger asChild>
        <button
          className={cn(
            'fixed top-4 right-4 z-50 p-2 md:p-3 lg:p-4',
            'rounded-full border-none bg-transparent',
            'hover:scale-110 transition-transform duration-200'
          )}
        >
          {/* Icon bánh răng mới (Lucide: Settings2) */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-10 h-10 md:w-12 md:h-12 text-yellow-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.066c1.527-.878 3.304.899 2.426 2.426a1.724 1.724 0 001.066 2.591c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.591c.878 1.527-.899 3.304-2.426 2.426a1.724 1.724 0 00-2.591 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.591-1.066c-1.527.878-3.304-.899-2.426-2.426a1.724 1.724 0 00-1.066-2.591c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.591c-.878-1.527.899-3.304 2.426-2.426a1.724 1.724 0 002.591-1.066z'
            />
            <circle cx='12' cy='12' r='3' />
          </svg>
        </button>
      </SheetTrigger>

      {/* Nội dung sheet */}
      <SheetContent position='right' size='sm' className='p-6'>
        <SheetHeader>
          <SheetTitle className='text-xl'>⚙️ Cài đặt</SheetTitle>
          <SheetDescription>Tuỳ chỉnh các lựa chọn trong ứng dụng</SheetDescription>
        </SheetHeader>

        <div className='flex flex-col space-y-6 mt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-semibold'>Xóa người chơi</h4>
              <p className='text-sm text-muted-foreground'>Xóa người chơi sau khi quay xong</p>
            </div>
            <Switch checked={optionRemovePlayer} onCheckedChange={setOptionRemovePlayer} />
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-semibold'>Xóa quà</h4>
              <p className='text-sm text-muted-foreground'>Xóa quà sau khi quay xong</p>
            </div>
            <Switch checked={optionRemoveGift} onCheckedChange={setOptionRemoveGift} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
