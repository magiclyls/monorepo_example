import { useCallback } from 'react';

export function useNotification() {
  const notify = useCallback((title, options) => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  }, []);

  return notify;
}
