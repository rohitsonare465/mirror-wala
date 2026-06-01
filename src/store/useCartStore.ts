import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Coupon } from '@/types/order';
import { authClient } from '@/lib/auth-client';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  shippingCharges: number;
  taxRate: number; // e.g. 0.18 for 18% GST in India
  isGuest: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'totalPrice'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  syncWithDatabase: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  setGuestMode: (isGuest: boolean) => void;
  
  // Selectors/Computed values
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTaxAmount: () => number;
  getTotalAmount: () => number;
}

// Map MongoDB database CartItem + Product to Zustand CartItem structure
const mapDbCartItemToZustand = (dbItem: any): CartItem | null => {
  if (!dbItem || !dbItem.product) {
    console.warn('⚠️ Stale or deleted product detected in database cart item, skipping.');
    return null;
  }

  let customization = null;
  if (dbItem.customizationDetails) {
    try {
      customization = JSON.parse(dbItem.customizationDetails);
    } catch (e) {
      console.error('Failed to parse customization details', e);
    }
  }

  const selectedSize = customization?.features?.[0] || 'Standard (600x800mm)';
  
  // Calculate size premium: standard base, premium grand is +4000
  let sizePremium = 0;
  if (selectedSize.includes('800x1200mm') || selectedSize.includes('Premium Grand') || selectedSize.includes('1050mm') || selectedSize.includes('Grand')) {
    sizePremium = 4000;
  }

  const basePrice = dbItem.product.price;
  const unitPrice = basePrice + sizePremium;
  const totalPrice = unitPrice * dbItem.quantity;

  const slugToCategory: Record<string, string> = {
    'aura-smart-led-bulb-mirror': 'LED Mirrors',
    'designer-gold-frame-mirror': 'Designer Mirrors',
    'galaxy-mosaic-art-mirror': 'Art Mirrors',
    'luxury-led-crystal-mirror': 'Luxury Mirrors',
    'designer-green-organic-mirror': 'Custom Mirrors',
    'floral-engraved-modern-mirror': 'Bathroom Mirrors',
  };
  const categoryName = slugToCategory[dbItem.product.slug] || 'Luxury Mirror';

  return {
    id: dbItem.id, // DB cart item ID
    productId: dbItem.productId,
    product: {
      id: dbItem.product.id,
      name: dbItem.product.name,
      slug: dbItem.product.slug,
      description: dbItem.product.description,
      shortDescription: dbItem.product.shortDescription || null,
      basePrice: dbItem.product.price,
      categoryId: dbItem.product.categoryId,
      images: dbItem.product.images || [],
      variants: [],
      customizable: true,
      allowedShapes: [],
      allowedLedColors: [],
      allowedEdges: [],
      allowedFeatures: [],
      isFeatured: dbItem.product.featured || false,
      isNew: dbItem.product.newArrival || false,
      seoTitle: null,
      seoDescription: null,
      seoKeywords: [],
      createdAt: new Date(dbItem.product.createdAt),
      updatedAt: new Date(dbItem.product.updatedAt),
      sku: dbItem.product.sku,
      categoryName,
    },
    variantId: null,
    variant: null,
    customization,
    quantity: dbItem.quantity,
    unitPrice,
    totalPrice,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shippingCharges: 0,
      taxRate: 0.18, // 18% standard GST for glass/mirrors in India
      isGuest: true,

      setGuestMode: (isGuest) => {
        if (isGuest) {
          set({ items: [], coupon: null, isGuest: true });
        } else {
          set({ isGuest: false });
        }
      },

      addItem: (item) => {
        set((state) => {
          const selectedSize = item.customization?.features?.[0] || 'Standard (600x800mm)';
          const ledSetting = item.customization?.ledColor || 'NONE';

          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && 
                   (i.customization?.features?.[0] === selectedSize) &&
                   (i.customization?.ledColor === ledSetting)
          );

          let updatedItems = [...state.items];
          if (existingIndex > -1) {
            updatedItems[existingIndex].quantity += item.quantity;
            updatedItems[existingIndex].totalPrice = updatedItems[existingIndex].quantity * updatedItems[existingIndex].unitPrice;
          } else {
            const newItem = {
              ...item,
              totalPrice: item.quantity * item.unitPrice,
            } as CartItem;
            updatedItems.push(newItem);
          }

          // DB Sync
          authClient.getSession().then((sessionRes) => {
            if (sessionRes?.data?.user) {
              fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: item.productId,
                  quantity: item.quantity,
                  customizationDetails: item.customization
                })
              })
              .then(res => res.json())
              .then(json => {
                if (json.success && json.data) {
                  const mapped = json.data.items.map(mapDbCartItemToZustand).filter((item: CartItem | null): item is CartItem => item !== null);
                  set({ items: mapped });
                }
              })
              .catch(err => console.error('Error syncing add item:', err));
            }
          });

          return { items: updatedItems };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== cartItemId);

          // DB Sync
          authClient.getSession().then((sessionRes) => {
            if (sessionRes?.data?.user) {
              fetch(`/api/cart?itemId=${cartItemId}`, {
                method: 'DELETE'
              })
              .then(res => res.json())
              .then(json => {
                if (json.success && json.data) {
                  const mapped = json.data.items.map(mapDbCartItemToZustand).filter((item: CartItem | null): item is CartItem => item !== null);
                  set({ items: mapped });
                }
              })
              .catch(err => console.error('Error syncing remove item:', err));
            }
          });

          return { items: updatedItems };
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.id === cartItemId
              ? { ...i, quantity, totalPrice: quantity * i.unitPrice }
              : i
          );

          // DB Sync
          authClient.getSession().then((sessionRes) => {
            if (sessionRes?.data?.user) {
              fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  itemId: cartItemId,
                  quantity
                })
              })
              .then(res => res.json())
              .then(json => {
                if (json.success && json.data) {
                  const mapped = json.data.items.map(mapDbCartItemToZustand).filter((item: CartItem | null): item is CartItem => item !== null);
                  set({ items: mapped });
                }
              })
              .catch(err => console.error('Error syncing update quantity:', err));
            }
          });

          return { items: updatedItems };
        });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
        
        // DB Sync
        authClient.getSession().then((sessionRes) => {
          if (sessionRes?.data?.user) {
            fetch('/api/cart?clear=true', {
              method: 'DELETE'
            })
            .catch(err => console.error('Error syncing clear cart:', err));
          }
        });
      },

      syncWithDatabase: async () => {
        try {
          const sessionRes = await authClient.getSession();
          if (sessionRes?.data?.user) {
            const res = await fetch('/api/cart');
            const json = await res.json();
            if (json.success && json.data) {
              const dbItems = json.data.items || [];
              const mappedItems = dbItems.map(mapDbCartItemToZustand).filter((item: CartItem | null): item is CartItem => item !== null);
              set({ items: mappedItems, isGuest: false });
            }
          }
        } catch (error) {
          console.error('Failed to sync cart with database:', error);
        }
      },

      mergeGuestCart: async () => {
        try {
          const sessionRes = await authClient.getSession();
          if (sessionRes?.data?.user) {
            const { items, isGuest } = get();
            if (isGuest && items.length > 0) {
              // Immediately toggle isGuest to false to prevent duplicate trigger while in-flight
              set({ isGuest: false });
              
              const res = await fetch('/api/cart/merge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    customization: item.customization
                  }))
                })
              });
              const json = await res.json();
              if (json.success && json.data) {
                const dbItems = json.data.items || [];
                const mappedItems = dbItems.map(mapDbCartItemToZustand).filter((item: CartItem | null): item is CartItem => item !== null);
                set({ items: mappedItems, coupon: null, isGuest: false });
              } else {
                // If merge failed on server, revert isGuest to true so we can retry
                set({ isGuest: true });
              }
            } else {
              await get().syncWithDatabase();
              set({ isGuest: false });
            }
          }
        } catch (error) {
          // Revert isGuest to true in case of network failure
          set({ isGuest: true });
          console.error('Failed to merge guest cart:', error);
        }
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getDiscountAmount: () => {
        const { coupon } = get();
        const subtotal = get().getSubtotal();
        if (!coupon) return 0;
        
        if (coupon.discountType === 'PERCENTAGE') {
          const discount = (subtotal * coupon.discountValue) / 100;
          return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
        } else {
          return Math.min(coupon.discountValue, subtotal);
        }
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const taxRate = get().taxRate;
        return (subtotal - discount) * taxRate;
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const tax = get().getTaxAmount();
        const shipping = get().shippingCharges;
        return subtotal - discount + tax + shipping;
      },
    }),
    {
      name: 'mirrorwala-cart-storage', // Persist cart in local storage
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        shippingCharges: state.shippingCharges,
        isGuest: state.isGuest,
      }),
    }
  )
);
