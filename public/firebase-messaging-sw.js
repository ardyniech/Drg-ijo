importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyMockKeyForPreviewModeOnly12345",
  projectId: "drg-app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Darurat SOS Dulur';
  const notificationOptions = {
    body: payload.notification?.body || 'Ada panggilan darurat baru.',
    icon: '/DRG_logo.jpg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
