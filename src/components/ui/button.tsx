import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  asLink?: string
}

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  destructive: 'bg-red-600 text-white hover:bg-red-700'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  asLink,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-block font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  if (asLink) {
    return (
      <Link to={asLink} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  )
}