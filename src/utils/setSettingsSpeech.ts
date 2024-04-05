import { SpeechSynthesisSettings } from "../models/interfaces";


export const setSettingsSpeech = (
    utterThis: SpeechSynthesisUtterance,
    payload: SpeechSynthesisSettings
): SpeechSynthesisUtterance => {
    utterThis.lang = payload.lang ?? 'en';
    utterThis.voice = payload.voice as SpeechSynthesisVoice;
    return utterThis;
}