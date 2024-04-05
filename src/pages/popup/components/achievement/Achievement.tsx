import React, { FC } from 'react'

type Props = {
  title: string,
  ImageIco: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

export const Achievement: FC<Props> = ({title, ImageIco}) => {
  return (
    <div className='flex flex-col gap-[6px] items-center text-gray-400 basis-1/4'>
      <ImageIco />
      <span className='break-words max-w-[80px] text-center'>{title}</span>
    </div>
  )
}
