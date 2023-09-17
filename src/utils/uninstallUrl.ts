import strings from '../locales/localisation'

export const setUninstallURL = () => {
  const lang: string = strings.getLanguage()
  const feedbackForms: any = {
    en: 'https://forms.gle/Jm5USXNpHu9SjHQy6',
    ru: 'https://forms.gle/Jm5USXNpHu9SjHQy6',
  }

  let formUrl = feedbackForms['en']

  if (feedbackForms[lang] !== undefined) {
    formUrl = feedbackForms[lang]
  }

  chrome.runtime.setUninstallURL(formUrl)
}
