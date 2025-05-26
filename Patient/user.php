<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    include '../con.php';
    if(!empty($_SESSION["user_id3"])){
    $user_id = $_SESSION["user_id3"];
    $select = mysqli_query($con, "SELECT * FROM `patient` WHERE patient_id = '$user_id'") or die('query failed');

        if (mysqli_num_rows($select) > 0)
        {
            $fetch = mysqli_fetch_assoc($select);
        }
    }
    else{
    header("Location: ../login.php");
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Dashboard - Medical System</title>
    <link rel="stylesheet" href="user.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- Sidebar Navigation -->
        <nav class="sidebar">
            <div class="profile-section">
                <div class="profile-image">
                    <img src="default-avatar.jpg" alt="User Profile" id="userProfilePic">
                </div>
                <h3 id="userName"><?php echo "Welcome, ", $fetch["patient_name"] ?></h3>
            </div>
            <ul class="nav-links">
                <li class="active"><a href="user.html"><i class="fas fa-home"></i> Dashboard</a></li>
                <li><a href="findDoctors.html"><i class="fas fa-user-md"></i> Find Doctors</a></li>
                <li><a href="appointments.html"><i class="fas fa-calendar-check"></i> My Appointments</a></li>
                <li><a href="chat.html"><i class="fas fa-comments"></i> Chat</a></li>
                <li><a href="../logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content Area -->
        <main class="main-content">
            <!-- Dashboard Section -->
            <section id="dashboard" class="section active">
                <h2>Dashboard</h2>
                <div class="quick-actions">
                    <div class="action-card" onclick="window.location.href='findDoctors.html'">
                        <i class="fas fa-calendar-plus"></i>
                        <h3>Book Appointment</h3>
                        <p>Schedule a new appointment with a doctor</p>
                    </div>
                    <div class="action-card" onclick="window.location.href='appointments.html'">
                        <i class="fas fa-history"></i>
                        <h3>Appointment History</h3>
                        <p>View your past appointments</p>
                    </div>
                    <div class="action-card" onclick="window.location.href='chat.html'">
                        <i class="fas fa-envelope"></i>
                        <h3>Messages</h3>
                        <p>Check your messages from doctors</p>
                    </div>
                </div>
                
                <div class="upcoming-appointments">
                    <h3>Upcoming Appointments</h3>
                    <div class="appointment-list" id="upcomingAppointments">
                        <!-- Appointments will be populated dynamically -->
                    </div>
                </div>
            </section>

            <!-- Find Doctors Section -->
            <section id="doctors" class="section">
                <h2>Find Doctors</h2>
                <div class="search-filters">
                    <input type="text" placeholder="Search doctors by name or specialty">
                    <select>
                        <option value="">All Specialties</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="dermatology">Dermatology</option>
                        <option value="neurology">Neurology</option>
                        <!-- More specialties -->
                    </select>
                    <button class="search-btn">Search</button>
                </div>
                <div class="doctors-grid" id="doctorsList">
                    <!-- Doctors will be populated dynamically -->
                </div>
            </section>

            <!-- Appointments Section -->
            <section id="appointments" class="section">
                <h2>My Appointments</h2>
                <div class="appointments-tabs">
                    <button class="tab active">Upcoming</button>
                    <button class="tab">Past</button>
                    <button class="tab">Cancelled</button>
                </div>
                <div class="appointments-list" id="appointmentsList">
                    <!-- Appointments will be populated dynamically -->
                </div>
            </section>

            <!-- Chat Section -->
            <section id="chat" class="section">
                <h2>Messages</h2>
                <div class="chat-container">
                    <div class="chat-list">
                        <!-- Chat contacts will be populated dynamically -->
                    </div>
                    <div class="chat-messages">
                        <div class="messages-container" id="messagesContainer">
                            <!-- Messages will be populated dynamically -->
                        </div>
                        <div class="message-input">
                            <input type="text" placeholder="Type your message...">
                            <button><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- <script src="user.js"></script> -->
</body>
</html> 