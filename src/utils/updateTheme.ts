import { EDarkMode } from '../constants/types'

export const updateTheme = (extensionTheme?: EDarkMode) => {
  const bodyEl = document.body
  const root = document.getElementById('root')

  if (!bodyEl || !root) return

  if (extensionTheme === EDarkMode.AsSystem) extensionTheme = chooseTheme()
  if (extensionTheme === EDarkMode.AlwaysLight) {
    bodyEl.style.backgroundColor = '#FCFCFC'
    root.className = EDarkMode.AlwaysLight
  }

  if (extensionTheme === EDarkMode.AlwaysDark) {
    bodyEl.style.backgroundColor = '#181818'
    root.className = EDarkMode.AlwaysDark
  }
}

export const chooseTheme = (): EDarkMode => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
  let extensionTheme = null

  if (darkThemeMq.matches) {
    extensionTheme = EDarkMode.AlwaysDark
  } else {
    extensionTheme = EDarkMode.AlwaysLight
  }

  return extensionTheme
}
