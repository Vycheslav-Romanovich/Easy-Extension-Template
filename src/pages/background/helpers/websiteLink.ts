import { interfacesLanguages } from "../../../constants/supportedLanguages"
import { environment } from "../../../utils/environment"

export const getLinkToWebsite = (locale: string, path: string): void => {
    interfacesLanguages.find((item)=>item.code === locale) ?
    chrome.tabs.create({ url: `${environment.website}/${locale}/${path}` }, function () {
        console.log('Opening elang.app after extension was installed!')
    })
    :
    chrome.tabs.create({ url: `${environment.website}/${path}` }, function () {
        console.log('Opening elang.app after extension was installed!')
    })

}