import { useCallback, useEffect, useState } from 'react'
import { defaultProviderId, isProviderId } from '../lib/providers'
import type { ProviderId } from '../lib/providers'

const keyStorageKey = 'recomai_api_key'
const providerStorageKey = 'recomai_provider'

interface UseApiKeyResult {
  apiKey: string
  providerId: ProviderId
  hasKey: boolean
  remember: boolean
  saveKey: (value: string, providerId: ProviderId, remember: boolean) => void
  clearKey: () => void
}

function readStoredKey(): string {
  try {
    return window.sessionStorage.getItem(keyStorageKey) ?? ''
  } catch {
    return ''
  }
}

function readStoredProvider(): ProviderId {
  try {
    const value = window.localStorage.getItem(providerStorageKey)
    if (value && isProviderId(value)) {
      return value
    }
  } catch {
    return defaultProviderId
  }
  return defaultProviderId
}

export function useApiKey(): UseApiKeyResult {
  const [apiKey, setApiKey] = useState<string>('')
  const [providerId, setProviderId] = useState<ProviderId>(defaultProviderId)
  const [remember, setRemember] = useState<boolean>(false)

  useEffect(() => {
    setProviderId(readStoredProvider())
    const stored = readStoredKey()
    if (stored) {
      setApiKey(stored)
      setRemember(true)
    }
  }, [])

  const saveKey = useCallback((value: string, provider: ProviderId, rememberForTab: boolean) => {
    const trimmed = value.trim()
    setApiKey(trimmed)
    setProviderId(provider)
    setRemember(rememberForTab)
    try {
      window.localStorage.setItem(providerStorageKey, provider)
    } catch {
      setProviderId(provider)
    }
    try {
      if (rememberForTab && trimmed) {
        window.sessionStorage.setItem(keyStorageKey, trimmed)
      } else {
        window.sessionStorage.removeItem(keyStorageKey)
      }
    } catch {
      setRemember(false)
    }
  }, [])

  const clearKey = useCallback(() => {
    setApiKey('')
    setRemember(false)
    try {
      window.sessionStorage.removeItem(keyStorageKey)
    } catch {
      setRemember(false)
    }
  }, [])

  return {
    apiKey,
    providerId,
    hasKey: apiKey.length > 0,
    remember,
    saveKey,
    clearKey
  }
}
