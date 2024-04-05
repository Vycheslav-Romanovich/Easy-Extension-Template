export const setDefaultNetflixLang = (lang: string, langCC:string) => {
  const onClickScreen = () => window.document.querySelector('div[data-uia="player"]')
  const onClickOff = () => window.document.querySelector(`li[data-uia="subtitle-item-${lang + langCC}"]`)
  const onClickSub = () => window.document.querySelector(`button[data-uia="control-audio-subtitle"]`)
  const subHidden = () => window.document.querySelector(`div[data-uia="selector-audio-subtitle"]`)
  onClickSub()?.click()
  subHidden().style.opacity = '0'
  subHidden().style.display = 'none'
  onClickOff()?.click()
  onClickScreen()?.click()
}