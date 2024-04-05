export const getSelectVoice = (
    utterThis: SpeechSynthesisUtterance,
    voices: SpeechSynthesisVoice[]
    ): SpeechSynthesisVoice => {
        const selectVoices: SpeechSynthesisVoice[] = voices.filter(voice => voice.lang.includes(utterThis.lang));
        const voice = selectVoices.find(a => a.default === true) as SpeechSynthesisVoice;
        return voice;
}