import React from 'react'
import ReactModal from 'react-modal'
import Button from './button'
import { OnClickHandler } from '../../../constants/types'
import Oval1 from '../../../assets/images/ovals/oval1.svg'
import Oval2 from '../../../assets/images/ovals/oval2.svg'
import { useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'

type PropsType = {
  isOpen: boolean
  title?: string
  text?: string
  headerImage?: any
  isDisable?: boolean
  okText?: string
  onOk?: OnClickHandler
  cancelText?: string
  onCancel?: OnClickHandler
  children?: React.ReactNode
  size?: string
  styleTitle?: string
  styleText?: string
  isSubFinished?: boolean
  isGamePopupEnd?: boolean
}

const Modal: React.FC<PropsType> = ({
  size = 'base',
  title,
  isOpen,
  headerImage,
  isDisable,
  cancelText,
  onCancel,
  okText,
  onOk,
  text,
  children,
  styleText,
  styleTitle,
  isSubFinished,
  isGamePopupEnd,
}) => {
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(95, 99, 104, 0.3)',
      zIndex: 10000,
    },
    content: {
      overflow: 'hidden',
      width: isSubFinished ? 351 : isGamePopupEnd ? 280 : 320,
      border: 'none',
      backgroundColor: '#FFFFFF',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: isSubFinished ? '36px' : '26px 40px',
      transform: 'translate(-50%, -50%)',
      borderRadius: 8,
    },
  }

  if (size === 'lg') {
    customStyles.content.width = 363
    customStyles.content.padding = '20px 40px 34px 40px'
  }
  if (isGamePopupEnd) {
    // @ts-ignore
    customStyles.content.boxSizing = 'border-box'
    customStyles.content.padding = '36px 30px 36px'
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onCancel}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      style={customStyles}
      ariaHideApp={false}
      id="elangExtension"
    >
      {(!isGamePopupEnd) &&
        <div style={{ zIndex: -1 }} className="absolute -top-14 -left-16 opacity-60">
          <Oval1 />
        </div>
      }
      {!isGamePopupEnd &&
        <div style={{ zIndex: -1 }} className="absolute -top-10 -right-20 opacity-60">
          <Oval2 />
        </div>
      }

      <div className={`w-full h-full flex flex-col justify-between items-center`}>
        {headerImage && 
        <div style={isGamePopupEnd ? { marginBottom: 16 } : { marginBottom: 24 }}
          >{headerImage}
        </div>}
        {title && (
          <div
               className={`${styleTitle} dark:text-white text-gray-600 ${isGamePopupEnd && '16px'} text-16px font-bold text-center select-none`}>
            {title}
          </div>
        )}
        {text && (
          <div
            className={`${styleText} text-gray-600 dark:text-white text-14px ${!isSubFinished && 'text-center'} select-none ${isGamePopupEnd && 'text-14px'} 2xl:text-14px`}
            style={isGamePopupEnd ? { marginBottom: 20, marginTop: 6, lineHeight: '20px' } : { marginBottom: 24,  marginTop: 12 }}
          >
            {text}
          </div>
        )}

        {children}

        <div className="w-204 flex flex-col mx-auto 2xl:w-228">
          {okText && (
            <Button
            // !isGamePopupEnd ? `mb-3 2xl:h-44 h-16 font-sans border-0 text-14px` : `2xl:h-44 font-sans border-0`
              className={!isGamePopupEnd ? `mb-3 2xl:h-44 h-16 font-sans border-0 text-14px` : `2xl:h-44 font-sans border-0`}
              type="primary"
              text={okText}
              onClick={onOk}
              disabled={isDisable}
            />
          )}
          {cancelText && <Button className="2xl:h-44" type="secondary" text={cancelText} onClick={onCancel} />}
        </div>
      </div>
    </ReactModal>
  )
}

export default Modal
