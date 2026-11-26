import type { ReactNode } from 'react'

interface IconProps {
    size?: number
}

function Svg({ size = 20, children }: IconProps & { children: ReactNode }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            {children}
        </svg>
    )
}

export const MailIcon = (p: IconProps) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>
export const LockIcon = (p: IconProps) => <Svg {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Svg>
export const UserIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>
export const EyeIcon = (p: IconProps) => <Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>
export const EyeOffIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M17.94 17.94A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a18 18 0 0 1 4.06-5.06" />
        <path d="M9.9 4.24A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="m2 2 20 20" />
    </Svg>
)
export const CheckIcon = (p: IconProps) => <Svg {...p}><path d="m5 12 5 5 9-10" /></Svg>
