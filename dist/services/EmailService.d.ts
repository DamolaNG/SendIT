/**
 * Email Service
 *
 * This service handles email notifications:
 * - Order status updates
 * - Location updates
 * - Order confirmations
 * - Password resets (future feature)
 *
 * In production, you would integrate with email services like:
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Nodemailer with SMTP
 */
import { DeliveryOrder, OrderStatus } from '../types';
export declare class EmailService {
    private transporter;
    constructor();
    /**
     * Send order status update notification
     * @param order - Delivery order
     * @param userEmail - User's email address
     * @param oldStatus - Previous status
     */
    sendStatusUpdateNotification(order: DeliveryOrder, userEmail: string, oldStatus: OrderStatus): Promise<void>;
    /**
     * Send location update notification
     * @param order - Delivery order
     * @param userEmail - User's email address
     */
    sendLocationUpdateNotification(order: DeliveryOrder, userEmail: string): Promise<void>;
    /**
     * Send order confirmation email
     * @param order - Delivery order
     * @param userEmail - User's email address
     */
    sendOrderConfirmation(order: DeliveryOrder, userEmail: string): Promise<void>;
    /**
     * Send order cancellation email
     * @param order - Delivery order
     * @param userEmail - User's email address
     */
    sendOrderCancellation(order: DeliveryOrder, userEmail: string): Promise<void>;
    /**
     * Send generic email
     * @param notification - Email notification data
     */
    private sendEmail;
    /**
     * Generate status update email HTML
     * @param order - Delivery order
     * @param oldStatus - Previous status
     * @returns string - HTML email content
     */
    private generateStatusUpdateEmail;
    /**
     * Generate location update email HTML
     * @param order - Delivery order
     * @returns string - HTML email content
     */
    private generateLocationUpdateEmail;
    /**
     * Generate order confirmation email HTML
     * @param order - Delivery order
     * @returns string - HTML email content
     */
    private generateOrderConfirmationEmail;
    /**
     * Generate order cancellation email HTML
     * @param order - Delivery order
     * @returns string - HTML email content
     */
    private generateOrderCancellationEmail;
}
//# sourceMappingURL=EmailService.d.ts.map