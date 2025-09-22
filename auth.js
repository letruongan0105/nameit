import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Biến toàn cục được cung cấp bởi môi trường Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Khởi tạo Firebase (an toàn để không chặn logic UI nếu config thiếu)
let app;
let db;
let auth;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (error) {
    console.error("Không thể khởi tạo Firebase (tiếp tục với logic UI):", error);
}

// Hàm xác thực người dùng
const authenticateUser = async () => {
    try {
        if (!auth) return; // Không có auth thì bỏ qua, vẫn cho phép UI hoạt động
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        console.log("Xác thực người dùng thành công.");
    } catch (error) {
        console.error("Xác thực thất bại:", error);
    }
};

// Lấy các phần tử DOM
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const signupSection = document.getElementById('signup-form');
const loginSection = document.getElementById('login-form');
const showLoginLink = document.getElementById('show-login');
const showSignupLink = document.getElementById('show-signup');
const signupMessage = document.getElementById('signup-message');
const loginMessage = document.getElementById('login-message');

// Hàm hiển thị thông báo
const showMessage = (element, message, isError) => {
    element.innerText = message;
    element.style.color = isError ? '#d32f2f' : 'green';
    element.style.display = 'block';
};

// Xử lý chuyển đổi form
if (showLoginLink && showSignupLink && signupSection && loginSection) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
        signupMessage.style.display = 'none';
    });
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupSection.style.display = 'block';
        loginSection.style.display = 'none';
        loginMessage.style.display = 'none';
    });
}

// Xử lý gửi form đăng ký
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signupForm.signupEmail.value;
        const firstName = signupForm.signupFirstName.value;
        const lastName = signupForm.signupLastName.value;
        const username = signupForm.signupUsername.value;
        const password = signupForm.signupPassword.value;
        const linkedin = signupForm.signupLinkedin.value;

        showMessage(signupMessage, 'Đang đăng ký...', false);
        await authenticateUser();
        
        if (!db) {
            showMessage(signupMessage, 'Không thể kết nối dịch vụ. Vui lòng thử lại sau.', true);
            return;
        }
        try {
            const usersRef = collection(db, `artifacts/${appId}/public/data/users`);

            // Kiểm tra xem tên người dùng đã tồn tại chưa
            const q = query(usersRef, where('username', '==', username));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                showMessage(signupMessage, 'Tên người dùng đã tồn tại.', true);
                return;
            }

            // Lưu dữ liệu người dùng vào Firestore
            const userDocRef = doc(db, usersRef, username);
            await setDoc(userDocRef, {
                email: email,
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: password,
                linkedin: linkedin || null,
            });

            // Lưu vào backend shim (localStorage) để ghi log nền
            try { if (window.backend) { backend.registerUser({ email, firstName, lastName, username, password, linkedin }); } } catch {}

            showMessage(signupMessage, 'Đăng ký thành công! Vui lòng đăng nhập.', false);
            try { if (window.backend) { backend.logEvent('signup', { username, email }); } } catch {}
            setTimeout(() => {
                if (signupSection && loginSection) {
                    signupSection.style.display = 'none';
                    loginSection.style.display = 'block';
                }
            }, 2000);
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            showMessage(signupMessage, 'Đăng ký thất bại. Vui lòng thử lại.', true);
        }
    });
}

// Xử lý gửi form đăng nhập
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginForm.loginUsername.value;
        const password = loginForm.loginPassword.value;
        
        showMessage(loginMessage, 'Đang đăng nhập...', false);
        await authenticateUser();
        
        if (!db) {
            showMessage(loginMessage, 'Không thể kết nối dịch vụ. Vui lòng thử lại sau.', true);
            return;
        }
        try {
            const userDocRef = doc(db, `artifacts/${appId}/public/data/users`, username);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData.password === password) {
                    // Đăng nhập thành công
                    showMessage(loginMessage, 'Đăng nhập thành công!', false);
                    
                    // Lưu dữ liệu người dùng vào localStorage cho trang dashboard
                    localStorage.setItem('userFirstName', userData.firstName);
                    localStorage.setItem('userLastName', userData.lastName);
                    localStorage.setItem('userUsername', userData.username);
                    try { if (window.backend) { backend.logEvent('login', { username }); } } catch {}

                    // Chuyển hướng đến dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showMessage(loginMessage, 'Mật khẩu không đúng. Vui lòng thử lại.', true);
                }
            } else {
                showMessage(loginMessage, 'Không tìm thấy tên người dùng.', true);
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            showMessage(loginMessage, 'Đăng nhập thất bại. Vui lòng thử lại.', true);
        }
    });
}
