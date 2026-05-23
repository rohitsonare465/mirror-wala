import { z } from 'zod';

export const customMirrorConfigSchema = z.object({
  shape: z.enum(['RECTANGULAR', 'ROUND', 'OVAL', 'ARCHED', 'HEXAGONAL', 'CUSTOM'], {
    required_error: "Shape selection is required",
  }),
  width: z.number()
    .min(300, "Minimum width must be 300 mm")
    .max(2400, "Maximum width cannot exceed 2400 mm"),
  height: z.number()
    .min(300, "Minimum height must be 300 mm")
    .max(2400, "Maximum height cannot exceed 2400 mm"),
  thickness: z.union([z.literal(4), z.literal(5), z.literal(6)], {
    errorMap: () => ({ message: "Glass thickness must be 4mm, 5mm, or 6mm" }),
  }),
  edgeStyle: z.enum(['POLISHED', 'BEVELED', 'FROSTED']),
  ledColor: z.enum(['NONE', 'WARM_WHITE', 'NATURAL_WHITE', 'COOL_WHITE', 'TRI_COLOR', 'RGB']),
  features: z.array(z.enum(['TOUCH_SENSOR', 'HAND_WAVE_SENSOR', 'DEFOGGER', 'DIGITAL_CLOCK', 'BLUETOOTH_SPEAKER', 'DIMMING'])),
});

export const enquiryValidationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters long").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters long").max(1000),
  type: z.enum(['GENERAL', 'CUSTOM_QUOTE', 'BULK_ORDER', 'COLLABORATION']).default('GENERAL'),
  
  // Custom configurations
  shape: z.enum(['RECTANGULAR', 'ROUND', 'OVAL', 'ARCHED', 'HEXAGONAL', 'CUSTOM']).optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  thickness: z.number().optional().nullable(),
  edgeStyle: z.enum(['POLISHED', 'BEVELED', 'FROSTED']).optional().nullable(),
  ledColor: z.enum(['NONE', 'WARM_WHITE', 'NATURAL_WHITE', 'COOL_WHITE', 'TRI_COLOR', 'RGB']).optional().nullable(),
  features: z.array(z.enum(['TOUCH_SENSOR', 'HAND_WAVE_SENSOR', 'DEFOGGER', 'DIGITAL_CLOCK', 'BLUETOOTH_SPEAKER', 'DIMMING'])).optional(),
  imageUrlReference: z.string().url().optional().nullable(),
});

export type EnquiryInput = z.infer<typeof enquiryValidationSchema>;
export type CustomMirrorConfigInput = z.infer<typeof customMirrorConfigSchema>;
