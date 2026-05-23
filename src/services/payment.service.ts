import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../lib/prisma';

interface RazorpayOrderOptions {
  amount: number; // in paise (e.g. INR 100 = 10000 paise)
  currency: string; // e.g. "INR"
  receipt: string; // unique order id reference
}

interface RazorpayOrderResponse {
  id: string; // Razorpay Order ID
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

interface SignatureVerificationParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export class PaymentService {
  private static getRazorpayInstance() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing');
    }

    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  /**
   * Generates a transaction order reference in Razorpay's processing cloud
   */
  static async createOrder(options: RazorpayOrderOptions): Promise<RazorpayOrderResponse> {
    try {
      const instance = this.getRazorpayInstance();
      const razorpayOrder = await instance.orders.create({
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
      });

      return {
        id: razorpayOrder.id,
        entity: razorpayOrder.entity,
        amount: Number(razorpayOrder.amount),
        amount_paid: Number(razorpayOrder.amount_paid),
        amount_due: Number(razorpayOrder.amount_due),
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt || options.receipt,
        status: razorpayOrder.status,
        attempts: razorpayOrder.attempts || 0,
        notes: (razorpayOrder.notes as Record<string, string>) || {},
        created_at: Number(razorpayOrder.created_at),
      };
    } catch (error) {
      throw new Error(`Razorpay Order creation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Secures webhook callbacks and page updates using SHA256 HMAC checksums
   */
  static verifyPaymentSignature(params: SignatureVerificationParams): boolean {
    try {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        throw new Error('Razorpay secret key is missing');
      }

      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
        .digest('hex');

      return generatedSignature === params.razorpaySignature;
    } catch {
      return false;
    }
  }

  /**
   * Verifies signatures for webhook requests
   */
  static verifyWebhookSignature(body: string, signature: string): boolean {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('Razorpay webhook secret is missing');
      }

      const generatedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      return generatedSignature === signature;
    } catch {
      return false;
    }
  }

  /**
   * Dynamic Cash on Delivery check from Database Config
   */
  static async checkCodEligibility(amount: number): Promise<{ eligible: boolean; maxLimit: number; reason?: string }> {
    try {
      // Fetch dynamic settings from database
      const settingsRecord = await prisma.homepageContent.findUnique({
        where: { key: 'payment_settings' },
      });

      let codEnabled = true;
      let maxCodAmount = 50000; // Default limit ₹50,000

      if (settingsRecord && settingsRecord.value) {
        const settings = settingsRecord.value as any;
        if (typeof settings.codEnabled === 'boolean') {
          codEnabled = settings.codEnabled;
        }
        if (typeof settings.maxCodAmount === 'number') {
          maxCodAmount = settings.maxCodAmount;
        }
      }

      if (!codEnabled) {
        return { eligible: false, maxLimit: maxCodAmount, reason: 'Cash on Delivery is currently disabled by admin.' };
      }

      if (amount > maxCodAmount) {
        return {
          eligible: false,
          maxLimit: maxCodAmount,
          reason: `Cash on Delivery is only available for orders up to ₹${maxCodAmount.toLocaleString('en-IN')}. Your order is ₹${amount.toLocaleString('en-IN')}.`,
        };
      }

      return { eligible: true, maxLimit: maxCodAmount };
    } catch (error) {
      // Fallback in case of DB error
      const maxCodAmount = 50000;
      if (amount > maxCodAmount) {
        return { eligible: false, maxLimit: maxCodAmount, reason: `Cash on Delivery is limited to ₹${maxCodAmount.toLocaleString('en-IN')}.` };
      }
      return { eligible: true, maxLimit: maxCodAmount };
    }
  }
}
