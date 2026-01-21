/**
 * Notification Service
 * Handles push notifications, SMS, and in-app alerts
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface NotificationRequest {
  userId: string;
  type: 'TRAINING_ASSIGNED' | 'MODULE_COMPLETED' | 'CLUSTER_ALERT' | 'GENERAL';
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: ('PUSH' | 'SMS' | 'IN_APP')[];
}

class NotificationService {
  /**
   * Send notification to user
   */
  async sendNotification(request: NotificationRequest): Promise<void> {
    const channels = request.channels || ['IN_APP', 'PUSH'];

    try {
      // Create in-app notification
      if (channels.includes('IN_APP')) {
        await prisma.userNotification.create({
          data: {
            userId: request.userId,
            type: request.type,
            title: request.title,
            message: request.message,
            data: JSON.stringify(request.data || {}),
            channel: 'IN_APP',
            isRead: false,
          },
        });
      }

      // Send push notification
      if (channels.includes('PUSH')) {
        await this.sendPushNotification(request);
      }

      // Send SMS
      if (channels.includes('SMS')) {
        await this.sendSMS(request);
      }

      logger.info('Notification sent', { userId: request.userId, type: request.type });
    } catch (error) {
      logger.error('Failed to send notification', error);
      throw error;
    }
  }

  /**
   * Send push notification (abstracted, mockable)
   */
  private async sendPushNotification(request: NotificationRequest): Promise<void> {
    // TODO: Integrate with FCM/APNS or similar service
    logger.info('Push notification sent (mock)', {
      userId: request.userId,
      title: request.title,
    });
  }

  /**
   * Send SMS (abstracted, mockable)
   */
  private async sendSMS(request: NotificationRequest): Promise<void> {
    // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
    logger.info('SMS sent (mock)', {
      userId: request.userId,
      message: request.message,
    });
  }

  /**
   * Batch send notifications
   */
  async sendBatchNotifications(requests: NotificationRequest[]): Promise<void> {
    await Promise.all(requests.map(req => this.sendNotification(req)));
  }
}

export const notificationService = new NotificationService();
