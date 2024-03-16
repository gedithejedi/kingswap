import { Spinner } from "./Spinner"

type ButtonProps = {
    type?: 'primary' | 'secondary'
    className?: string
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    isLoading?: boolean
}

export default function Button({
    type,
    className,
    children,
    onClick,
    disabled,
    isLoading,
}: ButtonProps) {
    const colorStyle = type === 'primary' ? `bg-primary ${disabled ? '' : 'hover:bg-primary-focus'}` : `bg-gray-dark ${disabled ? '' : 'hover:bg-gray-darker'}`
    const disabledStyle = disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''

    return (
        <button
            className={`${colorStyle} flex gap-2 items-center justify-center py-2 text-white rounded-lg ${disabledStyle} ${className}`}
            onClick={onClick}
            disabled={isLoading || disabled}
        >
            {isLoading && <Spinner />}
            {children}
        </button>
    )
}