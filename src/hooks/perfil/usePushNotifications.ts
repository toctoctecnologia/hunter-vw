
import { useEffect, useState } from 'react';
import { debugLog } from '@/utils/debug';

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        debugLog('Service Worker registered successfully:', registration);
        
        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('your-vapid-public-key') // Replace with actual VAPID key
        });
        
        debugLog('Push subscription:', subscription);
        return true;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
    
    return false;
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      // Use vibration API separately if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      new Notification('Toc Toc CRM', {
        body: 'Notificações ativadas com sucesso!',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendTestNotification
  };
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
