import { MirrorShape, LedColorType, GlassEdgeStyle, SmartFeatureType } from './product';

export interface CustomMirrorSizeRange {
  minWidth: number;  // in mm, e.g., 300
  maxWidth: number;  // in mm, e.g., 2400
  minHeight: number; // in mm, e.g., 300
  maxHeight: number; // in mm, e.g., 2400
}

export interface CustomMirrorConfig {
  shape: MirrorShape;
  width: number;       // in mm
  height: number;      // in mm
  thickness: 4 | 5 | 6; // in mm (standard mirror glass thickness)
  edgeStyle: GlassEdgeStyle;
  ledColor: LedColorType;
  features: SmartFeatureType[];
  frameStyleId: string | null; // references frame category
}

export interface PricingFactor {
  basePerSqFt: number;
  glassThicknessMultiplier: {
    4: number;
    5: number;
    6: number;
  };
  shapePremium: Record<MirrorShape, number>;
  edgeStylePremium: Record<GlassEdgeStyle, number>;
  ledColorPremium: Record<LedColorType, number>;
  featuresPremium: Record<SmartFeatureType, number>;
}

export interface CustomConfigPriceBreakdown {
  rawGlassPrice: number;
  shapePremium: number;
  edgeStylePrice: number;
  ledPrice: number;
  featuresPrice: number;
  framePrice: number;
  subtotal: number;
  estimatedTax: number;
  total: number;
}
