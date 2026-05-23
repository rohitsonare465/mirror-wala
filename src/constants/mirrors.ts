import { MirrorShape, LedColorType, GlassEdgeStyle, SmartFeatureType } from '@/types/product';

export const CONFIGURATOR_LIMITS = {
  width: { min: 300, max: 2400, step: 50 },  // mm
  height: { min: 300, max: 2400, step: 50 }, // mm
  thickness: [4, 5, 6] as const,             // mm
};

export const SHAPE_OPTIONS: { value: MirrorShape; label: string; description: string }[] = [
  { value: 'RECTANGULAR', label: 'Classic Rectangle / Square', description: 'Timeless straight-edged mirrors, perfect for any wall.' },
  { value: 'ROUND', label: 'Perfect Circle', description: 'Elegant circular geometry that adds soft contours to rooms.' },
  { value: 'OVAL', label: 'Sleek Oval', description: 'Elongated curves offering high premium design aesthetic.' },
  { value: 'ARCHED', label: 'Guarded Arch', description: 'Flat-base with a semicircular arch top. Contemporary designer look.' },
  { value: 'HEXAGONAL', label: 'Geometric Hexagon', description: 'Hexagonal honeycomb styling for a striking modern centerpiece.' },
  { value: 'CUSTOM', label: 'Bespoke Organic Shape', description: 'Upload your CAD drawings or sketch for a truly unique piece.' },
];

export const LED_COLOR_OPTIONS: { value: LedColorType; label: string; temperature?: string }[] = [
  { value: 'NONE', label: 'No LED Backlight' },
  { value: 'WARM_WHITE', label: 'Warm White Light', temperature: '3000K' },
  { value: 'NATURAL_WHITE', label: 'Natural Daylight White', temperature: '4000K' },
  { value: 'COOL_WHITE', label: 'Cool White / Crystal White', temperature: '6000K' },
  { value: 'TRI_COLOR', label: 'Tri-Color LED (Warm, Natural & Cool)', temperature: 'Switchable 3000K - 6000K' },
  { value: 'RGB', label: 'RGB Multi-Color Ambient (App Controlled)' },
];

export const EDGE_STYLE_OPTIONS: { value: GlassEdgeStyle; label: string; description: string }[] = [
  { value: 'POLISHED', label: 'Polished Edge (Pencil Edge)', description: 'Smooth, shining, rounded borders suited for frameless mounts.' },
  { value: 'BEVELED', label: 'Elegant Beveled Edge (1-inch)', description: 'Slanted mirror border that catches light beautifully like a gem.' },
  { value: 'FROSTED', label: 'Sandblasted Frosted Border', description: '1.5-inch sandblasted edge to diffuse front-firing LED glow.' },
];

export const SMART_FEATURE_OPTIONS: { value: SmartFeatureType; label: string; description: string }[] = [
  { value: 'TOUCH_SENSOR', label: 'Capacitive Glass Touch Sensor', description: 'Illuminated glass icon to toggle lights ON/OFF.' },
  { value: 'HAND_WAVE_SENSOR', label: 'Proximity Hand-Wave Sensor', description: 'Wave hand under/beside the mirror to switch states.' },
  { value: 'DEFOGGER', label: 'Thermo-Electric Anti-Fog Demister', description: 'Heated pad behind the glass that keeps mirror crystal clear during steam.' },
  { value: 'DIGITAL_CLOCK', label: 'Integrated Digital Clock', description: '24-hour clock screen embedded in the glass face.' },
  { value: 'BLUETOOTH_SPEAKER', label: 'Stereo Bluetooth Wall Transducer', description: 'Turn your mirror into a high-fidelity wall speaker.' },
  { value: 'DIMMING', label: 'Stepless Light Dimming Touch Controller', description: 'Hold touch sensor down to dim LED intensity 10% to 100%.' },
];
