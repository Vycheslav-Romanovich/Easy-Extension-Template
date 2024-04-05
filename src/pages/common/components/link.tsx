import React, { ComponentType } from 'react'

import { OnClickHandler } from '../../../constants/types'
import { Link as Link2 } from '../../options/router'
import clsx from 'clsx'

type PropsType = {
  children?: React.ReactNode
  className?: string
  type: 'primary' | 'danger'
  onClick?: OnClickHandler
  href?: string
  component?: ComponentType<any>
}

const Link: React.FC<PropsType> = ({ onClick, children, className, type, component }) => {
  const linkClassName = clsx('font-semibold text-sm cursor-pointer hover:underline', {
    'text-blue-400 dark:text-blue-300': type === 'primary',
    'text-red-400 dark:text-red-300': type === 'danger',
  })

  if (component) {
    return (
      <Link2 className={`${className} ${linkClassName}`} onClick={onClick} component={component}>
        {children}
      </Link2>
    )
  }

  return (
    <div className={`${className} ${linkClassName}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default Link
