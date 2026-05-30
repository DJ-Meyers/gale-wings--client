import type { ButtonHTMLAttributes, ComponentType, SVGProps } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary hover:bg-primary-hover text-white disabled:opacity-50 disabled:hover:bg-primary',
  secondary:
    'border border-border bg-transparent text-text-dim hover:text-text disabled:opacity-50 disabled:hover:text-text-dim',
  tertiary:
    'bg-transparent text-text-muted hover:text-text disabled:opacity-50 disabled:hover:text-text-muted',
  danger:
    'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:hover:bg-red-600',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`inline-flex cursor-pointer items-center justify-center rounded ${variantClasses[variant]} ${sizeClasses[size]} ${children ? '' : size === 'sm' ? '!p-1.5' : '!p-2'} ${className}`.trim()}
    {...props}
  >
    {Icon && children ? (
      <span className="inline-flex items-center gap-1 leading-none">
        <Icon className={iconSizeClasses[size]} />
        {children}
      </span>
    ) : Icon ? (
      <Icon className={iconSizeClasses[size]} />
    ) : (
      children
    )}
  </button>
)
