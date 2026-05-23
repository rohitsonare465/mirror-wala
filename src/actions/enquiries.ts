'use server';

import prisma from '@/lib/prisma';
import { enquiryValidationSchema, EnquiryInput } from '@/validations/enquiry';
import { EmailService } from '@/services/email';

/**
 * Handle new customer enquiries and custom mirror configuration quotes
 */
export async function submitEnquiryAction(rawInput: EnquiryInput): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    // 1. Zod input validation guard
    const validatedData = enquiryValidationSchema.parse(rawInput);
    
    // 2. SKELETON: Save request details to database
    // const enquiry = await prisma.enquiry.create({ data: { ... } })
    
    console.log('[Server Action] submitEnquiryAction parsed inquiry successfully');
    
    // 3. SKELETON: Trigger Resend/SMTP email notification to administrators and custom quote team
    // await EmailService.sendCustomQuoteRequestAlert(enquiry);
    
    const mockLeadId = `lead_mock_${Math.random().toString(36).substring(2, 9)}`;

    return {
      success: true,
      leadId: mockLeadId,
    };
  } catch (error) {
    console.error('Server Action Error: submitEnquiryAction', error);
    return {
      success: false,
      error: (error as Error).message || 'An error occurred during submission',
    };
  }
}
export async function getEnquiriesAction() {
  try {
    // return prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } })
    return [];
  } catch (error) {
    throw new Error('Could not fetch inquiries');
  }
}
