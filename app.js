// Firebase إعداد
const firebaseConfig = {
  apiKey: "AIzaSyBXXCR2jN8SOP_AamRaE0vkEliR_cnpLqY",
  authDomain: "backy-123.firebaseapp.com",
  projectId: "backy-123",
  storageBucket: "backy-123.appspot.com",
  messagingSenderId: "763792380953",
  appId: "1:763792380953:web:74e509e70ca36b94f80688",
  measurementId: "G-YP8852THBW"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// إظهار ملفي الشخصي
function showUserProfile() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    db.collection('users').doc(currentUser.uid).get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        document.getElementById('modal-user-pic').src = userData.profilePic || 'default-profile.png';
        document.getElementById('modal-username').innerText = `@${userData.username}`;
        document.getElementById('friends-count').innerText = `عدد الأصدقاء: ${userData.friends.length || 0}`;
        document.getElementById('posts-count').innerText = `عدد المنشورات: ${userData.posts.length || 0}`;
        document.getElementById('user-profile-modal').style.display = 'block';
      }
    });
  }
}

// إغلاق نافذة الملف الشخصي
function closeUserProfile() {
  document.getElementById('user-profile-modal').style.display = 'none';
}

// عرض ملف الشخص الذي نشر المنشور
function viewProfile(userId) {
  db.collection('users').doc(userId).get().then((doc) => {
    if (doc.exists) {
      const userData = doc.data();
      document.getElementById('modal-profile-pic').src = userData.profilePic || 'default-profile.png';
      document.getElementById('profile-username').innerText = `@${userData.username}`;
      document.getElementById('profile-friends-count').innerText = `عدد الأصدقاء: ${userData.friends.length || 0}`;
      document.getElementById('profile-posts-count').innerText = `عدد المنشورات: ${userData.posts.length || 0}`;
      document.getElementById('profile-modal').style.display = 'block';
    }
  });
}

// إغلاق نافذة عرض المستخدم
function closeProfile() {
  document.getElementById('profile-modal').style.display = 'none';
}

// إرسال طلب صداقة
function sendFriendRequest() {
  const currentUser = auth.currentUser;
  const recipientUserId = document.getElementById('profile-username').dataset.userId;
  
  if (currentUser && recipientUserId) {
    db.collection('friendRequests').add({
      from: currentUser.uid,
      to: recipientUserId,
      status: 'pending',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      document.querySelector('.friend-request-btn').innerText = 'تم الطلب';
      alert('تم إرسال طلب الصداقة');
    });
  }
}

// تسجيل المستخدم
auth.onAuthStateChanged((user) => {
  if (user) {
    // عرض صورة الملف الشخصي
    db.collection('users').doc(user.uid).get().then((doc) => {
      if (doc.exists) {
        document.getElementById('user-profile-pic').src = doc.data().profilePic || 'default-profile.png';
      }
    });
  }
});
