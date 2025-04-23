// importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// // Cấu hình Firebase (cùng thông tin với frontend)
// firebase.initializeApp({
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// });
// // Khởi tạo Firebase Messaging
// const messaging = firebase.messaging();

// // Lắng nghe tin nhắn đến khi đang ở background
// messaging.onBackgroundMessage(function(payload) {
//   // console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
//   // Hiển thị thông báo
//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: './OIP.png', 
//   });
// });
