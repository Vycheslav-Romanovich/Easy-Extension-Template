export const isProdEnv = () => {
  const env = process.env.NODE_ENV
  if (!env || env.length === 0) return null
  if (env === 'production') return true
  if (env === 'development') return false
}

export const environment = {
  url: isProdEnv() ? 'https://easy4learn.com' : 'https://dev.elang.app',
  translatedKey: '',
  website: isProdEnv() ? 'https://edu.elang.app' : 'https://edu-elang-app-development-gm4e3.ondigitalocean.app',
  cryptedIvkey: '',
  cryptedKey: ''
}
