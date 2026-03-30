import { useState, useEffect, useCallback, useRef } from 'react'
import { callGroqTTS } from '@/shared/lib'

export function useTTS() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState([])
  const audioRef = useRef(null)
  const abortRef = useRef(null)
  const blobUrlRef = useRef(null)

  const browserSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!browserSupported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [browserSupported])

  const cleanup = useCallback(() => {
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null }
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }
    if (browserSupported) window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsLoading(false)
  }, [browserSupported])

  const stop = useCallback(() => cleanup(), [cleanup])

  const pickVoice = useCallback((lang) => {
    if (!lang || !voices.length) return null
    const tag = lang.toLowerCase()
    return voices.find(v => v.lang.toLowerCase().startsWith(tag))
      || voices.find(v => v.lang.toLowerCase().includes(tag))
      || null
  }, [voices])

  const speakBrowser = useCallback((text, lang = 'en') => {
    if (!browserSupported || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 1
    utterance.pitch = 1
    const voice = pickVoice(lang)
    if (voice) utterance.voice = voice
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [browserSupported, pickVoice])

  const speak = useCallback(async (text) => {
    if (!text) return
    if (isSpeaking || isLoading) { stop(); return }

    setIsLoading(true)
    const abortCtrl = new AbortController()
    abortRef.current = abortCtrl

    try {
      const { url: blobUrl, lang } = await callGroqTTS(text, { signal: abortCtrl.signal })
      if (!blobUrl) { setIsLoading(false); speakBrowser(text, lang); return }
      if (abortCtrl.signal.aborted) return

      blobUrlRef.current = blobUrl
      const audio = new Audio(blobUrl)
      audioRef.current = audio
      audio.onplay = () => { setIsLoading(false); setIsSpeaking(true) }
      audio.onended = () => { setIsSpeaking(false); if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null } }
      audio.onerror = () => { cleanup(); speakBrowser(text, lang) }
      audio.play()
    } catch (err) {
      if (err.name === 'AbortError') return
      console.warn('Groq TTS failed, falling back to browser TTS:', err.message)
      setIsLoading(false)
      speakBrowser(text)
    }
  }, [isSpeaking, isLoading, stop, speakBrowser, cleanup])

  useEffect(() => () => cleanup(), [cleanup])

  return { speak, stop, isSpeaking, isLoading }
}

export default useTTS
