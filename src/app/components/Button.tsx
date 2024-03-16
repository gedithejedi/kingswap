type ButtonProps = {
    type?: 'primary' | 'secondary'
    className?: string
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
}

export default function Button ({ 
    type,
    className,
    children,
    onClick,
    disabled
}: ButtonProps) {
    const colorStyle = type === 'primary' ? `bg-primary ${disabled ? '' : 'hover:bg-primary-focus'}` : `bg-gray-dark ${disabled ? '' : 'hover:bg-gray-darker'}`
    const disabledStyle = disabled ? 'cursor-not-allowed opacity-50' : ''
    return (
        <button           
            className={`${colorStyle} py-2 text-white rounded ${className} ${disabledStyle}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}