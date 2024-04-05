import React from 'react'
import { OnClickHandler } from '../../../constants/types'
import clsx from 'clsx'

type PropsType = {
  text?: string
  className?: string
  type: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'secondaryDisabled'
  size?: 'base' | 'lg'
  onClick?: OnClickHandler
  component?: React.ReactNode
  submit?: boolean
  disabled?: boolean
}

const Button: React.FC<PropsType> = ({ onClick, disabled, submit, size = 'base', text, className, type, children, component }) => {
  const buttonClassName = clsx(
    {
      'h-12 text-base font-medium': size === 'lg',
    },
    'h-10 w-full rounded flex justify-center items-center font-semibold text-sm cursor-pointer select-none focus:outline-none',
    {
      'bg-blue-400 dark:bg-blue-400 text-white bg-gradient-to-r hover:from-blue-400 hover:to-blue-800 active:from-blue-800 active:to-blue-800 dark:active:from-blue-800 dark:active:to-blue-800 disabled:cursor-default dark:disabled:bg-gray-450 disabled:from-gray-400 disabled:to-gray-400':
        type === 'primary',
      'bg-blue-100 text-blue-400 hover:border hover:border-blue-800 active:bg-blue-800 active:text-white dark:bg-blue-300 dark:active:from-blue-800 dark:active:to-blue-800 dark:disabled:bg-gray-400 dark:text-white dark:disabled:text-white disabled:text-gray-400 disabled:border-0 disabled:cursor-default':
        type === 'secondary',
      'bg-gray-800 text-white dark:border-white hover:border-2 hover:border-blue-800 active:bg-blue-800': type === 'tertiary',
      'bg-[#5F6368] justify-center text-white disabled:border-0 cursor-not-allowed':
      type === 'disabled',
      'bg-blue-100 text-blue-400 cursor-default': type === 'secondaryDisabled',
    }
  )

  return (
    <button
      type={submit ? 'submit' : 'button'}
      disabled={disabled}
      className={`${className} ${buttonClassName}`}
      onClick={onClick}
      // removed inline style, why are they???
      style={{ height: '40px', border: 'none', fontSize: '14px' }}
    >
      {text}
      {component}
      {children}
    </button>
  )
}

export default Button
