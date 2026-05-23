export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/collections' },
  { label: 'Bespoke Mirrors', href: '/custom-mirrors', badge: 'New' },
  { label: 'Art Gallery', href: '/gallery' },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const ADMIN_SIDEBAR_ITEMS: { label: string; href: string; icon: string }[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/admin/products', icon: 'Sparkles' },
  { label: 'Categories', href: '/admin/categories', icon: 'FolderTree' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
  { label: 'Customer Leads', href: '/admin/leads', icon: 'Activity' },
  { label: 'Coupons', href: '/admin/coupons', icon: 'Percent' },
  { label: 'Customer base', href: '/admin/customers', icon: 'Users' },
  { label: 'Gallery Showcase', href: '/admin/gallery', icon: 'Image' },
  { label: 'SEO Controls', href: '/admin/seo', icon: 'SearchIcon' },
  { label: 'Homepage Hero', href: '/admin/homepage', icon: 'Home' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
];

export const FOOTER_COMPANY_LINKS: NavItem[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blogs & Designer Guide', href: '/blog' },
];

export const FOOTER_SUPPORT_LINKS: NavItem[] = [
  { label: 'Shipping & Delivery Policy', href: '/shipping-policy' },
  { label: 'Refunds & Returns', href: '/refund-policy' },
  { label: 'Customization Help', href: '/custom-mirrors' },
  { label: 'FAQ', href: '/faq' },
];
