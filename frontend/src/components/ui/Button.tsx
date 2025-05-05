import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    disabled = false,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background';

    const variantClasses = {
        primary: 'bg-primary hover:bg-primary-hover text-white',
        secondary: 'bg-border hover:bg-opacity-80 text-text',
        outline: 'border border-border hover:bg-border text-text',
        ghost: 'hover:bg-border text-text'
    };

    const sizeClasses = {
        sm: 'text-xs h-8 px-3',
        md: 'text-sm h-10 px-4',
        lg: 'text-base h-12 px-6'
    };

    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer';

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

    return (
        <button className={buttonClasses} disabled={disabled} {...props}>
            {children}
        </button>
    );
};

export default Button;
