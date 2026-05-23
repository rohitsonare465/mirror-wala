'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/utils/cn';
import { ADMIN_SIDEBAR_ITEMS } from '@/constants/navigation';
import * as Icons from 'lucide-react';
import { ShieldCheck, LogOut, ShieldAlert, Menu, X } from 'lucide-react';
import { ToastProvider } from '@/components/ui/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Helper to resolve dynamic icons from lucide-react
  const renderIcon = (iconName: string) => {
    const ResolvedIcon = (Icons as any)[iconName] || Icons.HelpCircle;
    return <ResolvedIcon className="h-4.5 w-4.5 flex-shrink-0" />;
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 font-sans text-xs text-stone-400">
        <span>Loading Admin System...</span>
      </div>
    );
  }

  // Restrict access to ADMIN users only
  const isAdmin = session?.user && (session.user.role === 'ADMIN' || (session.user as any).role === 'ADMIN');
  
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 p-4 font-sans text-stone-300">
        <div className="max-w-md w-full bg-stone-900 border border-stone-850 p-8 rounded text-center flex flex-col items-center gap-6 shadow-2xl">
          <div className="h-14 w-14 rounded-full bg-red-950/20 border border-red-900/30 flex items-center justify-center text-red-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white">Guarded Territory</h1>
            <p className="text-xs text-stone-400 leading-relaxed mt-2">
              You must possess administrator credentials to gain access to the backoffice modules.
            </p>
          </div>
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => router.push('/login?callbackUrl=/admin/dashboard')}
              className="w-full bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3 rounded"
            >
              Sign In with Admin Credentials
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-stone-800 hover:bg-stone-750 text-stone-300 font-extrabold uppercase tracking-widest text-[10px] py-3 rounded transition-colors"
            >
              Return to Public Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-stone-950 font-sans text-stone-200 antialiased">
        
        {/* Sidebar - Desktop Layout */}
        <aside className="hidden lg:flex flex-col w-64 bg-stone-900 border-r border-stone-850 h-screen sticky top-0">
          {/* Branding header */}
          <div className="h-20 flex items-center px-6 border-b border-stone-850 select-none">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-300" />
              <span className="font-serif text-lg font-bold tracking-wider text-white">MIRRORWALA</span>
              <span className="text-[8px] bg-amber-500/10 text-amber-300 border border-amber-550/20 px-1.5 py-0.5 rounded uppercase font-sans font-extrabold">
                Backoffice
              </span>
            </Link>
          </div>

          {/* Navigation list */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1.5">
            {ADMIN_SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 text-xs uppercase tracking-wider font-extrabold px-3 py-3 rounded-md transition-all duration-300',
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/10'
                      : 'text-stone-400 hover:bg-stone-850 hover:text-amber-200'
                  )}
                >
                  {renderIcon(item.icon)}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer actions */}
          <div className="p-4 border-t border-stone-850 flex flex-col gap-2">
            <button
              onClick={() => router.push('/')}
              className="w-full text-center text-stone-500 hover:text-stone-300 py-2 text-[10px] uppercase tracking-widest font-extrabold border border-stone-800 rounded transition-colors"
            >
              Visit Showroom
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-1.5 text-stone-400 hover:text-red-400 py-2 text-[10px] uppercase tracking-widest font-extrabold transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Close Portal
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar & Drawer toggle header */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Mobile Header Bar */}
          <header className="lg:hidden h-16 bg-stone-900 border-b border-stone-850 flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center gap-2 select-none">
              <ShieldCheck className="h-4.5 w-4.5 text-amber-300" />
              <span className="font-serif text-sm font-bold text-white tracking-widest">MIRRORWALA</span>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-stone-300 hover:text-amber-300 p-1"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </header>

          {/* Mobile Drawer menu */}
          {mobileOpen && (
            <div className="fixed inset-0 top-16 bg-stone-950/95 z-40 flex flex-col lg:hidden border-t border-stone-850/60 p-4">
              <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
                {ADMIN_SIDEBAR_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 text-xs uppercase tracking-wider font-extrabold px-3 py-3.5 rounded transition-colors',
                        isActive
                          ? 'bg-amber-400 text-stone-950 font-black'
                          : 'text-stone-400 border-b border-stone-900'
                      )}
                    >
                      {renderIcon(item.icon)}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-stone-900 flex justify-between gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="text-xs uppercase font-extrabold text-stone-400"
                >
                  Showroom
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-xs uppercase font-extrabold text-red-400 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Exit
                </button>
              </div>
            </div>
          )}

          {/* Main Panel Viewport */}
          <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

