import { DarkModeType } from '../constants/types'

export const updateTheme = (extensionTheme?: DarkModeType) => {
  const bodyEl = document.body
  const root = document.getElementById('root')

  if (!bodyEl || !root) return

  if (extensionTheme === DarkModeType.asSystem) extensionTheme = chooseTheme()
  if (extensionTheme === DarkModeType.alwaysLight) {
    bodyEl.style.backgroundColor = '#FCFCFC'
    root.className = 'light'
  }

  if (extensionTheme === DarkModeType.alwaysDark) {
    bodyEl.style.backgroundColor = '#181818'
    root.className = 'dark'
  }
}

export const chooseTheme = (): DarkModeType => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
  let extensionTheme = null

  if (darkThemeMq.matches) {
    extensionTheme = DarkModeType.alwaysDark
  } else {
    extensionTheme = DarkModeType.alwaysLight
  }

  return extensionTheme
}
