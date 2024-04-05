import React, { FC, useRef, useState } from 'react'
import Button from '../../common/components/button'
import { useTranslation } from '../../../locales/localisation'
import ErrorIcon from '../../../assets/icons/menu/error.svg'

type Props = {
  title: string;
  text: string;
  confirmText: string;
  errors?: string;
  isLoginNotEmailProvider?: boolean;
  onBack: () => void;
  onConfirm?: () => void;
  setPassword?: (password: string) => void;
  setErrors?: (error: string) => void;
}

export const ConfirmBlock: FC<Props> = ({
  title,
  text,
  confirmText,
  onBack,
  onConfirm,
  isLoginNotEmailProvider,
  errors,
  setPassword,
  setErrors
}) => {
  const [isDisable, setIsDisable] = useState<boolean>(false);

  const strings = useTranslation()
  const account = strings.popup.menu.account

  const isLogOut = account.signOut === title
  const passRef = useRef<any>(null);

  const getPassword = () => {
    if (setPassword) {
      setPassword(passRef.current?.value)
    }
    passRef.current.value?.length <= 5 ? setIsDisable(true) : setIsDisable(false);
  };

  const submitWithButton = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      (e.target as HTMLInputElement).blur();
      if (onConfirm) {
        onConfirm()
      }
    }
  };

  const handleChange = () => {
    getPassword();
    if (setErrors) {
      setErrors('')
    }
  };

  return (
    <div className='flex flex-col gap-[22px]'>
      <h2 className='text-[18px] px-[46px] font-medium text-gray-800'>{title}</h2>

      <div className='flex flex-col bg-[#FFFFFF] px-[46px] py-[16px] gap-[16px]'>
        <span className='text-gray-400 text-[14px]'>{text}</span>

        {!isLoginNotEmailProvider && !isLogOut && (
          <input
            type="password"
            ref={passRef}
            id="pass"
            className={`pl-3 text-sm h-11 rounded-sm w-full border border-gray-300 outline-none focus:border-blue-400 ${
              errors ? 'border-red-400 bg-red-500' : ''
            }`}
            onChange={handleChange}
            onKeyDown={submitWithButton}
          />
        )}
        {!isLoginNotEmailProvider && !isLogOut && (
          <div className="self-start flex mb-2 -mt-[8px] text-red-300 text-xs">
            {errors && <ErrorIcon />}
            {errors && <span className="ml-2.5 max-w-13">{errors}</span>}
          </div>
        )}

        <Button
          disabled={isDisable}
          type='primary'
          text={confirmText}
          onClick={onConfirm}
          className=''
        />
        <Button
          type='secondary'
          text={account.cancel}
          onClick={onBack}
          className=''
        />
      </div>
    </div>
  )
}
