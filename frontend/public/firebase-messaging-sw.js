importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// Cấu hình Firebase (cùng thông tin với frontend)
firebase.initializeApp({
  apiKey: "AIzaSyDhWrwFf83i7_q_8n83bvUytOuXgTX_F-s",
  authDomain: "testfirebase-ver0.firebaseapp.com",
  projectId: 'testfirebase-ver0',
  storageBucket: 'testfirebase-ver0.appspot.com',
  messagingSenderId: '906315652109',
  appId: "1:906315652109:web:4b85315185cfd58baa8944",
  measurementId: 'G-SS9ZHK1R97',
});
// Khởi tạo Firebase Messaging
const messaging = firebase.messaging();

// Lắng nghe tin nhắn đến khi đang ở background
messaging.onBackgroundMessage(function(payload) {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Hiển thị thông báo
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: './OIP.png', 
  });
});