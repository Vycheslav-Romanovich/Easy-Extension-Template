import { SpeechSynthesisSettings, WordStatistics } from "../models/interfaces";
import { createSpeech } from "./createSpeech";
import { getSelectVoice } from "./getSelectVoice";
import { setSettingsSpeech } from "./setSettingsSpeech";
import { WordVocabularyElement } from '../constants/types';
import { dataAudioWordLink } from "../pages/background/helpers/request";

export const sound = (data: WordVocabularyElement): void => {
    if (data) {
      const {synth, utterThis} = createSpeech(data);
      const settingsForUtter: SpeechSynthesisSettings = {
        lang: data.learningLanguageCode,
        voice: undefined
    };
      const voices = synth.getVoices();
      
      if(data.learningLanguageCode === 'en'){
        const dataForLink = data.word ?? data.phrase
        dataAudioWordLink(dataForLink).then((res) => {
          const audio = new Audio(res.key)
          audio.play();
        }).then(null, () => {
        if (voices.length > 0) {
          settingsForUtter.voice = getSelectVoice(utterThis, voices);
          const setedSettings: SpeechSynthesisUtterance = setSettingsSpeech(utterThis, settingsForUtter);
          synth.speak(setedSettings);
        } else {
          synth.addEventListener("voiceschanged", () => {
              const voices: SpeechSynthesisVoice[] = synth.getVoices();
              settingsForUtter.voice = getSelectVoice(utterThis, voices);
              const setedSettings: SpeechSynthesisUtterance = setSettingsSpeech(utterThis,settingsForUtter);
            synth.speak(setedSettings);
            })
        }
        })
      } else {
        if (voices.length > 0) {
          settingsForUtter.voice = getSelectVoice(utterThis, voices);
          const setedSettings: SpeechSynthesisUtterance = setSettingsSpeech(utterThis, settingsForUtter);
          synth.speak(setedSettings);
        } else {
          synth.addEventListener("voiceschanged", () => {
              const voices: SpeechSynthesisVoice[] = synth.getVoices();
              settingsForUtter.voice = getSelectVoice(utterThis, voices);
              const setedSettings: SpeechSynthesisUtterance = setSettingsSpeech(utterThis,settingsForUtter);
            synth.speak(setedSettings);
            })
        }
      }
    }
  }