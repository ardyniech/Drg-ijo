importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Read Firebase config from registration search parameters or default runtime scope
const swParams = new URLSearchParams(self.location.search);
const apiKey = swParams.get("apiKey");
const projectId = swParams.get("projectId");
const messagingSenderId = swParams.get("messagingSenderId");
const appId = swParams.get("appId");

if (apiKey && projectId) {
  firebase.initializeApp({
    apiKey,
    projectId,
    messagingSenderId: messagingSenderId || undefined,
    appId: appId || undefined,
  });

  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || "Darurat SOS Dulur";
    const notificationOptions = {
      body: payload.notification?.body || "Ada panggilan darurat baru.",
      icon: "/DRG_logo.jpg",
      badge: "/DRG_logo.jpg",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
