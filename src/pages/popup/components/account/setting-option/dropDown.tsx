import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux'
import { RootState } from '../../../../background/store/reducers'
import ArrowRight from '../../../../../assets/icons/menu/arrowRight.svg'

type Option = {
  name: string;
  code: string;
  nameRu: string;
};

type PropsType = {
  options: Array<Option>;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  className?: string;
  color?: string;
  sizeText?: number;
  borderColor?: string;
};

export const Dropdown: React.FC<PropsType> = ({
                                                options,
                                                sizeText,
                                                onChange,
                                                value,
                                                className,
                                                color,
                                                borderColor,
                                              }) => {
  const interfaceLang = useSelector<RootState, string>((state) => state.settings.interfaceLang)


  return (
    <div className="relative inline-flex">
      <select
        style={{
          textAlignLast: 'right',
          color: color,
          borderColor: borderColor,
          fontSize: `${sizeText}px`,
        }}
        value={value}
        onChange={onChange}
        className={`flex justify-end text-right cursor-pointer w-min text-sm text-gray-800 font-bold pr-6 bg-[url('../../../../../assets/icons/menu/arrowDownSelect.svg')] bg-no-repeat bg-white bg-[right_0_center] border-0 focus:ring-0 focus:outline-none appearance-none ${className}`}
      >
        {options
          .sort((item1, item2) => {
            if (interfaceLang === 'en') {
              if (item1.name.toLowerCase() < item2.name.toLowerCase()) return -1;
              if (item1.name.toLowerCase() > item2.name.toLowerCase()) return 1;
              return 0;
            } else {
              if (item1.nameRu.toLowerCase() < item2.nameRu.toLowerCase()) return -1;
              if (item1.nameRu.toLowerCase() > item2.nameRu.toLowerCase()) return 1;
              return 0;
            }
          })
          .map((option, index) => (
            <option key={index} dir="rtl" value={option.code}>
              {interfaceLang === 'ru' ? option.nameRu : option.name}
            </option>
          ))}
      </select>
    </div>
  );
};
