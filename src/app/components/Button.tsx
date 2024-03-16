type ButtonProps = {
    type?: 'primary' | 'secondary'
    className?: string
    children: React.ReactNode
    onClick: () => void
}

export default function Button ({ 
    type,
    className,
    children,
    onClick
}: ButtonProps) {
    const colorStyle = type === 'primary' ? 'bg-primary hover:bg-primary-focus' : 'bg-gray-dark hover:bg-gray-darker'
    return (
        <button           
            className={`${colorStyle} py-2 text-white rounded ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}