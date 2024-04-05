import React, { FC } from 'react'
import ArrowRight from '../../../assets/icons/menu/arrowRightSmall.svg'
import clsx from 'clsx'

type Props = {
  onClickHandler: () => void;
  text: string;
  showArrow?: boolean;
  secondary?: boolean;
  deleteType?: boolean;
  smallText?: boolean;
}

export const ButtonUnderline: FC<Props> = ({ onClickHandler, text, showArrow, deleteType, secondary, smallText }) => {
  const color = clsx(
    {
      'fill-red-400': deleteType,
      'fill-gray-300': secondary,
      'fill-blue-400': !deleteType && !secondary,
    },
  )

  const colorText = clsx(
    'text-sm font-bold mr-2 hover:underline',
    {
      'text-xs font-normal mr-[4px]': smallText,
      'text-red-400': deleteType,
      'text-gray-300': secondary,
      'text-blue-400': !deleteType && !secondary,
    },
  )

  return (
    <div className="flex items-center cursor-pointer" onClick={onClickHandler}>
      <p className={colorText}>{text}</p>
      {showArrow && <ArrowRight className={color} />}
    </div>
  )
}
