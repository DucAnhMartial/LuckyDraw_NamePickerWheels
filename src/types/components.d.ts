declare module '@/components/ButtonDraw' {
  import { ReactNode } from 'react'
  interface ButtonDrawProps {
    onClick: () => void
    disabled: boolean
    onMouseEnter?: () => void
  }
  const ButtonDraw: (props: ButtonDrawProps) => ReactNode
  export default ButtonDraw
}

declare module '@/components/BorderBg' {
  import { ReactNode } from 'react'
  const BorderBg: () => ReactNode
  export default BorderBg
}

declare module '@/components/confetti' {
  import { ReactNode } from 'react'
  interface ConfettiProps {
    active: boolean
  }
  const Confetti: (props: ConfettiProps) => ReactNode
  export default Confetti
}
