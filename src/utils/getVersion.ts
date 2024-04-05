import { version } from '../manifest.json'

export const checkAB = ():number => !(~~version.substring(4)%2) ? 0 : 1
