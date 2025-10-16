"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        // Configure email transporter
        // In production, use real SMTP settings
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || 'your-email@gmail.com',
                pass: process.env.SMTP_PASS || 'your-app-password'
            }
        });
    }
    /**
     * Send order status update notification
     * @param order - Delivery order
     * @param userEmail - User's email address
     * @param oldStatus - Previous status
     */
    async sendStatusUpdateNotification(order, userEmail, oldStatus) {
        try {
            const subject = `Order ${order.trackingNumber} Status Update`;
            const body = this.generateStatusUpdateEmail(order, oldStatus);
            await this.sendEmail({
                to: userEmail,
                subject,
                body,
                orderId: order.id
            });
            console.log(`Status update email sent to ${userEmail} for order ${order.trackingNumber}`);
        }
        catch (error) {
            console.error('Failed to send status update email:', error);
            throw new Error('Failed to send status update notification');
        }
    }
    /**
     * Send location update notification
     * @param order - Delivery order
     * @param userEmail - User's email address
     */
    async sendLocationUpdateNotification(order, userEmail) {
        try {
            const subject = `Order ${order.trackingNumber} Location Update`;
            const body = this.generateLocationUpdateEmail(order);
            await this.sendEmail({
                to: userEmail,
                subject,
                body,
                orderId: order.id
            });
            console.log(`Location update email sent to ${userEmail} for order ${order.trackingNumber}`);
        }
        catch (error) {
            console.error('Failed to send location update email:', error);
            throw new Error('Failed to send location update notification');
        }
    }
    /**
     * Send order confirmation email
     * @param order - Delivery order
     * @param userEmail - User's email address
     */
    async sendOrderConfirmation(order, userEmail) {
        try {
            const subject = `Order Confirmation - ${order.trackingNumber}`;
            const body = this.generateOrderConfirmationEmail(order);
            await this.sendEmail({
                to: userEmail,
                subject,
                body,
                orderId: order.id
            });
            console.log(`Order confirmation email sent to ${userEmail} for order ${order.trackingNumber}`);
        }
        catch (error) {
            console.error('Failed to send order confirmation email:', error);
            throw new Error('Failed to send order confirmation');
        }
    }
    /**
     * Send order cancellation email
     * @param order - Delivery order
     * @param userEmail - User's email address
     */
    async sendOrderCancellation(order, userEmail) {
        try {
            const subject = `Order Cancelled - ${order.trackingNumber}`;
            const body = this.generateOrderCancellationEmail(order);
            await this.sendEmail({
                to: userEmail,
                subject,
                body,
                orderId: order.id
            });
            console.log(`Order cancellation email sent to ${userEmail} for order ${order.trackingNumber}`);
        }
        catch (error) {
            console.error('Failed to send order cancellation email:', error);
            throw new Error('Failed to send order cancellation notification');
        }
    }
    /**
     * Send generic email
     * @param notification - Email notification data
     */
    async sendEmail(notification) {
        try {
            const mailOptions = {
                from: `"SendIT" <${process.env.SMTP_USER || 'noreply@sendit.com'}>`,
                to: notification.to,
                subject: notification.subject,
                html: notification.body
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
    /**
     * Generate status update email HTML
     * @param order - Delivery order
     * @param oldStatus - Previous status
     * @returns string - HTML email content
     */
    generateStatusUpdateEmail(order, oldStatus) {
        const statusText = order.status.replace('_', ' ').toUpperCase();
        const oldStatusText = oldStatus.replace('_', ' ').toUpperCase();
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .status { background: #10b981; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; }
          .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 SendIT Order Update</h1>
          </div>
          <div class="content">
            <h2>Your order status has been updated!</h2>
            <div class="status">${statusText}</div>
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p><strong>Previous Status:</strong> ${oldStatusText}</p>
              <p><strong>Current Status:</strong> ${statusText}</p>
              <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
              ${order.currentLocation ? `<p><strong>Current Location:</strong> ${order.currentLocation.address}</p>` : ''}
            </div>
            <p>You can track your order at any time using the tracking number above.</p>
          </div>
          <div class="footer">
            <p>Thank you for using SendIT!</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    /**
     * Generate location update email HTML
     * @param order - Delivery order
     * @returns string - HTML email content
     */
    generateLocationUpdateEmail(order) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Location Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .location { background: #e0e7ff; color: #3730a3; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📍 SendIT Location Update</h1>
          </div>
          <div class="content">
            <h2>Your package location has been updated!</h2>
            <div class="location">
              <h3>📍 Current Location</h3>
              <p><strong>Address:</strong> ${order.currentLocation?.address}</p>
              <p><strong>Status:</strong> ${order.status.replace('_', ' ').toUpperCase()}</p>
            </div>
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
            </div>
            <p>Your package is on its way! You can track its progress using the tracking number above.</p>
          </div>
          <div class="footer">
            <p>Thank you for using SendIT!</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    /**
     * Generate order confirmation email HTML
     * @param order - Delivery order
     * @returns string - HTML email content
     */
    generateOrderConfirmationEmail(order) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .confirmation { background: #d1fae5; color: #065f46; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
          </div>
          <div class="content">
            <div class="confirmation">
              <h2>Your order has been successfully created!</h2>
              <p>We've received your delivery request and will process it shortly.</p>
            </div>
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p><strong>Status:</strong> ${order.status.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Price:</strong> $${order.price.toFixed(2)}</p>
              <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
              <p><strong>Distance:</strong> ${order.distance ? order.distance.toFixed(1) + ' km' : 'N/A'}</p>
            </div>
            <p>You can track your order at any time using the tracking number above.</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SendIT!</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    /**
     * Generate order cancellation email HTML
     * @param order - Delivery order
     * @returns string - HTML email content
     */
    generateOrderCancellationEmail(order) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .cancellation { background: #fee2e2; color: #991b1b; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Order Cancelled</h1>
          </div>
          <div class="content">
            <div class="cancellation">
              <h2>Your order has been cancelled</h2>
              <p>We've processed your cancellation request.</p>
            </div>
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p><strong>Status:</strong> CANCELLED</p>
              <p><strong>Price:</strong> $${order.price.toFixed(2)}</p>
              <p><strong>Cancelled On:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>If you have any questions about this cancellation, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>Thank you for using SendIT!</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map