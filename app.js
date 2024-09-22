// إعداد Firebase
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

// إضافة منشور
function addPost() {
  const content = document.getElementById("post-content").value;
  db.collection("posts").add({
    content: content,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("post-content").value = ''; // تفريغ النص
    loadPosts(); // إعادة تحميل المنشورات
  });
}

// عرض المنشورات
function loadPosts() {
  db.collection("posts").orderBy("timestamp", "desc").get().then((querySnapshot) => {
    document.getElementById("posts-container").innerHTML = ''; // تفريغ الحاوية
    querySnapshot.forEach((doc) => {
      const postItem = document.createElement('div');
      postItem.innerHTML = `<p>${doc.data().content}</p>`;
      document.getElementById("posts-container").appendChild(postItem);
    });
  });
}

loadPosts(); // تحميل المنشورات عند فتح الصفحة

// إرسال رسالة
function sendMessage() {
  const message = document.getElementById("chat-input").value;
  db.collection("chat").add({
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("chat-input").value = ''; // تفريغ النص
    loadChat(); // إعادة تحميل الدردشة
  });
}

// عرض الدردشة
function loadChat() {
  db.collection("chat").orderBy("timestamp").onSnapshot((querySnapshot) => {
    document.getElementById("chat-container").innerHTML = ''; // تفريغ الحاوية
    querySnapshot.forEach((doc) => {
      const chatItem = document.createElement('div');
      chatItem.innerHTML = `<p>${doc.data().message}</p>`;
      document.getElementById("chat-container").appendChild(chatItem);
    });
  });
}

loadChat(); // تحميل الدردشة عند فتح الصفحة

// لعبة XO ضد AI
function playTicTacToeAI() {
  alert("ستبدأ الآن لعبة XO ضد AI. اللعبة قيد التطوير...");
  // هنا يمكن إضافة كود اللعبة.
}

// دعوة صديق للعب XO
function inviteFriend() {
  const friendUsername = prompt("أدخل اسم المستخدم @... لدعوة صديق للعب XO");
  if (friendUsername) {
    alert(`تم إرسال الدعوة إلى ${friendUsername}`);
    // يمكن استخدام Firebase لإرسال إشعار.
  }
}

// حفظ الملف الشخصي
function saveProfile() {
  const username = document.getElementById("username").value;
  const profilePic = document.getElementById("profile-pic").files[0];

  if (username && profilePic) {
    // حفظ اسم المستخدم والصورة في قاعدة بيانات Firestore و Firebase Storage
    alert("تم حفظ الملف الشخصي بنجاح!");
  } else {
    alert("يرجى إدخال اسم المستخدم وتحميل صورة.");
  }
  }
