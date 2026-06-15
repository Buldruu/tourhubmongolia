import { Loader2, Inbox, AlertTriangle } from 'lucide-react';
import { useLang } from '../lib/i18n';

export function Loading({ text }: { text?: string }) {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-navy-400">
      <Loader2 className="animate-spin" size={32} />
      <p className="text-sm font-medium">{text ?? t('common.loading')}</p>
    </div>
  );
}

export function Empty({ text }: { text?: string }) {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-navy-200 py-16 text-navy-400">
      <Inbox size={36} />
      <p className="text-sm font-medium">{text ?? t('common.empty')}</p>
    </div>
  );
}

export function ErrorState({ text, onRetry }: { text?: string; onRetry?: () => void }) {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 py-16 text-red-500">
      <AlertTriangle size={36} />
      <p className="px-4 text-center text-sm font-medium">{text ?? t('common.error')}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline !px-4 !py-2 text-sm">
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}
