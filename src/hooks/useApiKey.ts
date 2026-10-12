import { useCallback, useEffect, useState } from 'react'
import { defaultProviderId, getProvider, isProviderId } from '../lib/providers'
import type { ProviderId } from '../lib/providers'

const keyStorageKey = 'recomai_api_key'
const providerStorageKey = 'recomai_provider'
const modelStorageKey = 'recomai_model'

interface UseApiKeyResult {
  apiKey: string
  providerId: ProviderId
  modelId: string
  hasKey: boolean
  remember: boolean
  saveKey: (value: string, providerId: ProviderId, modelId: string, remember: boolean) => void
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
  const [modelId, setModelId] = useState<string>(getProvider(defaultProviderId)?.defaultModel ?? '')
  const [remember, setRemember] = useState<boolean>(false)

  useEffect(() => {
    const storedProvider = readStoredProvider()
    setProviderId(storedProvider)
    try {
      setModelId(window.localStorage.getItem(modelStorageKey) || getProvider(storedProvider)?.defaultModel || '')
    } catch {
      setModelId(getProvider(storedProvider)?.defaultModel ?? '')
    }
    const stored = readStoredKey()
    if (stored) {
      setApiKey(stored)
      setRemember(true)
    }
  }, [])

  const saveKey = useCallback((value: string, provider: ProviderId, model: string, rememberForTab: boolean) => {
    const trimmed = value.trim()
    setApiKey(trimmed)
    setProviderId(provider)
    setModelId(model.trim())
    setRemember(rememberForTab)
    try {
      window.localStorage.setItem(providerStorageKey, provider)
      window.localStorage.setItem(modelStorageKey, model.trim())
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
    modelId,
    hasKey: apiKey.length > 0,
    remember,
    saveKey,
    clearKey
  }
}
