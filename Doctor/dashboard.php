<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    include '../con.php';
    if(!empty($_SESSION["user_id2"])){
    $user_id = $_SESSION["user_id2"];
    $select = mysqli_query($con, "SELECT * FROM `doctor` WHERE doctor_id = '$user_id'") or die('query failed');

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

<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Dashboard</title>
    <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
    <link rel="stylesheet" href="dashboardStyle.css">
    <!-- <script src="dashboardScript.js" defer></script> -->
</head>

<body>
    <input type="checkbox" id="nav-toggle">
    <div class="sidebar">
        <div class="sidebar-brand">
            <div class="brand-flex">
                <img src="img/logo.png" width="50px" alt="logo">
                <div class="brand-icons">
                    <span class="las la-bell"></span>
                    <span class="las la-user-circle"></span>
                </div>
            </div>
        </div>
        <div class="sidebar-main">
            <div class="sidebar-doctor">
                <div class="doctor-profile">
                    <img src="img/doctor.jpg" alt="doctor">
                    <div class="doctor-info">
                        <h2><?php echo $fetch["doctor_name"] ?></h2>
                        <p><?php echo $fetch["email"] ?></p>
                    </div>
                </div>
            </div>
            <div class="sidebar-menu">
                <div class="menu-block">
                    <div class="menu-head">
                        <span>Dashboard</span>
                    </div>
                    <ul>
                        <li>
                            <a href="dashboard.html" class="active">
                                <span class="las la-tachometer-alt"></span>
                                <span>Overview</span>
                            </a>
                        </li>
                        <li>
                            <a href="doctorAppointment.html">
                                <span class="las la-calendar-check"></span>
                                <span>Appointments</span>
                            </a>
                        </li>
                        <li>
                            <a href="doctorPatients.html">
                                <span class="las la-user-md"></span>
                                <span>Patients</span>
                            </a>
                        </li>
                        <li>
                            <a href="doctorChat.html">
                                <span class="las la-comments"></span>
                                <span>Chats</span>
                            </a>
                        </li>
                        <li>
                            <a href="../logout.php" id="logoutBtn">
                                <span class="las la-sign-out-alt"></span>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="main-content">
        <header>
            <div class="menu-toggle">
                <label for="nav-toggle">
                    <span class="las la-bars"></span>
                </label>
            </div>
            <div class="search-wrapper">
                <span class="las la-search"></span>
                <input type="search" placeholder="Search here">
            </div>
            <div class="header-icons">
                <span class="las la-bookmark"></span>
                <span class="las la-sms"></span>
            </div>
        </header>
        <main>
            <div class="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <small>Monitor patients, check reporting and review insights</small>
                </div>
                                <div class="button-group">                    <button>                        <span class="las la-tools"></span>                        Settings                    </button>                </div>
            </div>

            <!-- Overview Cards -->
            <div class="cards-grid">
                <div class="card">
                    <div class="card-icon">
                        <span class="las la-users"></span>
                    </div>
                    <div class="card-info">
                        <h2>Total Patients</h2>
                        <h3>3</h3>
                        <small>Active patients in system</small>
                    </div>
                </div>

                <div class="card">
                    <div class="card-icon">
                        <span class="las la-calendar-check"></span>
                    </div>
                    <div class="card-info">
                        <h2>Appointments Today</h2>
                        <h3>3</h3>
                        <small>1 pending confirmation</small>
                    </div>
                </div>

                <div class="card">
                    <div class="card-icon">
                        <span class="las la-clock"></span>
                    </div>
                    <div class="card-info">
                        <h2>Upcoming</h2>
                        <h3>2</h3>
                        <small>Confirmed appointments</small>
                    </div>
                </div>

                <div class="card">
                    <div class="card-icon">
                        <span class="las la-user-check"></span>
                    </div>
                    <div class="card-info">
                        <h2>Consultations</h2>
                        <h3>1</h3>
                        <small>New consultation today</small>
                    </div>
                </div>
            </div>

            <!-- Recent Appointments -->
            <div class="recent-appointments">
                <div class="section-header">
                    <h2>Recent Appointments</h2>
                    <a href="doctorAppointment.html" class="view-all">
                        <span class="las la-angle-right"></span>
                        View All
                    </a>
                </div>
                <div class="appointments-list">
                    <table class="appointments-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="patient-info">
                                    <img src="img/patient1.jpg" alt="patient">
                                    <div>
                                        <h4>John Smith</h4>
                                        <small>ID: P-0123</small>
                                    </div>
                                </td>
                                <td>March 15, 2024</td>
                                <td>10:00 AM</td>
                                <td><span class="status confirmed">Confirmed</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn view-btn" title="View Details">
                                            <span class="las la-eye"></span>
                                        </button>
                                        <button class="action-btn edit-btn" title="Edit">
                                            <span class="las la-edit"></span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="patient-info">
                                    <img src="img/patient2.jpg" alt="patient">
                                    <div>
                                        <h4>Sarah Johnson</h4>
                                        <small>ID: P-0124</small>
                                    </div>
                                </td>
                                <td>March 15, 2024</td>
                                <td>11:30 AM</td>
                                <td><span class="status pending">Pending</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn view-btn" title="View Details">
                                            <span class="las la-eye"></span>
                                        </button>
                                        <button class="action-btn edit-btn" title="Edit">
                                            <span class="las la-edit"></span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- New Appointment Modal -->
            <div id="newAppointmentModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Schedule New Appointment</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <form id="newAppointmentForm">
                        <div class="form-group">
                            <label for="patientSelect">Patient</label>
                            <select id="patientSelect" name="patientId" required>
                                <option value="">Select Patient</option>
                                <option value="P-0123">John Smith (P-0123)</option>
                                <option value="P-0124">Sarah Johnson (P-0124)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="appointmentDate">Date</label>
                            <input type="date" id="appointmentDate" name="date" required min="2024-03-15">
                        </div>
                        <div class="form-group">
                            <label for="appointmentTime">Time</label>
                            <input type="time" id="appointmentTime" name="time" required min="09:00" max="17:00">
                            <small>Available hours: 9:00 AM - 5:00 PM</small>
                        </div>
                        <div class="form-group">
                            <label for="appointmentType">Appointment Type</label>
                            <select id="appointmentType" name="type" required>
                                <option value="Check-up">Check-up</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="appointmentNotes">Notes</label>
                            <textarea id="appointmentNotes" name="notes" rows="3" placeholder="Add any additional notes here..."></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="cancel-btn">Cancel</button>
                            <button type="submit" class="save-btn">Schedule Appointment</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
    <script>
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            // Clear any session data if needed
            sessionStorage.clear();
            localStorage.clear();
            // Redirect to login page
            window.location.href = '../Login Page/login.html';
        });
    </script>
</body>




</html>