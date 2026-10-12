import { useEffect, useId, useState } from 'react'
import { Modal } from './Modal'
import { CheckIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon, KeyIcon } from './icons'

interface ApiKeyModalProps {
  open: boolean
  onClose: () => void
  onSave: (key: string, remember: boolean) => void
  onClear: () => void
  hasKey: boolean
  remember: boolean
}

export function ApiKeyModal({ open, onClose, onSave, onClear, hasKey, remember }: ApiKeyModalProps) {
  const [value, setValue] = useState('')
  const [reveal, setReveal] = useState(false)
  const [rememberForTab, setRememberForTab] = useState(remember)
  const [touched, setTouched] = useState(false)
  const fieldId = useId()
  const titleId = useId()

  useEffect(() => {
    if (open) {
      setValue('')
      setReveal(false)
      setRememberForTab(remember)
      setTouched(false)
    }
  }, [open, remember])

  const trimmed = value.trim()
  const looksValid = trimmed.startsWith('sk') && trimmed.length >= 20
  const showError = touched && trimmed.length > 0 && !looksValid

  function handleSave() {
    setTouched(true)
    if (!looksValid) {
      return
    }
    onSave(trimmed, rememberForTab)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect your OpenAI API key"
      description="Your key is used only to generate recommendations for your request. It is never stored on our server."
      labelledBy={titleId}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-700">
            OpenAI API key
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
              placeholder="sk..."
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
              That does not look like a valid OpenAI key.
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
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700 focus-ring"
        >
          Get OpenAI API key
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
