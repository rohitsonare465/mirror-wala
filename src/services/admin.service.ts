import prisma from '../lib/prisma';
import { 
  AdminProductInput, 
  AdminCategoryInput, 
  CouponInput, 
  SeoInput, 
  EnquiryUpdateInput 
} from '../validations/admin';

export class AdminService {
  
  // ==========================================
  // 1. DASHBOARD ANALYTICS MODULE
  // ==========================================
  static async getDashboardAnalytics() {
    try {
      const totalProducts = await prisma.product.count();
      const totalUsers = await prisma.user.count();
      const totalOrders = await prisma.order.count();
      
      const orders = await prisma.order.findMany({
        include: {
          items: true,
          payment: true,
          user: {
            select: { name: true, email: true }
          }
        }
      });

      // Sum of delivered orders totalAmount
      const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered');
      const netRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // Sum of non-cancelled orders totalAmount as gross sales
      const activeOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
      const totalSales = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // Monthly sales breakdown
      const monthlySalesMap: Record<string, { month: string; sales: number; count: number }> = {};
      
      orders.forEach(order => {
        if (order.orderStatus === 'Cancelled') return;
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        if (!monthlySalesMap[monthKey]) {
          monthlySalesMap[monthKey] = { month: monthName, sales: 0, count: 0 };
        }
        
        monthlySalesMap[monthKey].sales += order.totalAmount;
        monthlySalesMap[monthKey].count += 1;
      });

      const monthlySales = Object.keys(monthlySalesMap)
        .sort()
        .map(key => monthlySalesMap[key]);

      // Recent 10 orders
      const recentOrders = orders
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10)
        .map(o => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.user?.name || 'Guest Customer',
          customerEmail: o.user?.email || 'N/A',
          totalAmount: o.totalAmount,
          orderStatus: o.orderStatus,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
        }));

      // Top products sold ranking
      const productSalesMap: Record<string, { id: string; name: string; quantitySold: number; revenue: number }> = {};
      
      orders.forEach(order => {
        if (order.orderStatus === 'Cancelled') return;
        order.items.forEach(item => {
          if (!productSalesMap[item.productId]) {
            productSalesMap[item.productId] = {
              id: item.productId,
              name: item.productName,
              quantitySold: 0,
              revenue: 0,
            };
          }
          productSalesMap[item.productId].quantitySold += item.quantity;
          productSalesMap[item.productId].revenue += item.totalPrice;
        });
      });

      const topProducts = Object.values(productSalesMap)
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 5);

      // WhatsApp Leads details: count customized quote enquiries
      const whatsappLeads = await prisma.enquiry.count({
        where: {
          type: 'CUSTOM_QUOTE',
        }
      });

      const totalEnquiries = await prisma.enquiry.count();

      return {
        totalSales,
        netRevenue,
        totalProducts,
        totalUsers,
        totalOrders,
        whatsappLeads,
        totalEnquiries,
        monthlySales,
        recentOrders,
        topProducts,
      };
    } catch (error: any) {
      throw new Error(`Analytics compilation failed: ${error.message}`);
    }
  }

  // ==========================================
  // 2. PRODUCT MANAGEMENT MODULE
  // ==========================================
  static async createProduct(input: AdminProductInput) {
    // Generate valid slug if missing or format
    const slug = input.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    return prisma.product.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        shortDescription: input.shortDescription || null,
        sku: input.sku.toUpperCase(),
        price: input.price,
        salePrice: input.salePrice || null,
        stock: input.stock,
        categoryId: input.categoryId,
        featured: input.featured,
        newArrival: input.newArrival,
        images: input.images,
        LEDType: input.LEDType,
        frameMaterial: input.frameMaterial || null,
        dimensions: input.dimensions || null,
      }
    });
  }

  static async updateProduct(id: string, input: Partial<AdminProductInput>) {
    const data: any = { ...input };
    if (input.slug) {
      data.slug = input.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    if (input.sku) {
      data.sku = input.sku.toUpperCase();
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  // ==========================================
  // 3. CATEGORY MANAGEMENT MODULE
  // ==========================================
  static async createCategory(input: AdminCategoryInput) {
    const slug = input.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return prisma.category.create({
      data: {
        name: input.name,
        slug,
        image: input.image || null,
        description: input.description || null,
      }
    });
  }

  static async updateCategory(id: string, input: Partial<AdminCategoryInput>) {
    const data: any = { ...input };
    if (input.slug) {
      data.slug = input.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }

  // ==========================================
  // 4. ORDERS EXPORT & MANAGEMENT MODULE
  // ==========================================
  static async updateOrderStatus(id: string, orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'OutForDelivery' | 'Delivered' | 'Cancelled') {
    return prisma.order.update({
      where: { id },
      data: { orderStatus }
    });
  }

  static async getOrdersCSV() {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    const headers = ['Order Number', 'Date', 'Customer Name', 'Customer Email', 'Payment Method', 'Payment Status', 'Order Status', 'Total Amount'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.createdAt.toISOString().split('T')[0],
      o.user?.name || 'Guest Customer',
      o.user?.email || 'N/A',
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
      o.totalAmount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  // ==========================================
  // 5. CUSTOMER REGISTRY & BLOCKLISTS MODULE
  // ==========================================
  static async getCustomersList() {
    const users = await prisma.user.findMany({
      include: {
        orders: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const blockedRecord = await prisma.homepageContent.findUnique({
      where: { key: 'blocked_users' }
    });

    const blockedList = Array.isArray(blockedRecord?.value) ? (blockedRecord.value as string[]) : [];

    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
      ordersCount: u.orders.length,
      isBlocked: blockedList.includes(u.id),
    }));
  }

  static async toggleUserBlockState(userId: string, blocked: boolean) {
    const record = await prisma.homepageContent.findUnique({
      where: { key: 'blocked_users' }
    });

    let blockedList: string[] = [];
    if (record && Array.isArray(record.value)) {
      blockedList = record.value as string[];
    }

    if (blocked) {
      if (!blockedList.includes(userId)) {
        blockedList.push(userId);
      }
    } else {
      blockedList = blockedList.filter(id => id !== userId);
    }

    await prisma.homepageContent.upsert({
      where: { key: 'blocked_users' },
      create: {
        key: 'blocked_users',
        value: blockedList,
      },
      update: {
        value: blockedList,
      }
    });

    return { userId, blocked };
  }

  // Check if a specific user is currently blocked
  static async isUserBlocked(userId: string): Promise<boolean> {
    const record = await prisma.homepageContent.findUnique({
      where: { key: 'blocked_users' }
    });
    if (record && Array.isArray(record.value)) {
      return (record.value as string[]).includes(userId);
    }
    return false;
  }

  // ==========================================
  // 6. COUPON REGISTRIES MODULE
  // ==========================================
  static async createCoupon(input: CouponInput) {
    return prisma.coupon.create({
      data: {
        code: input.code.toUpperCase(),
        discountType: input.discountType,
        discountValue: input.discountValue,
        minOrderValue: input.minOrderValue || null,
        maxDiscount: input.maxDiscount || null,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        isActive: input.isActive,
      }
    });
  }

  static async deleteCoupon(id: string) {
    return prisma.coupon.delete({
      where: { id }
    });
  }

  static async listCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // ==========================================
  // 7. CUSTOM ENQUIRIES / LEADS TRACKING MODULE
  // ==========================================
  static async listEnquiries() {
    return prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateEnquiry(id: string, input: EnquiryUpdateInput) {
    return prisma.enquiry.update({
      where: { id },
      data: {
        status: input.status,
        adminNotes: input.adminNotes || null,
        imageUrlReference: input.imageUrlReference || null,
      }
    });
  }

  // ==========================================
  // 8. HOMEPAGE CMS JSON MODULE
  // ==========================================
  static async saveHomepageCMS(key: string, value: any) {
    return prisma.homepageContent.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  static async getHomepageCMS(key: string) {
    return prisma.homepageContent.findUnique({
      where: { key },
    });
  }

  // ==========================================
  // 9. GALLERY REGISTRY MODULE
  // ==========================================
  static async addGalleryImage(title: string, imageUrl: string, tags: string[], isFeatured = false) {
    return prisma.gallery.create({
      data: {
        title,
        imageUrl,
        tags,
        isFeatured,
      }
    });
  }

  static async deleteGalleryImage(id: string) {
    return prisma.gallery.delete({
      where: { id }
    });
  }

  static async listGallery() {
    return prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // ==========================================
  // 10. SEO & SITEMAP GENERATOR MODULE
  // ==========================================
  static async updateSeoMetadata(key: string, seoData: SeoInput) {
    // Stores SEO tags in key-value structure inside HomepageContent
    return prisma.homepageContent.upsert({
      where: { key: `seo:${key}` },
      create: {
        key: `seo:${key}`,
        value: seoData as any,
      },
      update: {
        value: seoData as any,
      }
    });
  }

  static async generateSitemapXML(): Promise<string> {
    const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });
    const categories = await prisma.category.findMany({ select: { slug: true, updatedAt: true } });
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mirrorwala.com';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = ['', '/about', '/customization', '/gallery', '/contact'];
    staticPages.forEach(path => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${path}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Categories
    categories.forEach(cat => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/collections/${cat.slug}</loc>\n`;
      xml += `    <lastmod>${cat.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // Products
    products.forEach(prod => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product/${prod.slug}</loc>\n`;
      xml += `    <lastmod>${prod.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  }
}
