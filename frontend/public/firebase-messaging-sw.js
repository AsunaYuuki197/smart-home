importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// Cấu hình Firebase (cùng thông tin với frontend)
firebase.initializeApp({
  apiKey: 'your_api_key',
  authDomain: 'your_project_id.firebaseapp.com',
  projectId: 'your_project_id',
  storageBucket: 'your_project_id.appspot.com',
  messagingSenderId: 'your_sender_id',
  appId: 'your_app_id',
  measurementId: 'your_measurement_id',
});

// Khởi tạo Firebase Messaging
const messaging = firebase.messaging();

// Lắng nghe tin nhắn đến khi đang ở background
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Hiển thị thông báo
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: './OIP.png', 
  });
});
