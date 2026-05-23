'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, ShoppingBag, Menu, X, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PUBLIC_NAV_ITEMS } from '@/constants/navigation';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search logic targeting the /api/products database search endpoint
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setSearchResults(result.data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const items = useCartStore((state) => state.items);
  
  // Track mounting to prevent hydration mismatches with localStorage persisted state
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  // Track window scroll to switch border/background styles for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'backdrop-blur-md bg-stone-950/90 border-b border-amber-500/10 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group select-none"
          >
            <img
              src="/images/logo.jpg"
              alt="Mirrorwala Logo"
              className="h-10 w-10 object-contain rounded-full border border-amber-500/20 group-hover:border-amber-400/50 hover:scale-105 transition-all duration-350 shadow-md shadow-amber-500/5"
            />
            <span className="font-serif text-xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent group-hover:from-white group-hover:to-amber-200 transition-all duration-300">
              Mirrorwala
            </span>
          </Link>

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'relative text-sm uppercase tracking-widest text-stone-300 hover:text-amber-200 font-medium transition-colors duration-200 py-2 group',
                    isActive && 'text-amber-200'
                  )}
                >
                  {item.label}
                  {/* Underline indicator */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-amber-200 to-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left',
                      isActive && 'scale-x-100'
                    )}
                  />
                  {item.badge && (
                    <span className="absolute -top-2.5 -right-6 text-[9px] bg-gradient-to-r from-amber-300 to-amber-500 text-stone-950 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-normal animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button Controls */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Catalog"
              className="text-stone-300 hover:text-amber-300 transition-colors duration-200 cursor-pointer p-1"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/profile"
              aria-label="User Account"
              className="text-stone-300 hover:text-amber-300 transition-colors duration-200 p-1"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative text-stone-300 hover:text-amber-300 transition-colors duration-200 p-1 group animate-fade-in"
            >
              <ShoppingBag className="h-5 w-5" />
              {/* Cart quantity badge */}
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-amber-200 to-yellow-500 px-1 text-[9px] font-extrabold text-stone-950 border border-stone-900 group-hover:bg-white transition-all duration-300">
                  <span className="w-full text-center">{itemCount}</span>
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-stone-300 hover:text-amber-300 transition-colors duration-200 cursor-pointer p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay Menu */}
      <div
        className={cn(
          'fixed inset-0 top-20 z-40 w-full bg-stone-950/95 backdrop-blur-lg border-t border-amber-500/10 md:hidden transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-lg uppercase tracking-widest text-stone-400 hover:text-amber-200 py-2 border-b border-stone-900 transition-colors duration-200 flex justify-between items-center',
                    isActive && 'text-amber-200 border-amber-500/20'
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-gradient-to-r from-amber-300 to-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full uppercase">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Mobile Quick Action Buttons */}
          <div className="flex items-center justify-around py-4 border-y border-stone-900 mt-4">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-2 text-stone-400 hover:text-amber-200 cursor-pointer"
            >
              <Search className="h-5 w-5" />
              <span className="text-xs tracking-widest uppercase">Search</span>
            </button>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-stone-400 hover:text-amber-200"
            >
              <User className="h-5 w-5" />
              <span className="text-xs tracking-widest uppercase">Account</span>
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-stone-400 hover:text-amber-200 relative animate-fade-in"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -left-3 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-extrabold text-stone-950">
                  {itemCount}
                </span>
              )}
              <span className="text-xs tracking-widest uppercase">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Premium Glassmorphic Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-start pt-24 px-4 select-none">
          <div className="max-w-2xl w-full bg-stone-900 border border-stone-850 rounded p-6 shadow-2xl space-y-6 animate-fade-in relative">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-all cursor-pointer"
              title="Close search"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title / Header */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Mirrorwala Catalog Search</span>
              <h3 className="font-serif text-xl font-bold text-white mt-1">Explore Premium Mirrors</h3>
            </div>

            {/* Input Bar */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-stone-500" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by mirror name, organic styles, LED specs..."
                className="w-full bg-stone-950 border border-stone-800 rounded p-4 pl-12 pr-10 text-sm text-stone-200 focus:border-amber-500 outline-none placeholder-stone-600 font-sans shadow-inner"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 h-5 w-5 text-amber-300 animate-spin" />
              )}
            </div>

            {/* Search results list */}
            <div className="max-h-[50vh] overflow-y-auto divide-y divide-stone-850/60 pr-2">
              {isSearching && searchResults.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-xs">
                  Searching catalog...
                </div>
              ) : searchQuery && searchResults.length === 0 && !isSearching ? (
                <div className="py-12 text-center text-stone-500 text-xs">
                  No matching premium mirrors found. Try "LED", "Gold", or "Organic".
                </div>
              ) : (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="flex items-center gap-4 py-3 hover:bg-stone-850/20 px-2 rounded-sm transition-colors group"
                  >
                    <div className="h-12 w-12 rounded bg-stone-950 border border-stone-850 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={product.images && product.images[0] ? product.images[0] : '/images/logo.jpg'}
                        alt={product.name}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 truncate mt-0.5">
                        {product.category?.name || 'Catalog Item'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-stone-300">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Quick Suggestions tags */}
            {!searchQuery && (
              <div className="space-y-2 select-none">
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold block">Popular Searches</span>
                <div className="flex flex-wrap gap-2">
                  {['LED', 'Gold', 'Organic', 'Round', 'Backlit'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="bg-stone-950 hover:bg-stone-850 border border-stone-850 px-3 py-1.5 rounded text-[10px] text-stone-400 hover:text-amber-200 transition-all font-mono cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
