export type ProviderId =
  | 'openai'
  | 'anthropic'
  | 'xai'
  | 'google'
  | 'groq'
  | 'mistral'
  | 'openrouter'

export interface ProviderInfo {
  id: ProviderId
  label: string
  baseUrl: string
  defaultModel: string
  envModelVar: string
  supportsJsonMode: boolean
  keyPlaceholder: string
  keysUrl: string
  billingUrl: string
  freeTier: boolean
}

export const providers: ProviderInfo[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    envModelVar: 'RECOMAI_OPENAI_MODEL',
    supportsJsonMode: true,
    keyPlaceholder: 'sk-...',
    keysUrl: 'https://platform.openai.com/api-keys',
    billingUrl: 'https://platform.openai.com/settings/organization/billing',
    freeTier: false
  },
  {
    id: 'groq',
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'openai/gpt-oss-120b',
    envModelVar: 'RECOMAI_GROQ_MODEL',
    supportsJsonMode: true,
    keyPlaceholder: 'gsk_...',
    keysUrl: 'https://console.groq.com/keys',
    billingUrl: 'https://console.groq.com/settings/billing',
    freeTier: true
  },
  {
    id: 'google',
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-3.5-flash-lite',
    envModelVar: 'RECOMAI_GOOGLE_MODEL',
    supportsJsonMode: true,
    keyPlaceholder: 'AIza...',
    keysUrl: 'https://aistudio.google.com/apikey',
    billingUrl: 'https://aistudio.google.com/apikey',
    freeTier: true
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'x-ai/grok-4.1-fast:free',
    envModelVar: 'RECOMAI_OPENROUTER_MODEL',
    supportsJsonMode: false,
    keyPlaceholder: 'sk-or-...',
    keysUrl: 'https://openrouter.ai/keys',
    billingUrl: 'https://openrouter.ai/credits',
    freeTier: true
  },
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-haiku-5-5',
    envModelVar: 'RECOMAI_ANTHROPIC_MODEL',
    supportsJsonMode: false,
    keyPlaceholder: 'sk-ant-...',
    keysUrl: 'https://console.anthropic.com/settings/keys',
    billingUrl: 'https://console.anthropic.com/settings/billing',
    freeTier: false
  },
  {
    id: 'xai',
    label: 'xAI Grok',
    baseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-4.7',
    envModelVar: 'RECOMAI_XAI_MODEL',
    supportsJsonMode: true,
    keyPlaceholder: 'xai-...',
    keysUrl: 'https://console.x.ai',
    billingUrl: 'https://console.x.ai',
    freeTier: false
  },
  {
    id: 'mistral',
    label: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-small-latest',
    envModelVar: 'RECOMAI_MISTRAL_MODEL',
    supportsJsonMode: true,
    keyPlaceholder: 'your Mistral key',
    keysUrl: 'https://console.mistral.ai/api-keys',
    billingUrl: 'https://console.mistral.ai/billing',
    freeTier: false
  }
]

export const defaultProviderId: ProviderId = 'openai'

export function getProvider(id: string): ProviderInfo | undefined {
  return providers.find((provider) => provider.id === id)
}

export function isProviderId(value: string): value is ProviderId {
  return providers.some((provider) => provider.id === value)
}
