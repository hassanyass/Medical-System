document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear any stored session data
            localStorage.removeItem('adminToken');
            sessionStorage.removeItem('adminToken');
            
            // Clear any cookies
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            // Redirect to login page with absolute path
            window.location.href = 'C:/Users/hassa/Desktop/Medical System/Login Page/login.html';
        });
    }
}); 