import strings from '../locales/localisation'

export const setUninstallURL = () => {
  const lang: string = strings.getLanguage()
  const feedbackForms: any = {
    en: 'https://forms.gle/o2KkQR6ANVcfpb3GA',
    ru: 'https://forms.gle/kEfe8NsaMi1KSdpR6',
    uk: 'https://forms.gle/kEfe8NsaMi1KSdpR6',
    kz: 'https://forms.gle/kEfe8NsaMi1KSdpR6',
  }

  let formUrl = feedbackForms['en']

  if (feedbackForms[lang] !== undefined) {
    formUrl = feedbackForms[lang]
  }

  chrome.runtime.setUninstallURL(formUrl)
}
