export const isProdEnv = () => {
  const env = process.env.NODE_ENV
  if (!env || env.length === 0) return null
  if (env === 'production') return true
  if (env === 'development') return false
}

export const environment = {
  url: isProdEnv() ? 'https://easy4learn.com' : 'https://dev.elang.app',
  translatedKey: 'b343f4eb2e1cf0d3f0f14ce30649db2fb1e0db28',
  website: isProdEnv() ? 'https://elang.app' : 'https://elang-app-dev-zehqx.ondigitalocean.app',
  cryptedIvkey: 'nuilaRSl6ZvkBAKG',
  cryptedKey: 'Rfp07QXaQPVo5W66Cyccu8Otd3SSZnIA'
}
export  const youtubeApiKey = 'AIzaSyAnlNcOngLn5oAJQ7xHObjSCUmkxMLjD1Q'
