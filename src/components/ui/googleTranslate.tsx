import { useEffect, useId } from 'react'

interface GoogleTranslateProps {
  containerId?: string
  languages?: string // comma-separated language codes, e.g. "hi,mr,ta,te,gu"
  className?: string
}

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

const GoogleTranslate = ({ containerId, languages = 'hi,mr,ta,te,gu,bn,pa,kn,ml,or,as,gu', className }: GoogleTranslateProps) => {
  const autoId = useId().replace(/:/g, '-')
  const id = containerId || `google_translate_${autoId}`

  useEffect(() => {
    const init = () => {
      if (!window.google || !window.google.translate) return
      // Destroy previous instance if any
      const el = document.getElementById(id)
      if (!el) return
      el.innerHTML = ''
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: languages, autoDisplay: false },
        id
      )
    }

    window.googleTranslateElementInit = init

    const existing = document.querySelector('script[data-gt-lib]') as HTMLScriptElement | null
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      script.defer = true
      script.setAttribute('data-gt-lib', 'true')
      script.onerror = () => {
        // fail silently
      }
      document.body.appendChild(script)
    } else {
      // If script already loaded and google available, init immediately
      if (window.google && window.google.translate) {
        init()
      }
    }

    return () => {
      // cleanup container only; keep script cached for performance
      const el = document.getElementById(id)
      if (el) el.innerHTML = ''
    }
  }, [id, languages])

  return (
    <div id={id} className={className} />
  )
}

export default GoogleTranslate

