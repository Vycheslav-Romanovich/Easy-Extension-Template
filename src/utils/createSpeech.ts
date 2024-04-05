import { SpeechData, WordStatistics } from "../models/interfaces";
import { WordVocabularyElement } from '../constants/types';

export const createSpeech = (data: WordVocabularyElement): SpeechData => {
    const synth: SpeechSynthesis = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(data.word ? data.word : data.phrase);
    return {synth, utterThis};
}