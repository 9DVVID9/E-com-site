var API_BASE_URL = 'http://localhost:3000';

var loginTab = document.getElementById("loginTab");
var registerTab = document.getElementById("registerTab");
var loginForm = document.getElementById("loginForm");
var registerForm = document.getElementById("registerForm");
var switchToRegister = document.getElementById("switchToRegister");
var switchToLogin = document.getElementById("switchToLogin");

// tab switching functionality
loginTab.addEventListener("click", () => showLoginForm());
registerTab.addEventListener("click", () => showRegisterForm());

switchToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  showRegisterForm();
});

switchToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  showLoginForm();
});

function showLoginForm() {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
}

function showRegisterForm() {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
}

// new real login logic no mockup
document.getElementById('loginFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showMessage('loginError', 'Please enter username and password');
        return;
    }

    //  changed URL from '/api/users' to '/api/users/login'
    fetch(API_BASE_URL + '/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => {
        if (!response.ok) throw new Error('Invalid credentials');
        return response.json();
    })
    .then(user => {
        // save user data to LocalStorage so other pages know we are logged in
        console.log("LOGIN DEBUG: What did the backend send?", user);
        localStorage.setItem('user', JSON.stringify(user));
        showMessage('loginSuccess', 'Login successful! Redirecting...');
        
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'catalog.html';
            }
        }, 1500);
    })
    .catch(error => {
        console.error('Login error:', error);
        showMessage('loginError', 'Invalid username or password');
    });
});

// real registration logic no mockup
document.getElementById("registerFormElement").addEventListener("submit", function (e) {
    e.preventDefault();

    var username = document.getElementById("registerUsername").value;
    var password = document.getElementById("registerPassword").value;
    var confirmPassword = document.getElementById("registerConfirmPassword").value;
    var userType = document.getElementById("registerUserType").value;

    // validation
    if (!username || !password || !userType) {
      showMessage("registerError", "Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      showMessage("registerError", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("registerError", "Passwords do not match");
      return;
    }

    // fetch call to create user in DB
    fetch(API_BASE_URL + '/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username: username, 
            password: password, 
            role: userType 
        })
    })
    .then(response => {
        if (!response.ok) return response.json().then(err => { throw err; });
        return response.json();
    })
    .then(data => {
        showMessage("registerSuccess", "Registration successful! You can now login.");
        setTimeout(() => {
            showLoginForm();
            document.getElementById("registerFormElement").reset();
        }, 2000);
    })
    .catch(error => {
        console.error('Registration error:', error);
        // show specific error from backend if available, otherwise generic message
        var msg = error.error || "Registration failed. Username might be taken.";
        showMessage("registerError", msg);
    });
});

function showMessage(elementId, message) {
  var element = document.getElementById(elementId);
  element.textContent = message;
  element.style.display = "block";

  setTimeout(function () {
    element.style.display = "none";
  }, 5000);
}