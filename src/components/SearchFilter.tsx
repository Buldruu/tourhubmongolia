import { Search } from 'lucide-react';
import { useLang } from '../lib/i18n';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  type?: 'all' | 'domestic' | 'international';
  onType?: (v: 'all' | 'domestic' | 'international') => void;
  placeholder?: string;
}

export default function SearchFilter({ search, onSearch, type, onType, placeholder }: Props) {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder ?? t('search.placeholder')}
          className="input !pl-11"
        />
      </div>
      {onType && (
        <div className="flex rounded-xl border border-navy-200 bg-white p-1">
          {(['all', 'domestic', 'international'] as const).map((value) => (
            <button
              key={value}
              onClick={() => onType(value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                type === value ? 'bg-navy-700 text-white' : 'text-navy-600 hover:bg-navy-50'
              }`}
            >
              {t(`common.${value}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
