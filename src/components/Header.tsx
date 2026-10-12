import { KeyIcon, SparklesIcon } from './icons'
import { cn } from '../lib/utils'

interface HeaderProps {
  hasKey: boolean
  onManageKey: () => void
}

export function Header({ hasKey, onManageKey }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5 rounded-lg focus-ring">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-lift">
            <SparklesIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">RecomAI</span>
        </a>
        <button
          type="button"
          onClick={onManageKey}
          className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-card transition hover:border-brand-300 hover:text-brand-700 focus-ring"
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              hasKey ? 'bg-emerald-500' : 'bg-slate-300'
            )}
            aria-hidden="true"
          />
          <KeyIcon className="h-4 w-4 text-slate-400 group-hover:text-brand-500" />
          <span className="hidden sm:inline">{hasKey ? 'Key connected' : 'Connect API key'}</span>
          <span className="sm:hidden">{hasKey ? 'Connected' : 'Connect'}</span>
        </button>
      </div>
    </header>
  )
}
