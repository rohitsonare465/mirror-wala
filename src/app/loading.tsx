'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 font-sans text-stone-400">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
        <span className="font-serif text-sm tracking-widest uppercase text-amber-200 animate-pulse">
          Reflecting Style...
        </span>
      </div>
    </div>
  );
}
