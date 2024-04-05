import { subTitleType } from 'subtitle'
import { SubsLinksType } from './netflix'

interface Service {
  getSubs(language: string, locale: string): Promise<string | subTitleType[] | Array<SubsLinksType> | void>
}

export default Service
