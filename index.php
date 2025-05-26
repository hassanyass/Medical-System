<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MediCare - Advanced Healthcare System</title>
    <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Header -->
    <header>
        <nav class="nav-container">
            <a href="index.php" class="logo">
                <i class="las la-heartbeat"></i>
                MediCare
            </a>
            <div class="nav-links">
                <a href="#features">Features</a>
                <a href="#services">Services</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <div class="auth-buttons">
                    <a href="login.php" class="btn btn-login">Login</a>
                    <a href="signup.php" class="btn btn-signup">Sign Up</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>Your Health, Our Priority</h1>
            <p>Experience modern healthcare management with our comprehensive medical system. Connect with doctors, manage appointments, and access your health records seamlessly.</p>
            <div class="auth-buttons">
                <a href="signup.php" class="btn btn-signup">Get Started</a>
                <a href="#features" class="btn btn-login">Learn More</a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="section-title">
            <h2>Why Choose Us</h2>
            <p>Discover the benefits of our advanced healthcare system</p>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <i class="las la-user-md"></i>
                <h3>Expert Doctors</h3>
                <p>Connect with qualified and experienced healthcare professionals</p>
            </div>
            <div class="feature-card">
                <i class="las la-calendar-check"></i>
                <h3>Easy Scheduling</h3>
                <p>Book and manage appointments with just a few clicks</p>
            </div>
            <div class="feature-card">
                <i class="las la-file-medical"></i>
                <h3>Digital Records</h3>
                <p>Access your medical history and reports anytime, anywhere</p>
            </div>
            <div class="feature-card">
                <i class="las la-comments"></i>
                <h3>24/7 Support</h3>
                <p>Get assistance whenever you need through our messaging system</p>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services" id="services">
        <div class="section-title">
            <h2>Our Services</h2>
            <p>Comprehensive healthcare solutions for everyone</p>
        </div>
        <div class="services-grid">
            <div class="service-card">
                <div class="img-container">
                    <img src="assets/img/dialogue.png" alt="Online Consultation">
                </div>
                <div class="service-content">
                    <h3>Online Consultation</h3>
                    <p>Get expert medical advice from the comfort of your home</p>
                </div>
            </div>
            <div class="service-card">
                <div class="img-container">
                    <img src="assets/img/emergency.png" alt="Emergency Care">
                </div>
                <div class="service-content">
                    <h3>Emergency Care</h3>
                    <p>24/7 emergency support and quick response system</p>
                </div>
            </div>
            <div class="service-card">
                <div class="img-container">
                    <img src="assets/img/nephrologist.png" alt="Specialist Care">
                </div>
                <div class="service-content">
                    <h3>Specialist Care</h3>
                    <p>Access to specialized medical professionals across various fields</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about" id="about">
        <div class="section-title">
            <h2>About Us</h2>
            <p>Pioneering healthcare innovation since 2010</p>
        </div>
        <div class="about-container">
            <div class="about-image">
                <img src="assets/img/about-team.jpg" alt="Medical Team">
            </div>
            <div class="about-content">
                <h3>Our Mission</h3>
                <p>At MediCare, we're dedicated to revolutionizing healthcare access through technology. Our platform connects patients with qualified healthcare professionals, streamlines appointment scheduling, and provides secure access to medical records.</p>
                
                <h3>Our Vision</h3>
                <p>We envision a world where quality healthcare is accessible to everyone, everywhere. Through innovation and dedication, we strive to break down barriers to medical care and improve health outcomes globally.</p>
                
                <div class="stats-container">
                    <div class="stat-item">
                        <h4>10+</h4>
                        <p>Years of Excellence</p>
                    </div>
                    <div class="stat-item">
                        <h4>500+</h4>
                        <p>Medical Professionals</p>
                    </div>
                    <div class="stat-item">
                        <h4>50,000+</h4>
                        <p>Satisfied Patients</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <div class="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied users who trust our healthcare system</p>
            <div class="cta-buttons">
                <a href="signup.php" class="btn btn-signup">Create Account</a>
                <a href="login.php" class="btn btn-login">Login Now</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>About MediCare</h3>
                <p>Advanced healthcare management system designed to provide the best medical services and patient care.</p>
                <div class="social-links">
                    <a href="#"><i class="lab la-facebook"></i></a>
                    <a href="#"><i class="lab la-twitter"></i></a>
                    <a href="#"><i class="lab la-instagram"></i></a>
                    <a href="#"><i class="lab la-linkedin"></i></a>
                </div>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact Info</h3>
                <ul>
                    <li><i class="las la-phone"></i> +1 234 567 890</li>
                    <li><i class="las la-envelope"></i> info@medicare.com</li>
                    <li><i class="las la-map-marker"></i> 123 Medical Center, City</li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Legal</h3>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Cookie Policy</a></li>
                    <li><a href="#">HIPAA Compliance</a></li>
                </ul>
            </div>
        </div>
    </footer>
</body>
</html> 