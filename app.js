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

// تسجيل الدخول
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('login-modal').style.display = 'none';
            loadUserData();
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
                loadUserData();
            });
        })
        .catch((error) => {
            console.error('Error signing up: ', error.message);
        });
}

// عرض ملف المستخدم
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

// تحميل بيانات المستخدم
function loadUserData() {
    const currentUser = auth.currentUser;
    if (currentUser) {
        db.collection('users').doc(currentUser.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('username-display').innerText = `@${userData.username}`;
                document.getElementById('user-profile-pic').src = userData.profilePic || 'default-profile.png';
            }
        });
    }
}

// تسجيل الخروج
function logout() {
    auth.signOut().then(() => {
        console.log("تم تسجيل الخروج");
        document.getElementById('username-display').innerText = '';
        document.getElementById('user-profile-pic').src = 'default-profile.png';
    }).catch((error) => {
        console.error("خطأ في تسجيل الخروج: ", error);
    });
}

// إظهار/إغلاق نموذج تسجيل الدخول
function showLogin() {
    document.getElementById('login-modal').style.display = 'block';
}

// إغلاق نافذة تسجيل الدخول
function closeLogin() {
    document.getElementById('login-modal').style.display = 'none';
}

// إظهار/إغلاق نموذج التسجيل
function closeSignUp() {
    document.getElementById('signup-modal').style.display = 'none';
}

// إضافة منشور
function addPost() {
    const currentUser = auth.currentUser;
    const postContent = document.getElementById('post-input').value;

    if (currentUser && postContent) {
        const postId = db.collection('posts').doc().id;
        db.collection('posts').doc(postId).set({
            userId: currentUser.uid,
            content: postContent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            document.getElementById('post-input').value = '';
            loadPosts();
        });
    }
}

// تحميل المنشورات
function loadPosts() {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const postData = doc.data();
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            // إضافة محتوى المنشور
            postElement.innerHTML = `
                <p>${postData.content}</p>
                <button onclick="viewUserProfile('${postData.userId}')">عرض الملف الشخصي</button>
            `;

            postsContainer.appendChild(postElement);
        });
    });
}

// عرض ملف المستخدم من المنشور
function viewUserProfile(userId) {
    db.collection('users').doc(userId).get().then((doc) => {
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

// معالجة إشعارات طلب الصداقة
function sendFriendRequest(toUserId) {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const notificationMessage = `تم إرسال طلب صداقة من قِبل @${currentUser.displayName}`;
        // حفظ الإشعار في قاعدة البيانات (يمكنك استخدام مجموعة جديدة للإشعارات)
        db.collection('notifications').add({
            fromUserId: currentUser.uid,
            toUserId: toUserId,
            message: notificationMessage,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

// تحميل البيانات عند التحميل الأول للصفحة
window.onload = function() {
    loadPosts();
    loadUserData();
};
