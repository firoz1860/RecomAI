import { useCallback, useEffect, useState } from 'react'

const storageKey = 'recomai_openai_key'

interface UseApiKeyResult {
  apiKey: string
  hasKey: boolean
  remember: boolean
  saveKey: (value: string, remember: boolean) => void
  clearKey: () => void
}

function readStoredKey(): string {
  try {
    return window.sessionStorage.getItem(storageKey) ?? ''
  } catch {
    return ''
  }
}

export function useApiKey(): UseApiKeyResult {
  const [apiKey, setApiKey] = useState<string>('')
  const [remember, setRemember] = useState<boolean>(false)

  useEffect(() => {
    const stored = readStoredKey()
    if (stored) {
      setApiKey(stored)
      setRemember(true)
    }
  }, [])

  const saveKey = useCallback((value: string, rememberForTab: boolean) => {
    const trimmed = value.trim()
    setApiKey(trimmed)
    setRemember(rememberForTab)
    try {
      if (rememberForTab && trimmed) {
        window.sessionStorage.setItem(storageKey, trimmed)
      } else {
        window.sessionStorage.removeItem(storageKey)
      }
    } catch {
      setRemember(false)
    }
  }, [])

  const clearKey = useCallback(() => {
    setApiKey('')
    setRemember(false)
    try {
      window.sessionStorage.removeItem(storageKey)
    } catch {
      setRemember(false)
    }
  }, [])

  return {
    apiKey,
    hasKey: apiKey.length > 0,
    remember,
    saveKey,
    clearKey
  }
}
