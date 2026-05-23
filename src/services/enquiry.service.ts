import { EnquiryRepository } from '../lib/repositories/enquiry.repository';
import { EmailService } from './email';
import { 
  enquiryValidationSchema, 
  customMirrorConfigSchema,
  EnquiryInput, 
  CustomMirrorConfigInput 
} from '../validations/enquiry';
import { Enquiry as CoreEnquiry } from '../types/enquiry';

export class EnquiryService {
  private enquiryRepository: EnquiryRepository;

  constructor(enquiryRepository = new EnquiryRepository()) {
    this.enquiryRepository = enquiryRepository;
  }

  /**
   * Premium pricing calculation engine for customized luxury mirrors.
   * Computes structural area premiums, shape difficulty factors, edge polishing perimeters,
   * smart feature additions, and luxury handling charges.
   */
  calculateCustomPrice(config: CustomMirrorConfigInput): number {
    const validated = customMirrorConfigSchema.parse(config);
    const { shape, width, height, thickness, edgeStyle, ledColor, features } = validated;

    // 1. Area-based structural rate math
    const areaSqm = (width / 1000) * (height / 1000);
    let glassRatePerSqm = 2000; // default 5mm
    if (thickness === 4) glassRatePerSqm = 1500;
    else if (thickness === 6) glassRatePerSqm = 2500;

    const baseGlassCost = areaSqm * glassRatePerSqm;

    // 2. Shape cutting difficulty multiplier
    const shapeMultipliers: Record<string, number> = {
      RECTANGULAR: 1.0,
      ROUND: 1.2,
      OVAL: 1.3,
      ARCHED: 1.4,
      HEXAGONAL: 1.3,
      CUSTOM: 1.5,
    };
    const shapeMultiplier = shapeMultipliers[shape] || 1.0;
    const shapeGlassCost = baseGlassCost * shapeMultiplier;

    // 3. Edge polishing linear perimeter math
    let perimeterM = 0;
    if (shape === 'ROUND') {
      const diameterM = Math.max(width, height) / 1000;
      perimeterM = Math.PI * diameterM;
    } else {
      perimeterM = 2 * ((width / 1000) + (height / 1000));
    }

    const edgeRates: Record<string, number> = {
      POLISHED: 200,
      BEVELED: 400,
      FROSTED: 300,
    };
    const edgeRate = edgeRates[edgeStyle] || 200;
    const edgeCost = perimeterM * edgeRate;

    // 4. LED illumination lighting premium
    const ledRates: Record<string, number> = {
      NONE: 0,
      WARM_WHITE: 1200,
      NATURAL_WHITE: 1200,
      COOL_WHITE: 1200,
      TRI_COLOR: 2000,
      RGB: 2800,
    };
    const ledCost = ledRates[ledColor] || 0;

    // 5. Smart interactive feature premiums
    const featureRates: Record<string, number> = {
      TOUCH_SENSOR: 800,
      HAND_WAVE_SENSOR: 1200,
      DEFOGGER: 1500,
      DIGITAL_CLOCK: 1000,
      BLUETOOTH_SPEAKER: 2500,
      DIMMING: 600,
    };
    const featuresCost = features.reduce((sum, f) => sum + (featureRates[f] || 0), 0);

    // 6. Assemble total with luxury handling margins
    const subtotal = shapeGlassCost + edgeCost + ledCost + featuresCost;
    const luxuryHandlingFee = 500;
    const rawTotal = subtotal + luxuryHandlingFee;

    // Round beautifully to the nearest 50 INR
    return Math.round(rawTotal / 50) * 50;
  }

  /**
   * Submits a customer inquiry. Handles bespoke mirror configurators and triggers admin email alerts.
   */
  async submitEnquiry(data: EnquiryInput) {
    const validatedData = enquiryValidationSchema.parse(data);

    let estimatedPrice: number | undefined;

    // If it's a customization request, run the calculation engine
    if (
      validatedData.type === 'CUSTOM_QUOTE' &&
      validatedData.shape &&
      validatedData.width &&
      validatedData.height &&
      validatedData.thickness &&
      validatedData.edgeStyle &&
      validatedData.ledColor
    ) {
      estimatedPrice = this.calculateCustomPrice({
        shape: validatedData.shape,
        width: validatedData.width,
        height: validatedData.height,
        thickness: validatedData.thickness as any,
        edgeStyle: validatedData.edgeStyle,
        ledColor: validatedData.ledColor,
        features: validatedData.features || [],
      });
    }

    const prismaEnquiry = await this.enquiryRepository.create({
      ...validatedData,
      estimatedPrice,
      status: 'NEW',
    });

    const coreEnquiry = this.mapPrismaEnquiryToCore(prismaEnquiry);

    // Trigger transactional admin alerts for high-value customization quotes
    if (validatedData.type === 'CUSTOM_QUOTE') {
      await EmailService.sendCustomQuoteRequestAlert(coreEnquiry);
    }

    return coreEnquiry;
  }

  /**
   * Fetches an inquiry by ID.
   */
  async getEnquiryById(id: string): Promise<CoreEnquiry> {
    if (!id) throw new Error('Enquiry ID is required');
    const enquiry = await this.enquiryRepository.findById(id);
    if (!enquiry) throw new Error('Enquiry not found');
    return this.mapPrismaEnquiryToCore(enquiry);
  }

  /**
   * Searches and filters inquiries.
   */
  async getEnquiries(filters?: { status?: string; type?: string }) {
    const enquiries = await this.enquiryRepository.findMany(filters);
    return enquiries.map(e => this.mapPrismaEnquiryToCore(e));
  }

  /**
   * Updates inquiry workflow state.
   */
  async updateEnquiryStatus(id: string, status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'CLOSED', adminNotes?: string) {
    if (!id) throw new Error('Enquiry ID is required');
    const updated = await this.enquiryRepository.updateStatus(id, status, adminNotes);
    return this.mapPrismaEnquiryToCore(updated);
  }

  /**
   * Relational mapper parsing Prisma DB documents into core types.
   */
  private mapPrismaEnquiryToCore(prismaEnquiry: any): CoreEnquiry {
    const statusMap: Record<string, 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'CLOSED'> = {
      NEW: 'NEW',
      CONTACTED: 'CONTACTED',
      QUOTED: 'QUOTED',
      CONVERTED: 'CONVERTED',
      CLOSED: 'CLOSED',
    };

    return {
      id: prismaEnquiry.id,
      type: prismaEnquiry.type,
      fullName: prismaEnquiry.fullName,
      email: prismaEnquiry.email,
      phone: prismaEnquiry.phone,
      subject: prismaEnquiry.subject,
      message: prismaEnquiry.message,
      status: statusMap[prismaEnquiry.status] || 'NEW',
      adminNotes: prismaEnquiry.adminNotes ?? null,
      customMirrorLead: prismaEnquiry.shape ? {
        config: {
          shape: prismaEnquiry.shape,
          width: prismaEnquiry.width ?? 0,
          height: prismaEnquiry.height ?? 0,
          thickness: (prismaEnquiry.thickness as 4 | 5 | 6) ?? 5,
          edgeStyle: prismaEnquiry.edgeStyle ?? 'POLISHED',
          ledColor: prismaEnquiry.ledColor ?? 'NONE',
          features: (prismaEnquiry.features || []) as any[],
          frameStyleId: null,
        },
        imageUrlReference: prismaEnquiry.imageUrlReference ?? undefined,
        estimatedPrice: prismaEnquiry.estimatedPrice ?? undefined,
      } : null,
      createdAt: prismaEnquiry.createdAt,
      updatedAt: prismaEnquiry.updatedAt,
    };
  }
}
