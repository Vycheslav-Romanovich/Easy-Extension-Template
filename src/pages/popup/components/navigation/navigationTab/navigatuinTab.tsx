import React, { ReactElement } from 'react'

type PropType = {
  image?: ReactElement;
  title: string;
  text?: string;
  badge?: number;
  className?: string;
  img?: string;
  onClick: () => void;
  active: boolean;
  isPracticeFinished?: boolean
};

export const NavigationTab: React.FC<PropType> = ({ image, onClick, title, active, isPracticeFinished }) => {
  return (
    <div style={{ height: 96, width: 96 }}
         onClick={onClick}
         className={`group grow relative z-20 flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
    >
      <div>
        <div className={`group relative z-20 flex flex-col items-center cursor-pointer ${active && 'h-[96px] rounded-b-xl bg-gray-980'}`}>
          <div className={`mb-3 mt-4 fill-current dark:text-white group-hover:text-blue-400 text-blue-400 
                ${active ? 'text-blue-400' : 'text-gray-400'}`}>
            {image}
          </div>

          <span className={`dark:text-gray-200 w-20 text-center group-hover:text-blue-400
                ${active ? 'text-blue-400' : 'text-gray-800'}`}>
              {title}
            </span>
        </div>
      </div>

      {active && <div
        style={{ height: 5, width: 84 }}
        className={`z-30 absolute rounded-b-lg top-0 bg-blue-400 ts:hidden ovS:hidden`}
      />}

      {/* {isPracticeFinished &&
        <div className='absolute rounded-full bg-yellow-800 w-13px h-13px top-[16px] right-[32px] z-[100]' />} */}
    </div>
  )
}
