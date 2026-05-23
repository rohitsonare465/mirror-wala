export type MirrorShape = 'RECTANGULAR' | 'ROUND' | 'OVAL' | 'ARCHED' | 'HEXAGONAL' | 'CUSTOM';

export type LedColorType = 'NONE' | 'WARM_WHITE' | 'NATURAL_WHITE' | 'COOL_WHITE' | 'TRI_COLOR' | 'RGB';

export type GlassEdgeStyle = 'POLISHED' | 'BEVELED' | 'FROSTED';

export type SmartFeatureType = 'TOUCH_SENSOR' | 'HAND_WAVE_SENSOR' | 'DEFOGGER' | 'DIGITAL_CLOCK' | 'BLUETOOTH_SPEAKER' | 'DIMMING';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MirrorVariant {
  id: string;
  productId: string;
  sku: string;
  width: number; // in mm
  height: number; // in mm
  price: number;
  salePrice: number | null;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'SHAPE' | 'LED_COLOR' | 'EDGE_STYLE' | 'SMART_FEATURE';
  value: string;
  additionalPrice: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  basePrice: number;
  categoryId: string;
  category?: Category;
  images: string[]; // URLs
  variants: MirrorVariant[];
  customizable: boolean;
  allowedShapes: MirrorShape[];
  allowedLedColors: LedColorType[];
  allowedEdges: GlassEdgeStyle[];
  allowedFeatures: SmartFeatureType[];
  isFeatured: boolean;
  isNew: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
  sku?: string;
  categoryName?: string;
}
