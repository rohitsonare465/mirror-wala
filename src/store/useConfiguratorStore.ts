import { create } from 'zustand';
import { CustomMirrorConfig, CustomConfigPriceBreakdown, PricingFactor } from '@/types/custom-mirror';
import { MirrorShape, LedColorType, GlassEdgeStyle, SmartFeatureType } from '@/types/product';

interface ConfiguratorState {
  config: CustomMirrorConfig;
  pricingFactors: PricingFactor;
  
  // Actions to mutate configuration state
  setShape: (shape: MirrorShape) => void;
  setDimensions: (width: number, height: number) => void;
  setThickness: (thickness: 4 | 5 | 6) => void;
  setEdgeStyle: (style: GlassEdgeStyle) => void;
  setLedColor: (color: LedColorType) => void;
  toggleFeature: (feature: SmartFeatureType) => void;
  setFrameStyle: (frameStyleId: string | null) => void;
  resetConfig: () => void;
  
  // Dynamic Pricing Breakdowns
  getPriceBreakdown: () => CustomConfigPriceBreakdown;
}

const DEFAULT_CONFIG: CustomMirrorConfig = {
  shape: 'RECTANGULAR',
  width: 600,  // Standard width in mm (2 feet)
  height: 900, // Standard height in mm (3 feet)
  thickness: 5, // Standard thickness in mm
  edgeStyle: 'POLISHED',
  ledColor: 'NONE',
  features: [],
  frameStyleId: null,
};

const DUMMY_PRICING_FACTORS: PricingFactor = {
  basePerSqFt: 350, // base cost of glass per square foot
  glassThicknessMultiplier: {
    4: 1.0,
    5: 1.25,
    6: 1.5,
  },
  shapePremium: {
    RECTANGULAR: 0,
    ROUND: 200,
    OVAL: 300,
    ARCHED: 500,
    HEXAGONAL: 400,
    CUSTOM: 1500,
  },
  edgeStylePremium: {
    POLISHED: 0,
    BEVELED: 150,
    FROSTED: 100,
  },
  ledColorPremium: {
    NONE: 0,
    WARM_WHITE: 800,
    NATURAL_WHITE: 800,
    COOL_WHITE: 800,
    TRI_COLOR: 1500,
    RGB: 2500,
  },
  featuresPremium: {
    TOUCH_SENSOR: 500,
    HAND_WAVE_SENSOR: 800,
    DEFOGGER: 1500,
    DIGITAL_CLOCK: 1200,
    BLUETOOTH_SPEAKER: 2000,
    DIMMING: 300,
  },
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  config: DEFAULT_CONFIG,
  pricingFactors: DUMMY_PRICING_FACTORS,

  setShape: (shape) => set((state) => ({ config: { ...state.config, shape } })),

  setDimensions: (width, height) =>
    set((state) => ({ config: { ...state.config, width, height } })),

  setThickness: (thickness) =>
    set((state) => ({ config: { ...state.config, thickness } })),

  setEdgeStyle: (edgeStyle) =>
    set((state) => ({ config: { ...state.config, edgeStyle } })),

  setLedColor: (ledColor) =>
    set((state) => ({ config: { ...state.config, ledColor } })),

  toggleFeature: (feature) =>
    set((state) => {
      const { features } = state.config;
      const isSelected = features.includes(feature);
      const updatedFeatures = isSelected
        ? features.filter((f) => f !== feature)
        : [...features, feature];
      return { config: { ...state.config, features: updatedFeatures } };
    }),

  setFrameStyle: (frameStyleId) =>
    set((state) => ({ config: { ...state.config, frameStyleId } })),

  resetConfig: () => set({ config: DEFAULT_CONFIG }),

  getPriceBreakdown: () => {
    const { config, pricingFactors } = get();
    
    // Convert mm to square feet: (width / 304.8) * (height / 304.8)
    const sqFt = (config.width / 304.8) * (config.height / 304.8);
    
    const thicknessMultiplier = pricingFactors.glassThicknessMultiplier[config.thickness];
    const rawGlassPrice = Math.round(sqFt * pricingFactors.basePerSqFt * thicknessMultiplier);
    
    const shapePremium = pricingFactors.shapePremium[config.shape];
    const edgeStylePrice = pricingFactors.edgeStylePremium[config.edgeStyle];
    const ledPrice = pricingFactors.ledColorPremium[config.ledColor];
    
    const featuresPrice = config.features.reduce(
      (sum, feature) => sum + pricingFactors.featuresPremium[feature],
      0
    );
    
    // Mock frame cost
    const framePrice = config.frameStyleId ? 1800 : 0;
    
    const subtotal = rawGlassPrice + shapePremium + edgeStylePrice + ledPrice + featuresPrice + framePrice;
    const estimatedTax = Math.round(subtotal * 0.18); // 18% standard GST
    const total = subtotal + estimatedTax;

    return {
      rawGlassPrice,
      shapePremium,
      edgeStylePrice,
      ledPrice,
      featuresPrice,
      framePrice,
      subtotal,
      estimatedTax,
      total,
    };
  },
}));
