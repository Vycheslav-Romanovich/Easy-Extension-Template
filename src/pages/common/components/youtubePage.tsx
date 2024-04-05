import React from 'react'

type PropsType = {
  children: React.ReactNode
  className?: string
}

const YoutubePage: React.FC<PropsType> = ({ children, className }) => {
  return (
    <div
      style={{ maxWidth: 402, width: 402, minWidth: 377, height: '100%' }}
      onClick={(e) => e.stopPropagation()}
      className={`${className} w-full`}
    >
      <div className="w-full" style={{ height: '100%' }}>
        {children}
      </div>
    </div>
  )
}

export default YoutubePage
