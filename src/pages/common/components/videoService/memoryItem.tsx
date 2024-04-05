import React from 'react'

type Props = {
  isLight: boolean
}

export const MemoryItem: React.FC<Props> = ({ isLight }) => {
  return (
    <span className={`inline-block w-[4px] h-[8px] ${isLight ? 'bg-blue-400' : 'bg-gray-300'}`}></span>
  )
}