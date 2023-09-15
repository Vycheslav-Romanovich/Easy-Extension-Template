import React from 'react'

interface IProps {
  text: string
  onClick?: ((event: React.MouseEvent<any>) => void) | undefined
}

const Button: React.FC<IProps> = ({ text, onClick }) => {
  return (
    <button className='w-full h-12 px-2 py-1 text-base text-black' onClick={onClick}>
      {text}
    </button>
  )
}

export default Button