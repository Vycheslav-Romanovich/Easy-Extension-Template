import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import ProgressDone from '../../../../assets/icons/menu/progressDone.svg'
import { useFullScreenContex } from '../../../../context/FullScreenContext'
import { getService } from '../../../../utils/url'
import { RootState } from '../../../background/store/reducers'

type PropsDateWordsType = {
  count: number
  rating: number
  isWidescreenModeYt?: boolean
  isFullscreenModeOnYt?: boolean
  isMenuItem?: boolean
}

const ProgressCat: React.FC<PropsDateWordsType> = ({ count, rating, isWidescreenModeYt, isFullscreenModeOnYt, isMenuItem }) => {
  const [isCheck, setIsCheck] = useState<boolean>(false)
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const { isFullScreen } = useFullScreenContex()
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'
  let angle = 0;
  if (count) {
    angle = (201 / count) * rating
  }

  if (!count) {
    angle = 0
  }

  useEffect(() => {
    if (rating && rating === Number(count)) {
      const time = setTimeout(() => {
        setIsCheck(true)
      }, 800)
      return () => clearTimeout(time)
    }
  }, [rating])

  return (
    <div
      className={`flex justify-between h-64 w-64 rounded-15 ${
        !isMenuItem &&
        (isNetflix ||
          isDarkModeInYoutube ||
          (isYouTube && (isFullscreenModeOnYt || isWidescreenModeYt)) ||
          (isCoursera && isFullScreen))
          ? 'bg-gray-35'
          : 'bg-white'
      }`}
    >
      <div className="w-64 h-64 relative">
        <svg width="64" height="66" viewBox="0 0 64 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32ZM3.97522 32C3.97522 47.4777 16.5223 60.0248 32 60.0248C47.4777 60.0248 60.0248 47.4777 60.0248 32C60.0248 16.5223 47.4777 3.97522 32 3.97522C16.5223 3.97522 3.97522 16.5223 3.97522 32Z"
            fill="#DCE2FF"
          />
          <svg height="76" width="76">
            <circle cx="44" cy="32" r="30" stroke="#DCE2FF" strokeWidth="4" fill="transparent" transform="rotate(-90, 38, 38)" />
            <circle
              strokeDasharray={`${angle}, 20000`}
              cx="44"
              cy="32"
              r="30"
              stroke="#4F6EFD"
              strokeLinecap="round"
              strokeWidth="4.5"
              fill="transparent"
              transform="rotate(-245, 37.9, 28.4)"
            >
              <animate attributeName="stroke-dasharray" values={`${angle * 0}, 20000;${angle * 0.5}, 20000;${angle * 1}, 20000`} dur="1s" />
            </circle>
          </svg>
          <circle cx="32.0001" cy="31.9992" r="24.5333" fill="white" />
          <circle cx="32.0001" cy="32.9992" r="24.5333" fill="#4F6EFD" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M29.7476 7.10007C26.7671 7.3829 23.4336 8.33321 20.8535 9.63563C16.688 11.7384 13.0558 15.0936 10.6315 19.0783C9.76757 20.4982 9.34984 21.3425 8.70448 22.9732C5.84068 30.2083 6.61574 38.5225 10.8023 45.4801C13.6865 50.2732 18.2608 54.1783 23.2474 56.1047C24.1601 56.4573 24.6742 56.6261 25.9603 56.9955C26.1213 57.0417 26.1313 56.8007 26.1313 52.8978V48.7509L25.7159 48.8312C23.9915 49.1647 21.8491 48.512 20.5969 47.2716C20.273 46.9507 19.7916 46.3658 19.527 45.9718C19.2623 45.5776 18.8478 45.0398 18.6058 44.7766C18.1608 44.2926 17.3718 43.8409 16.9685 43.8391C16.8476 43.8386 16.7465 43.7832 16.7441 43.716C16.7416 43.6489 16.6845 42.9892 16.6172 42.2501L16.4947 40.9063H16.9431C17.5272 40.9063 18.3818 41.1325 19.0226 41.4566C20.1381 42.0209 20.9543 42.8229 22.0052 44.387C22.4513 45.0511 22.8313 45.4055 23.4322 45.7184C23.9167 45.9706 25.0469 46.013 25.7602 45.8057C26.2084 45.6755 26.2226 45.6594 26.3254 45.1641C26.4655 44.4896 26.8897 43.6109 27.441 42.8533C27.6883 42.5135 27.8906 42.2067 27.8906 42.1716C27.8906 42.1364 27.4838 42.0317 26.9865 41.9386C25.9234 41.7397 23.9894 41.1092 23.1534 40.689C21.0017 39.6075 19.4255 38.0988 18.3719 36.1124C16.9618 33.4539 16.7705 30.1825 17.8465 27.1266C18.2296 26.0387 18.5136 25.4841 19.1695 24.5435L19.71 23.7684L19.543 23.0776C19.1654 21.5158 19.2415 19.6012 19.7444 18.0094C19.977 17.273 19.9965 17.2453 20.2489 17.2946C20.3933 17.3228 20.7753 17.3754 21.0979 17.4115C22.1629 17.5304 23.3235 18.0217 25.2723 19.1783C26.4906 19.9015 26.3527 19.8851 28.0861 19.5116C30.8198 18.9225 33.8916 18.9979 36.9458 19.7289L37.5468 19.8728L38.4608 19.3335C40.6557 18.0383 41.9893 17.5099 43.5495 17.3176L44.0102 17.2608L44.2495 18.0182C44.7479 19.5959 44.8245 21.5107 44.4516 23.0709L44.2881 23.755L44.8455 24.6346C46.3704 27.0405 46.8802 28.6322 46.8802 30.9869C46.8802 35.2199 44.6755 38.76 40.8377 40.689C40.0017 41.1092 38.0677 41.7397 37.0046 41.9386C36.5074 42.0317 36.1005 42.1353 36.1005 42.1688C36.1005 42.2024 36.3263 42.5367 36.6023 42.9118C36.8782 43.287 37.2096 43.821 37.3386 44.0986C37.831 45.1579 37.8563 45.5166 37.8581 51.4919C37.8597 56.7333 37.8694 57.0419 38.0308 56.9955C39.3169 56.6261 39.831 56.4573 40.7437 56.1047C46.4271 53.9091 51.363 49.3247 54.2045 43.6022C57.5069 36.9516 57.8988 29.5693 55.2981 23.0014C54.6411 21.3422 54.2264 20.5029 53.3596 19.0783C51.2754 15.6527 48.3574 12.735 44.9315 10.6509C43.5104 9.78652 42.6675 9.36961 41.0281 8.7206C37.5218 7.33247 33.4554 6.74825 29.7476 7.10007Z"
            fill="#DCE2FF"
          />
          <path d="M16 38L26.5 43L26 52L15.5 49L16 38Z" fill="#DCE2FF" />
          <path
            d="M20 59.5L20.3249 59.6872C22.8712 61.1546 25.9048 58.7641 25.0736 55.9453V55.9453C24.7303 54.7809 25.1625 53.5268 26.1503 52.8212L31.5 49"
            stroke="#4F6EFD"
            strokeWidth="3.9"
          />
          <ellipse cx="32" cy="27.5" rx="17" ry="15.5" fill="#DCE2FF" />
          <path
            opacity="0.2"
            d="M44.2817 34.2473C44.8927 41.0989 39.4465 42.724 32.604 43.3342C25.7614 43.9443 20.1137 43.3084 19.5027 36.4568C18.8918 29.6051 23.9435 23.5562 30.786 22.946C37.6285 22.3359 43.6708 27.3956 44.2817 34.2473Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.4521 20.8659C41.2192 23.0225 39.8087 24.3024 39.1075 24.778C39.0323 24.8291 39.028 24.9409 39.1002 24.9962C40.0041 25.6883 41.7238 27.4325 42.7016 29.899L43.3218 27.1589C43.4992 26.3748 43.5004 25.5611 43.3252 24.7765L42.4521 20.8659Z"
            fill="#4F6EFD"
          />
          <path
            opacity="0.2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28.2108 23.4083L23.5418 19.261C23.3282 19.0713 22.9916 19.147 22.8801 19.4099L21.1308 23.5321C20.8168 24.2722 20.671 25.0729 20.7039 25.8765L20.8454 29.3291C19.9861 31.1103 19.598 33.1862 19.8007 35.4603C23.6491 39.1188 26.5555 37.2615 28.9574 35.7265C29.9883 35.0677 30.9264 34.4682 31.8061 34.3898C32.7052 34.3096 33.779 35.0632 34.9732 35.9013C37.6698 37.7937 40.9805 40.1172 44.2814 34.2467C44.1246 32.4888 43.6103 30.8488 42.8167 29.3923L43.322 27.1598C43.4994 26.3757 43.5006 25.5619 43.3255 24.7774L42.3494 20.4061C42.2872 20.1273 41.9698 19.9919 41.7254 20.1398L36.0136 23.5978C34.3871 23.0245 32.615 22.7824 30.7856 22.9455C29.889 23.0255 29.0283 23.1817 28.2108 23.4083Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.6961 19.8477C23.5192 22.1923 24.6754 23.7068 25.2792 24.3016C25.3441 24.3655 25.3281 24.4762 25.247 24.5175C24.2327 25.0348 22.2252 26.4398 20.8179 28.6901L20.7029 25.8831C20.6699 25.0796 20.8157 24.2788 21.1298 23.5387L22.6961 19.8477Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32.8716 22.9287C32.8703 23.3301 32.8918 23.7717 32.9346 24.2522C33.2408 25.2936 33.3387 26.2476 33.4206 27.046C33.5802 28.6011 33.6791 29.5657 35.1387 29.4353C37.2383 29.2479 37.0645 25.6292 36.0594 23.5694L36.0179 23.5945C35.0174 23.2415 33.9618 23.0138 32.8716 22.9287Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M31.7744 22.9715C31.7329 23.3741 31.6639 23.8152 31.5691 24.2934C31.1534 25.296 30.9542 26.2341 30.7875 27.0191C30.4627 28.5482 30.2613 29.4966 28.824 29.2108C26.7525 28.7987 27.3179 25.2061 28.5422 23.2685L28.5775 23.2953C29.6091 23.0521 30.6822 22.9392 31.7744 22.9715Z"
            fill="#4F6EFD"
          />
          <ellipse rx="2.16954" ry="2.17242" transform="matrix(0.996037 -0.0889355 0.0886976 0.996059 26.7423 33.5295)" fill="#4F6EFD" />
          <ellipse rx="2.16954" ry="2.17242" transform="matrix(-0.996037 0.0889355 0.0886976 0.996059 37.0244 33.7767)" fill="#4F6EFD" />
          <ellipse rx="0.626755" ry="0.627588" transform="matrix(0.996037 -0.0889355 0.0886976 0.996059 27.5723 33.0684)" fill="#4F6EFD" />
          <ellipse rx="0.626755" ry="0.627588" transform="matrix(-0.996037 0.0889355 0.0886976 0.996059 36.1279 33.4689)" fill="#4F6EFD" />
          <path
            d="M44.2817 34.2473C44.8927 41.0989 39.4465 42.724 32.604 43.3342C25.7614 43.9443 20.1137 43.3084 19.5027 36.4568C18.8918 29.6051 23.9435 23.5562 30.786 22.946C37.6285 22.3359 43.6708 27.3956 44.2817 34.2473Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28.2009 23.4014L23.5422 19.2633C23.3286 19.0736 22.992 19.1493 22.8805 19.4122L21.1312 23.5344C20.8172 24.2745 20.6714 25.0752 20.7043 25.8788L20.8263 28.8546C19.8048 30.6779 19.3179 32.8492 19.5337 35.2689C23.4133 38.957 26.4694 37.1361 28.9615 35.6511C30.0025 35.0309 30.9451 34.4692 31.8082 34.3923C32.7073 34.3121 33.7811 35.0657 34.9753 35.9038C37.6719 37.7962 40.9826 40.1196 44.2834 34.2492C44.1266 32.4902 43.6118 30.8494 42.8174 29.3922L43.3224 27.1611C43.4998 26.377 43.501 25.5632 43.3258 24.7787L42.3498 20.4074C42.2876 20.1286 41.9702 19.9932 41.7258 20.1411L36.0134 23.5995C34.3875 23.0268 32.6162 22.7849 30.7877 22.948C29.8913 23.0279 29.0262 23.1807 28.2009 23.4014Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.4521 20.8659C41.2192 23.0225 39.8087 24.3024 39.1075 24.778C39.0323 24.8291 39.028 24.9409 39.1002 24.9962C40.0041 25.6883 41.7238 27.4325 42.7016 29.899L43.3218 27.1589C43.4992 26.3748 43.5004 25.5611 43.3252 24.7765L42.4521 20.8659Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.6961 19.8477C23.5192 22.1923 24.6754 23.7068 25.2792 24.3016C25.3441 24.3655 25.3281 24.4762 25.247 24.5175C24.2327 25.0348 22.2252 26.4398 20.8179 28.6901L20.7029 25.8831C20.6699 25.0796 20.8157 24.2788 21.1298 23.5387L22.6961 19.8477Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32.8716 22.9287C32.8703 23.3301 32.8918 23.7717 32.9346 24.2522C33.2408 25.2936 33.3387 26.2476 33.4206 27.046C33.5802 28.6011 33.6791 29.5657 35.1387 29.4353C37.2383 29.2479 37.0645 25.6292 36.0594 23.5694L36.0179 23.5945C35.0174 23.2415 33.9618 23.0138 32.8716 22.9287Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M31.7744 22.9715C31.7329 23.3741 31.6639 23.8152 31.5691 24.2934C31.1534 25.296 30.9542 26.2341 30.7875 27.0191C30.4627 28.5482 30.2613 29.4966 28.824 29.2108C26.7525 28.7987 27.3179 25.2061 28.5422 23.2685L28.5775 23.2953C29.6091 23.0521 30.6822 22.9392 31.7744 22.9715Z"
            fill="#4F6EFD"
          />
          <ellipse rx="2.16954" ry="2.17242" transform="matrix(0.996037 -0.0889355 0.0886976 0.996059 26.7423 33.5295)" fill="#4F6EFD" />
          <ellipse rx="2.16951" ry="2.17244" transform="matrix(1 -2.12726e-09 -2.12726e-09 -1 37.4639 33.5766)" fill="#4F6EFD" />
          <ellipse rx="0.626755" ry="0.627588" transform="matrix(0.996037 -0.0889355 0.0886976 0.996059 27.0068 32.4707)" fill="#4F6EFD" />
          <ellipse rx="0.626755" ry="0.627588" transform="matrix(-0.996037 0.0889355 0.0886976 0.996059 37.5178 32.4699)" fill="#4F6EFD" />
          <path
            d="M31.3582 37.6095C31.6952 37.8529 32.1599 37.8114 32.4486 37.5121L33.7049 36.21C33.866 36.043 33.7334 35.7657 33.5023 35.7863L30.0162 36.0976C29.7851 36.1182 29.7036 36.4147 29.8916 36.5505L31.3582 37.6095Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28.2461 23.4384L23.5409 19.2589C23.3273 19.0692 22.9907 19.1449 22.8792 19.4078L21.1299 23.53C20.8159 24.2701 20.6701 25.0709 20.703 25.8744L20.8556 29.5965C19.7929 31.6358 19.2816 33.9936 19.5011 36.4551C20.112 43.3067 25.7598 43.9426 32.6023 43.3325C39.4449 42.7223 44.8911 41.0972 44.2801 34.2456C44.1233 32.4875 43.609 30.8475 42.8153 29.3909L43.3209 27.1568C43.4984 26.3726 43.4996 25.5589 43.3244 24.7743L42.3484 20.403C42.2862 20.1243 41.9688 19.9888 41.7244 20.1368L36.0105 23.596C34.3845 23.0232 32.613 22.7813 30.7844 22.9443C29.906 23.0227 29.0572 23.1906 28.2461 23.4384Z"
            fill="#4F6EFD"
          />
          <path
            d="M33.2589 38.4544C33.1525 38.9957 32.8085 39.4331 32.373 39.6412C32.1433 39.7509 31.8847 39.7857 31.632 39.7614C31.3752 39.7368 31.0852 39.6565 30.8759 39.4611C30.8043 39.3942 30.8546 39.2595 30.9452 39.2983C31.1665 39.3929 31.3736 39.5003 31.6082 39.5303C31.8452 39.5606 32.0832 39.5275 32.3034 39.4392C32.7203 39.2719 33.0427 38.8967 33.2314 38.4421C33.2392 38.4231 33.263 38.4332 33.2589 38.4544Z"
            fill="#4F6EFD"
          />
          <path
            d="M23.1612 19.2089L28.2268 23.7085L20.5247 30.7362L20.3233 25.8243C20.2904 25.0208 20.4362 24.2201 20.7502 23.48L22.4995 19.3578C22.611 19.0949 22.9476 19.0191 23.1612 19.2089Z"
            fill="#4F6EFD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.874 20.1318C23.6971 22.4766 24.8534 23.9911 25.4572 24.5859C25.522 24.6498 25.506 24.7605 25.425 24.8018C24.4108 25.319 22.4038 26.7235 20.9966 28.9731L20.8815 26.1654C20.8486 25.3619 20.9944 24.5612 21.3085 23.8211L22.874 20.1318Z"
            fill="#4F6EFD"
          />
        </svg>
        {isCheck && (
          <div className="absolute -bottom-5px left-3.5">
            <ProgressDone />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgressCat