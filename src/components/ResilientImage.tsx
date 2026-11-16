import { useState } from 'react';
import { Wrench } from 'lucide-react';
import { resolveApiUrl } from '../lib/api.ts';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({ src, alt, className = '', fallbackTitle }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50 border border-slate-200 text-slate-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Wrench className="w-8 h-8 text-sky-700 mb-2" strokeWidth={1.6} />
        <span className="text-sm font-medium text-slate-700">{fallbackTitle || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={resolveApiUrl(src)}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
