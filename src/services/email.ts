import { Order } from '@/types/order';
import { Enquiry } from '@/types/enquiry';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Mirrorwala Transactional Mail Alert Service (Resend/Nodemailer wrapper)
 * Skeleton signatures for sending automated luxury notices
 */
export class EmailService {
  /**
   * Low-level dispatcher to trigger email delivery through transactional providers
   */
  private static async send(payload: EmailPayload): Promise<boolean> {
    try {
      // SKELETON: Integration with Resend client
      // const resend = new Resend(process.env.RESEND_API_KEY)
      // await resend.emails.send({ from: process.env.SENDER_EMAIL, ... })
      
      console.log(`[EmailService] Mock dispatch: ${payload.subject} to ${payload.to}`);
      return true;
    } catch (error) {
      console.error(`Email dispatch error: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Dispatches premium styled order summaries upon successful payment checkout
   */
  static async sendOrderConfirmation(order: Order): Promise<boolean> {
    const to = order.shippingAddress.email;
    const subject = `Your Luxury Mirror Purchase is Confirmed - Order #${order.orderNumber}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; color: #0f172a;">Thank you for your order, ${order.shippingAddress.fullName}!</h2>
        <p>We are delighted to confirm your order of handcrafted mirrors at Mirrorwala.</p>
        <p><strong>Order Number:</strong> #${order.orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">This is a premium transaction document. Our manufacturing craftspeople will start production shortly.</p>
      </div>
    `;

    return this.send({ to, subject, html });
  }

  /**
   * Dispatches notifications to admin when high-value custom mirror enquiries are submitted
   */
  static async sendCustomQuoteRequestAlert(enquiry: Enquiry): Promise<boolean> {
    const to = process.env.SUPPORT_EMAIL ?? 'sales@mirrorwala.in';
    const subject = `NEW CUSTOM MIRROR ENQUIRY - Lead #${enquiry.id.slice(0, 8)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #0f172a;">New High-Value Custom Quote Lead</h2>
        <p><strong>Customer Name:</strong> ${enquiry.fullName}</p>
        <p><strong>Phone Number:</strong> ${enquiry.phone}</p>
        <p><strong>Email Address:</strong> ${enquiry.email}</p>
        <p><strong>Custom Specifications:</strong></p>
        <ul>
          <li><strong>Shape:</strong> ${enquiry.customMirrorLead?.config?.shape ?? 'N/A'}</li>
          <li><strong>Dimensions:</strong> ${enquiry.customMirrorLead?.config?.width ?? 'N/A'}mm x ${enquiry.customMirrorLead?.config?.height ?? 'N/A'}mm</li>
          <li><strong>LED Light Option:</strong> ${enquiry.customMirrorLead?.config?.ledColor ?? 'N/A'}</li>
          <li><strong>Edge Option:</strong> ${enquiry.customMirrorLead?.config?.edgeStyle ?? 'N/A'}</li>
        </ul>
        <p><strong>Additional Message:</strong> ${enquiry.message}</p>
      </div>
    `;

    return this.send({ to, subject, html });
  }

  /**
   * Dispatches verification email with the authentication link
   */
  static async sendVerificationEmail(to: string, url: string): Promise<boolean> {
    const subject = 'Verify Your Mirrorwala Account';
    const html = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; padding: 20px; background-color: #fafaf9; border: 1px solid #e7e5e4;">
        <h2 style="color: #78350f; font-weight: 400; text-align: center; margin-bottom: 20px;">Welcome to Mirrorwala</h2>
        <p style="font-size: 16px; line-height: 1.6;">Thank you for registering your account with Mirrorwala. To complete your registration and verify your email address, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #78350f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="font-size: 14px; color: #78716c;">If you did not create a Mirrorwala account, please ignore this email or contact support.</p>
        <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 25px 0;" />
        <p style="font-size: 12px; color: #a8a29e; text-align: center;">Mirrorwala Luxury Interiors &copy; 2026. All rights reserved.</p>
      </div>
    `;
    return this.send({ to, subject, html });
  }

  /**
   * Dispatches password reset link to user
   */
  static async sendPasswordResetEmail(to: string, url: string): Promise<boolean> {
    const subject = 'Reset Your Mirrorwala Password';
    const html = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; padding: 20px; background-color: #fafaf9; border: 1px solid #e7e5e4;">
        <h2 style="color: #78350f; font-weight: 400; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your password for your Mirrorwala account. Click the button below to choose a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #78350f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #78716c;">If you did not request a password reset, please ignore this email. This link will expire soon.</p>
        <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 25px 0;" />
        <p style="font-size: 12px; color: #a8a29e; text-align: center;">Mirrorwala Luxury Interiors &copy; 2026. All rights reserved.</p>
      </div>
    `;
    return this.send({ to, subject, html });
  }
}

