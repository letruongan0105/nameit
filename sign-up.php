<?php

    session_start();

    // --- Lấy thông báo lỗi/thành công từ session ---
    $login_error = $_SESSION['login_error'] ?? '';
    $register_error = $_SESSION['register_error'] ?? '';
    $success_message = $_SESSION['success_message'] ?? '';
    // Mặc định hiển thị form đăng ký
    $activeForm = $_SESSION['active_form'] ?? 'register';

    // Chuyển về form Login nếu đăng ký thành công
    if (!empty($success_message)) {
        $activeForm = 'login';
    }

    // --- Xóa session sau khi lấy ra để không hiển thị lại khi refresh ---
    unset($_SESSION['login_error']);
    unset($_SESSION['register_error']);
    unset($_SESSION['success_message']);
    unset($_SESSION['active_form']);
    
    // --- Hàm trợ giúp ---
    function showError($error) {
        return !empty($error) ? "<p class='error-message'>$error</p>" : '';
    }

    function isActiveForm($formName, $activeForm) {
        return $formName === $activeForm ? 'active' : '';
    }

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up / Log In</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="auth-page">
    <div class="auth-container">
        <!-- Logo -->
        <img src="img/logo_nameit.png" alt="Name It Logo" class="auth-logo">
        
        <!-- Hiển thị thông báo chung -->
        <?php if (!empty($success_message)): ?>
            <p class='success-message'><?= $success_message ?></p>
        <?php endif; ?>

        <!-- Sign Up Form -->
        <div id="signup-form" class="<?= isActiveForm('register', $activeForm); ?>">
            <h1>We’re glad to meet you</h1>
            <p class="subtitle">First thing’s first, we need your email to sign you up!</p>
            
            <?= showError($register_error); ?>
            
            <form id="signupForm" action="dashboard.html" method="post">
                <div class="input-group">
                    <input type="text" id="signupFirstName" required placeholder=" " name="firstname">
                    <label for="signupFirstName">First Name</label>
                </div>
                <div class="input-group">
                    <input type="text" id="signupLastName" required placeholder=" " name="lastname">
                    <label for="signupLastName">Last Name</label>
                </div>
                <div class="input-group">
                    <input type="text" id="signupEmail" required placeholder=" " name="email">
                    <label for="signupEmail">Email</label>
                </div>
                <div class="input-group">
                    <input type="password" id="signupPassword" required placeholder=" " name="password">
                    <label for="signupPassword">Password</label>
                </div>
                <button type="submit" class="main-btn" name="signup">Sign up</button>
            </form>
            <div class="switch-form">
                Already have an account? <a href="#" id="show-login" onclick="showForm('login')">Log in</a>
            </div>
            <div class="form-message" id="signup-message"></div>
        </div>
        
        <!-- Log In Form -->
        <div id="login-form" class="<?= isActiveForm('login', $activeForm); ?>">
            <h1>Welcome back! 👋</h1>
            <p class="subtitle">Just fill in your details and you'll be taken to your account!</p>
            
            <?= showError($login_error); ?>
            
            <form id="loginForm" action="dashboard.html" method="post">
                <div class="input-group">
                    <input type="text" id="loginEmail" required placeholder=" " name="email">
                    <label for="loginEmail">Email</label>
                </div>
                <div class="input-group">
                    <input type="password" id="loginPassword" required placeholder=" " name="password">
                    <label for="loginPassword">Password</label>
                </div>
                <p class="forgot-password">
                    Forgot your <a href="#">password</a>?
                </p>
                <button type="submit" class="main-btn" name="login">Log In</button>
            </form>
            <div class="switch-form">
                Don't have an account? <a href="#" id="show-signup" onclick="showForm('register')">Create an account.</a>
            </div>
            <div class="form-message" id="login-message"></div>
        </div>
    </div>

    <script type="module" src="auth.js"></script> 
</body>
</html>
