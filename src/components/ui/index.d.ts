declare module '@/components/ui/sheet' {
  import { ReactNode } from 'react'
  
  export const Sheet: (props: { children: ReactNode }) => ReactNode
  export const SheetTrigger: (props: { asChild?: boolean; children: ReactNode }) => ReactNode
  export const SheetContent: (props: { 
    position?: string
    size?: string
    className?: string
    children: ReactNode 
  }) => ReactNode
  export const SheetHeader: (props: { children: ReactNode; className?: string }) => ReactNode
  export const SheetTitle: (props: { children: ReactNode; className?: string }) => ReactNode
  export const SheetDescription: (props: { children: ReactNode }) => ReactNode
  export const SheetClose: (props: { asChild?: boolean; children: ReactNode }) => ReactNode
  export const SheetPortal: (props: { children: ReactNode }) => ReactNode
  export const SheetOverlay: (props: { className?: string; children: ReactNode }) => ReactNode
  export const SheetFooter: (props: { children: ReactNode; className?: string }) => ReactNode
}

declare module '@/components/ui/switch' {
  import { ReactNode } from 'react'
  
  export interface SwitchProps {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
    className?: string
  }
  
  export const Switch: (props: SwitchProps) => ReactNode
}
