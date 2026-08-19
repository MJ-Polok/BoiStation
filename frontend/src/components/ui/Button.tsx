import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
    icon?: ReactNode;
    variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#111827] text-white hover:bg-[#243041]',
    secondary: 'border border-[#D8D2C4] bg-transparent text-[#111827] hover:bg-[#F4EFE6]',
};

const Button = ({ children, className = '', icon, variant = 'primary', ...props }: ButtonProps) => {
    return (
        <a
        
            className={twMerge(
                'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]',
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
            {icon}
        </a>
    );
};

export default Button;