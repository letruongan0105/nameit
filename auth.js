document.addEventListener('DOMContentLoaded', () => {
    
    // Hàm chuyển đổi form (được gọi từ các nút bấm trong HTML)
    window.showForm = function(targetForm) {
        const signupForm = document.getElementById('signup-form');
        const loginForm = document.getElementById('login-form');

        // Gỡ bỏ tất cả các class active trước
        signupForm.classList.remove('active');
        loginForm.classList.remove('active');
        
        // Thêm class active cho form mục tiêu
        if (targetForm === 'login') {
            loginForm.classList.add('active');
        } else if (targetForm === 'register') {
            signupForm.classList.add('active');
        }
    };
    

    
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    const signupActive = signupForm.classList.contains('active');
    const loginActive = loginForm.classList.contains('active');

    if (!signupActive && !loginActive) {
        // Mặc định theo PHP nhưng fallback vẫn là đăng ký
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }

    // Gán sự kiện cho các liên kết chuyển đổi nếu tồn tại
    const showLoginLink = document.getElementById('show-login');
    const showSignupLink = document.getElementById('show-signup');

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.showForm ? window.showForm('login') : (loginForm.classList.add('active'), signupForm.classList.remove('active'));
        });
    }

    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.showForm ? window.showForm('register') : (signupForm.classList.add('active'), loginForm.classList.remove('active'));
        });
    }
});
