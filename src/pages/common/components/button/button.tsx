import React from 'react'

interface IProps {
  text: string
  onClick?: ((event: React.MouseEvent<any>) => void) | undefined
}

const Button: React.FC<IProps> = ({ text, onClick }) => {
  return (
    <button className='w-full h-8 px-4 py-1 text-base text-black bg-gray-100 active:bg-gray-300 border border-gray-400 rounded' onClick={onClick}>
      {text}
    </button>
  )
}

export default Button