import { NextResponse } from 'next/server';
import { EnquiryService } from '@/services/enquiry.service';
import { RateLimiter } from '@/lib/security';
import { enquiryValidationSchema } from '@/validations/enquiry';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting protection
    const rateLimit = RateLimiter.limit(request);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many submission requests. Please wait a few seconds and try again.' },
        { 
          status: 429, 
          headers: RateLimiter.getHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset) 
        }
      );
    }

    const body = await request.json();
    
    // Parse and validate using Zod
    const parsedData = enquiryValidationSchema.parse(body);

    const enquiryService = new EnquiryService();
    const result = await enquiryService.submitEnquiry(parsedData);

    return NextResponse.json({
      success: true,
      message: parsedData.type === 'CUSTOM_QUOTE'
        ? 'Custom mirror quotation request submitted successfully'
        : 'Your enquiry has been submitted successfully. Our team will contact you shortly.',
      data: result,
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Inquiry submission failed',
    }, { status: 400 });
  }
}
