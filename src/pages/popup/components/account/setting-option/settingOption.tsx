import React, { useState } from 'react';
import ArrowRight from '../../../../../assets/icons/menu/arrowRight.svg'


type PropsType = {
  className?: string;
  title?: string;
  textToolType?: string;
  text: string | React.ReactNode;
  options?: React.ReactNode;
  imgToolType?: React.ReactNode;
  mediaClass?: string;
};

export const SettingOption: React.FC<PropsType> = ({
                                                     className,
                                                     title,
                                                     text,
                                                     options,
                                                     imgToolType,
                                                     textToolType,
                                                     mediaClass,
                                                   }) => {
  const [showToolType, setShowToolType] = useState(false);
  const onMouseOverHandler = () => {
    setShowToolType(true);
  };
  const onMouseOutHandler = () => {
    setShowToolType(false);
  };

  return (
    <div className={`${className} w-full`}>
      <div className={`flex justify-between items-center ${mediaClass}`}>
        <div className="text-gray-400 text-[14px] select-text flex">
          {text}
        </div>
        <div>
          {options}
        </div>
      </div>
    </div>
  );
};
