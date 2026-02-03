// Mock login logic
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Simulate authentication (any input is accepted)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        // Set authentication state in localStorage
        localStorage.setItem('isAuthenticated', 'true');

        // Redirect to dashboard
        window.location.href = 'login.html';
    } else {
        alert('Please enter both email and password.');
    }
});
