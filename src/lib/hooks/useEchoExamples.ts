'use client';

/**
 * Examples of using Laravel Echo React hooks
 *
 * This file contains example usage patterns for the @laravel/echo-react package.
 * Import these hooks in your components to listen to various channel types.
 */

import { useEcho, useEchoPublic, useEchoPresence } from "@laravel/echo-react";

// ============================================================================
// EXAMPLE 1: Listen to a private channel with useEcho
// ============================================================================
/**
 * Use this hook to listen to events on a private channel.
 * Private channels require authentication.
 *
 * @example
 * // In your component:
 * import { useNotifications } from '@/lib/hooks/useEchoExamples';
 *
 * function MyComponent() {
 *   useNotifications(userId);
 *   return <div>Component content</div>;
 * }
 */
export function useNotifications(userId: number | string) {
  const { leaveChannel, leave, stopListening, listen } = useEcho(
    `user.${userId}`,
    "NotificationSent",
    (e: any) => {
      console.log("New notification:", e.notification);
      // Handle notification (e.g., show toast, update state, etc.)
    },
  );

  return { leaveChannel, leave, stopListening, listen };
}

// ============================================================================
// EXAMPLE 2: Listen to multiple events on the same channel
// ============================================================================
/**
 * Listen to multiple events on a private order channel
 *
 * @example
 * import { useOrderUpdates } from '@/lib/hooks/useEchoExamples';
 *
 * function OrderTracking({ orderId }) {
 *   useOrderUpdates(orderId);
 *   return <div>Order tracking info</div>;
 * }
 */
export function useOrderUpdates(orderId: number | string) {
  useEcho(
    `orders.${orderId}`,
    ["OrderShipmentStatusUpdated", "OrderShipped", "OrderDelivered"],
    (e: any) => {
      console.log("Order update:", e);
      // Handle different order events
    },
  );
}

// ============================================================================
// EXAMPLE 3: Listen to a public channel with useEchoPublic
// ============================================================================
/**
 * Listen to public channel for new posts
 * Public channels don't require authentication
 *
 * @example
 * import { usePublicPosts } from '@/lib/hooks/useEchoExamples';
 *
 * function PostsFeed() {
 *   usePublicPosts();
 *   return <div>Posts feed</div>;
 * }
 */
export function usePublicPosts() {
  useEchoPublic("posts", "PostPublished", (e: any) => {
    console.log("New post published:", e.post);
    // Update UI with new post
  });
}

// ============================================================================
// EXAMPLE 4: Listen to a presence channel with useEchoPresence
// ============================================================================
/**
 * Listen to presence channel to track online users in a chat room
 * Presence channels track who is subscribed to the channel
 *
 * @example
 * import { useChatRoomPresence } from '@/lib/hooks/useEchoExamples';
 *
 * function ChatRoom({ roomId }) {
 *   const { users, whisper } = useChatRoomPresence(roomId);
 *   return (
 *     <div>
 *       <h3>Online Users: {users.length}</h3>
 *       <UserList users={users} />
 *     </div>
 *   );
 * }
 */
export function useChatRoomPresence(roomId: number | string) {
  const channel = useEchoPresence(
    `chat.${roomId}`,
    {
      // Called when a user joins the channel
      here: (users: any[]) => {
        console.log("Users currently in room:", users);
      },
      // Called when a new user joins
      joining: (user: any) => {
        console.log("User joining:", user);
      },
      // Called when a user leaves
      leaving: (user: any) => {
        console.log("User leaving:", user);
      },
    } as any
  );

  return {
    users: (channel as any)?.subscription?.members || [],
    whisper: (eventName: string, data: any) => (channel as any)?.whisper(eventName, data),
  };
}

// ============================================================================
// EXAMPLE 5: TypeScript usage with typed event data
// ============================================================================
/**
 * Example showing TypeScript usage with typed event data
 *
 * @example
 * // If using TypeScript:
 * type OrderData = {
 *   order: {
 *     id: number;
 *     user: { id: number; name: string };
 *     created_at: string;
 *   };
 * };
 *
 * useEcho<OrderData>(`orders.${orderId}`, "OrderShipmentStatusUpdated", (e) => {
 *   console.log(e.order.id);  // TypeScript knows about order.id
 *   console.log(e.order.user.name);  // TypeScript knows about user.name
 * });
 */

// ============================================================================
// EXAMPLE 6: Conditional listening with controls
// ============================================================================
/**
 * Example showing how to control listening dynamically
 *
 * @example
 * function NotificationToggle() {
 *   const [enabled, setEnabled] = useState(true);
 *   const { stopListening, listen } = useNotifications(userId);
 *
 *   const toggle = () => {
 *     if (enabled) {
 *       stopListening();
 *     } else {
 *       listen();
 *     }
 *     setEnabled(!enabled);
 *   };
 *
 *   return <button onClick={toggle}>
 *     {enabled ? 'Disable' : 'Enable'} Notifications
 *   </button>;
 * }
 */
