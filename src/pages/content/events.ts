import { createEvent } from 'effector'
import { Subtitle } from '../../constants/types'

export const toggleAutoPause = createEvent<boolean>('Toggle auto pause')
export const updateSubs = createEvent<Subtitle>("Update subtitles");
export const updateTranslatedSubs = createEvent<Subtitle>("Update translated subtitles");
