const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password')
const error_message = document.getElementById('error-message')

// Store user data (in a real app, this would use a database)
let users = JSON.parse(localStorage.getItem('users')) || [];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let errors = []
    
    if(firstname_input){
        // This is signup form
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value)
        
        if(errors.length === 0) {
            // Save user info
            const newUser = {
                firstname: firstname_input.value,
                email: email_input.value,
                password: password_input.value,
                role: 'user'
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Redirect to user page
            window.location.href = "../User/user.html";
        }
    }
    else{
        // This is login form
        errors = getLoginFormErrors(email_input.value, password_input.value)
        
        if(errors.length === 0) {
            // Check for special users first
            if(email_input.value === "admin@admin.com" && password_input.value === "admin") {
                window.location.href = "../Doctor and Admin/admin/admin.php";
                return;
            }
            
            if(email_input.value === "doctor@doctor.com" && password_input.value === "doctor") {
                window.location.href = "../Doctor and Admin/dashboard.html";
                return;
            }
            
            // Check for registered users
            const user = users.find(user => user.email === email_input.value && user.password === password_input.value);
            
            if(user) {
                window.location.href = "../User/user.html";
            } else {
                errors.push("Invalid email or password");
                email_input.parentElement.classList.add('incorrect');
                password_input.parentElement.classList.add('incorrect');
            }
        }
    }

    if(errors.length > 0){
        error_message.innerText = errors.join(". ")
    }
})

function getSignupFormErrors(firstname, email, password, repeatPassword){
    let errors = []

    if(firstname ===''|| firstname == null){
        errors.push('Firstname is required')
        firstname_input.parentElement.classList.add('incorrect')
    }
    
    if(email ===''|| email == null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }
    
    if(password ===''|| password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }
    
    if(repeatPassword === ''|| repeatPassword == null){
        errors.push('Please confirm your password')
        repeat_password_input.parentElement.classList.add('incorrect')
    } else if(password !== repeatPassword) {
        errors.push('Passwords do not match')
        repeat_password_input.parentElement.classList.add('incorrect')
    }
    
    // Check if email already exists
    if(users.some(user => user.email === email)) {
        errors.push('Email already in use')
        email_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

function getLoginFormErrors(email, password){
    let errors = []
    
    if(email ===''|| email == null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }
    
    if(password ===''|| password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

const allInputs = [firstname_input, email_input, password_input, repeat_password_input].filter(input => input != null)

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect')
            error_message.innerText = ''
        }
    })
})