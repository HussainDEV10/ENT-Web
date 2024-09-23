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
  const recipientUsername = document.getElementById('profile-username').innerText;

  if (currentUser && recipientUsername) {
    db.collection('friendRequests').add({
      from: currentUser.uid,
      to: recipientUsername,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      // تحديث زر طلب الصداقة
      document.querySelector('.friend-request-btn').innerText = 'تم إرسال الطلب';
      document.querySelector('.friend-request-btn').disabled = true;

      // إرسال إشعار إلى المستخدم المستلم
      db.collection('notifications').add({
        userId: recipientUsername,
        message: `تم إرسال طلب صداقة من @${currentUser.displayName}`,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }).catch((error) => {
      console.error('Error sending friend request: ', error);
    });
  }
}

// تسجيل الدخول
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('login-modal').style.display = 'none';
    })
    .catch((error) => {
      console.error('Error logging in: ', error.message);
    });
}

// عرض نموذج التسجيل
function showSignUp() {
  document.getElementById('login-modal').style.display = 'none';
  document.getElementById('signup-modal').style.display = 'block';
}

// إنشاء حساب جديد
function signUp() {
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      db.collection('users').doc(user.uid).set({
        username: username,
        email: email,
        profilePic: 'default-profile.png',
        friends: [],
        posts: []
      }).then(() => {
        document.getElementById('signup-modal').style.display = 'none';
      });
    })
    .catch((error) => {
      console.error('Error signing up: ', error.message);
    });
}

// تحميل الصورة الشخصية
function uploadProfilePicture(file) {
  const currentUser = auth.currentUser;
  if (currentUser && file) {
    const storageRef = firebase.storage().ref();
    const profilePicRef = storageRef.child(`profilePictures/${currentUser.uid}.jpg`);
    profilePicRef.put(file).then(() => {
      profilePicRef.getDownloadURL().then((url) => {
        db.collection('users').doc(currentUser.uid).update({
          profilePic: url
        }).then(() => {
          document.getElementById('user-profile-pic').src = url;
        });
      });
    });
  }
}

// تحميل قائمة الأصدقاء وعدد المنشورات
function loadUserData() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    db.collection('users').doc(currentUser.uid).get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        document.getElementById('friends-count').innerText = `عدد الأصدقاء: ${userData.friends.length || 0}`;
        document.getElementById('posts-count').innerText = `عدد المنشورات: ${userData.posts.length || 0}`;
      }
    });
  }
}

// تسجيل الخروج
function logout() {
  auth.signOut().then(() => {
    console.log("تم تسجيل الخروج");
  }).catch((error) => {
    console.error("خطأ في تسجيل الخروج: ", error);
  });
}
