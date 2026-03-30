import { useState, useEffect, useCallback, useRef } from 'react'

export function useSTT({ onResult } = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)
  const onResultRef = useRef(onResult)

  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)

  const supported = !!SpeechRecognition

  useEffect(() => { onResultRef.current = onResult }, [onResult])

  useEffect(() => {
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      setTranscript(final || interim)
      if (final && onResultRef.current) onResultRef.current(final)
    }

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    return () => { recognition.abort(); recognitionRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const start = useCallback((lang) => {
    const recognition = recognitionRef.current
    if (!recognition || isListening) return
    setTranscript('')
    recognition.lang = lang || ''
    try { recognition.start(); setIsListening(true) } catch { /* already started */ }
  }, [isListening])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return { start, stop, isListening, transcript, supported }
}

export default useSTT
