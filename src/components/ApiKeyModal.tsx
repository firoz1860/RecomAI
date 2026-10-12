import { useEffect, useId, useState } from 'react'
import { Modal } from './Modal'
import { CheckIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon, KeyIcon } from './icons'
import { providers, getProvider } from '../lib/providers'
import type { ProviderId } from '../lib/providers'

interface ApiKeyModalProps {
  open: boolean
  onClose: () => void
  onSave: (key: string, providerId: ProviderId, model: string, remember: boolean) => void
  onClear: () => void
  hasKey: boolean
  remember: boolean
  providerId: ProviderId
  model: string
}

export function ApiKeyModal({ open, onClose, onSave, onClear, hasKey, remember, providerId, model }: ApiKeyModalProps) {
  const [draftProvider, setDraftProvider] = useState<ProviderId>(providerId)
  const [draftModel, setDraftModel] = useState(model)
  const [value, setValue] = useState('')
  const [reveal, setReveal] = useState(false)
  const [rememberForTab, setRememberForTab] = useState(remember)
  const [touched, setTouched] = useState(false)
  const fieldId = useId()
  const titleId = useId()
  const selectId = useId()

  useEffect(() => {
    if (open) {
      setDraftProvider(providerId)
      setDraftModel(model)
      setValue('')
      setReveal(false)
      setRememberForTab(remember)
      setTouched(false)
    }
  }, [open, remember, providerId, model])

  const provider = getProvider(draftProvider) ?? providers[0]
  const trimmed = value.trim()
  const trimmedModel = draftModel.trim()
  const looksValid = trimmed.length >= 8 && trimmedModel.length > 0 && trimmedModel.length <= 200
  const showError = touched && trimmed.length > 0 && !looksValid

  function handleSave() {
    setTouched(true)
    if (!looksValid) {
      return
    }
    onSave(trimmed, draftProvider, trimmedModel, rememberForTab)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect an AI provider"
      description="Pick a provider and paste its API key. Your key is used only to generate recommendations for your request and is never stored on our server."
      labelledBy={titleId}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Provider
          </label>
          <select
            id={selectId}
            value={draftProvider}
            onChange={(event) => {
              const nextProvider = event.target.value as ProviderId
              setDraftProvider(nextProvider)
              setDraftModel(getProvider(nextProvider)?.defaultModel ?? '')
              setValue('')
              setTouched(false)
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 transition focus-ring"
          >
            {providers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
                {item.freeTier ? ' (free tier)' : ''}
              </option>
            ))}
          </select>
          <label htmlFor={`${selectId}-model`} className="mb-1.5 mt-3 block text-sm font-medium text-slate-700">
            Model ID
          </label>
          <input
            id={`${selectId}-model`}
            value={draftModel}
            onChange={(event) => setDraftModel(event.target.value)}
            maxLength={200}
            autoComplete="off"
            spellCheck={false}
            placeholder={provider.defaultModel}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 transition placeholder:text-slate-400 focus-ring"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Default: <code className="font-mono">{provider.defaultModel}</code>. You can enter any model enabled for your key.
          </p>
          {provider.freeTier ? (
            <p className="mt-1.5 text-xs text-emerald-600">
              Free models may have rate limits or availability restrictions.
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-amber-700">
              This provider may charge for API usage. Check its pricing before sending requests.
            </p>
          )}
        </div>

        <div>
          <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-700">
            {provider.label} API key
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <KeyIcon className="h-4 w-4" />
            </span>
            <input
              id={fieldId}
              type={reveal ? 'text' : 'password'}
              value={value}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setValue(event.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleSave()
                }
              }}
              placeholder={provider.keyPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus-ring"
              aria-invalid={showError}
              aria-describedby={showError ? `${fieldId}-error` : undefined}
            />
            <button
              type="button"
              onClick={() => setReveal((prev) => !prev)}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-ring"
              aria-label={reveal ? 'Hide API key' : 'Show API key'}
            >
              {reveal ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {showError && (
            <p id={`${fieldId}-error`} className="mt-1.5 text-xs text-rose-600">
              That key looks too short. Please paste the full key.
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={rememberForTab}
            onChange={(event) => setRememberForTab(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus-ring"
          />
          <span>
            Remember for this tab
            <span className="block text-xs text-slate-400">
              Stored in sessionStorage and cleared when the tab closes. Leave off to keep it in memory only.
            </span>
          </span>
        </label>

        <a
          href={provider.keysUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700 focus-ring"
        >
          Get {provider.label} API key
          <ExternalLinkIcon className="h-4 w-4" />
        </a>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleSave}
            disabled={!looksValid}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition hover:bg-brand-700 focus-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckIcon className="h-4 w-4" />
            Save key
          </button>
          {hasKey && (
            <button
              type="button"
              onClick={() => {
                onClear()
                onClose()
              }}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus-ring"
            >
              Remove saved key
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
