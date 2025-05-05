import React from 'react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode | string
    title?: string
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    title,
    variant = 'ghost',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) => {
    const baseClasses =
        'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'

    const variantClasses = {
        primary: 'bg-primary hover:bg-primary-hover text-white',
        secondary: 'bg-border hover:bg-opacity-80 text-text',
        outline: 'border border-border hover:bg-border text-text',
        ghost: 'hover:bg-border text-text',
    }

    const sizeClasses = {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
    }

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`

    return (
        <button className={buttonClasses} title={title} disabled={disabled} {...props}>
            {typeof icon === 'string' ? icon : icon}
        </button>
    )
}

export default IconButton
