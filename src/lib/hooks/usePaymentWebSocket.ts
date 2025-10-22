'use client';

import { useEcho } from '@laravel/echo-react';
import { useCallback, useState } from 'react';
import type { PaymentStatusUpdate } from '@/types/Payment';

/**
 * Hook to listen for real-time payment status updates via WebSocket
 *
 * @param transactionId - The transaction ID to monitor
 * @param onUpdate - Callback function called when payment status updates
 * @returns Object with payment status and control functions
 *
 * @example
 * function PaymentMonitor({ transactionId }) {
 *   const { status, stopListening } = usePaymentWebSocket(
 *     transactionId,
 *     (update) => {
 *       console.log('Payment updated:', update);
 *       if (update.status === 'completed') {
 *         // Handle successful payment
 *       }
 *     }
 *   );
 *
 *   return <div>Status: {status?.status}</div>;
 * }
 */
export function usePaymentWebSocket(
  transactionId: string | null,
  onUpdate?: (update: PaymentStatusUpdate) => void
) {
  const [latestUpdate, setLatestUpdate] = useState<PaymentStatusUpdate | null>(null);

  const handlePaymentUpdate = useCallback(
    (event: unknown) => {
      const eventData = event as { payment?: PaymentStatusUpdate } | PaymentStatusUpdate;
      const update: PaymentStatusUpdate = (eventData && typeof eventData === 'object' && 'payment' in eventData && eventData.payment)
        ? eventData.payment
        : eventData as PaymentStatusUpdate;
      setLatestUpdate(update);

      if (onUpdate) {
        onUpdate(update);
      }
    },
    [onUpdate]
  );

  const { leaveChannel, stopListening, listen } = useEcho(
    transactionId ? `crypto.payment.${transactionId}` : '',
    [
      'payment.status.updated',
      'payment.completed',
      'payment.failed',
      'payment.expired',
      'payment.cancelled',
    ],
    handlePaymentUpdate
  );

  return {
    status: latestUpdate,
    leaveChannel,
    stopListening,
    listen,
  };
}

/**
 * Hook to listen for user-specific payment notifications
 * Useful for showing notifications across the app when any payment completes
 *
 * @param userId - The user ID to monitor
 * @param onPaymentUpdate - Callback when any payment updates for this user
 * @returns Control functions for the WebSocket connection
 *
 * @example
 * function PaymentNotifications() {
 *   const { user } = useAuth();
 *
 *   useUserPaymentNotifications(user?.id, (update) => {
 *     toast.success(`Payment ${update.status}: ${update.transactionId}`);
 *   });
 *
 *   return null;
 * }
 */
export function useUserPaymentNotifications(
  userId: string | number | null,
  onPaymentUpdate?: (update: PaymentStatusUpdate) => void
) {
  const handleUpdate = useCallback(
    (event: unknown) => {
      const eventData = event as { payment?: PaymentStatusUpdate } | PaymentStatusUpdate;
      const update: PaymentStatusUpdate = (eventData && typeof eventData === 'object' && 'payment' in eventData && eventData.payment)
        ? eventData.payment
        : eventData as PaymentStatusUpdate;

      if (onPaymentUpdate) {
        onPaymentUpdate(update);
      }
    },
    [onPaymentUpdate]
  );

  const { leaveChannel, stopListening, listen } = useEcho(
    userId ? `user.${userId}.payments` : '',
    [
      'payment.status.updated',
      'payment.completed',
      'payment.failed',
    ],
    handleUpdate
  );

  return {
    leaveChannel,
    stopListening,
    listen,
  };
}
