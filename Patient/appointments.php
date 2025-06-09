<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include '../con.php';
// session_start();

// Check if patient is logged in
if (!empty($_SESSION["user_id3"])) {
    $user_id = $_SESSION["user_id3"];
    $select = mysqli_query($con, "SELECT * FROM `patient` WHERE patient_id = '$user_id'") or die('Query failed');

    if (mysqli_num_rows($select) > 0) {
        $fetch = mysqli_fetch_assoc($select);
    } else {
        header("Location: ../login.php");
        exit();
    }
} else {
    header("Location: ../login.php");
    exit();
}

// Filters from GET
$status_filter = isset($_GET['status']) ? $_GET['status'] : '';
$date_filter = isset($_GET['date']) ? $_GET['date'] : '';

// Build query
$query = "
    SELECT 
        a.*, 
        d.doctor_name, 
        d.doctor_photo, 
        s.specialty_name
    FROM appointments a
    INNER JOIN doctor d ON d.doctor_id = a.doctor_id
    INNER JOIN specialty s ON s.specialty_id = d.doctor_specialty
    WHERE a.patient_id = '$user_id'
";

if (!empty($status_filter)) {
    $safe_status = mysqli_real_escape_string($con, $status_filter);
    $query .= " AND a.status = '$safe_status'";
}

if (!empty($date_filter)) {
    $safe_date = mysqli_real_escape_string($con, $date_filter);
    $query .= " AND a.appointment_date = '$safe_date'";
}

$query .= " ORDER BY a.appointment_date ASC, a.appointment_time ASC";

$appointments = mysqli_query($con, $query);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Appointments - Medical System</title>
    <link rel="stylesheet" href="user.css">
    <link rel="stylesheet" href="findDoctors.css">
    <link rel="stylesheet" href="appointments.css">
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
                <h3 id="userName">Welcome, <?php echo htmlspecialchars($fetch['patient_name']); ?></h3>
            </div>
            <ul class="nav-links">
                <li><a href="user.php"><i class="fas fa-home"></i> Dashboard</a></li>
                <li><a href="finddoctors.php"><i class="fas fa-user-md"></i> Find Doctors</a></li>
                <li class="active"><a href="appointments.php"><i class="fas fa-calendar-check"></i> My Appointments</a></li>
                <li><a href="chat.html"><i class="fas fa-comments"></i> Chat</a></li>
                <li><a href="../logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content Area -->
        <main class="main-content">
            <div class="page-header">
                <h1>My Appointments</h1>
                <!-- Filter bar -->
                <form method="GET" class="appointment-filters" style="display: flex; gap: 10px; align-items: center;">
                    <select name="status" id="statusFilter">
                        <option value="">All Statuses</option>
                        <option value="Pending" <?php if ($status_filter == 'Pending') echo 'selected'; ?>>Pending</option>
                        <option value="Approved" <?php if ($status_filter == 'Approved') echo 'selected'; ?>>Approved</option>
                        <option value="Completed" <?php if ($status_filter == 'Completed') echo 'selected'; ?>>Completed</option>
                        <option value="Cancelled" <?php if ($status_filter == 'Cancelled') echo 'selected'; ?>>Cancelled</option>
                        <option value="Rejected" <?php if ($status_filter == 'Rejected') echo 'selected'; ?>>Rejected</option>
                    </select>
                    <input type="date" name="date" id="dateFilter" value="<?php echo htmlspecialchars($date_filter); ?>">
                    <button type="submit" class="filter-btn"><i class="fas fa-filter"></i> Filter</button>
                    <a href="appointments.php" class="btn-reset" style="margin-left: 10px;">Reset</a>
                </form>
            </div>

            <div class="appointments-container">
                <div class="appointments-header">
                    <div class="upcoming-appointments">
                        <h2><i class="fas fa-calendar-alt"></i> Upcoming Appointments</h2>
                    </div>
                    <div class="new-appointment">
                        <a href="finddoctors.php" class="btn-new-appointment"><i class="fas fa-plus"></i> Book New Appointment</a>
                    </div>
                </div>

                <!-- Appointments List -->
                <div class="appointments-list">
                    <?php if (mysqli_num_rows($appointments) > 0): ?>
                        <?php while ($apt = mysqli_fetch_assoc($appointments)): ?>
                            <?php
                                $apt_date = date("l, F j, Y", strtotime($apt['appointment_date']));
                                $apt_time = date("h:i A", strtotime($apt['appointment_time']));
                                $status = strtolower($apt['status']);
                            ?>
                            <div class="appointment-card">
                                <div class="appointment-info">
                                    <div class="appointment-doctor">
                                        <img src="<?php echo !empty($apt['doctor_photo']) ? '../profile_pics/doctor_pics/' . $apt['doctor_photo'] : 'img/doctor.jpg'; ?>" 
                                             alt="<?php echo htmlspecialchars($apt['doctor_name']); ?>">
                                        <div>
                                            <div class="doctor-name"><?php echo htmlspecialchars($apt['doctor_name']); ?></div>
                                            <div class="doctor-specialty"><?php echo htmlspecialchars($apt['specialty_name']); ?></div>
                                        </div>
                                    </div>
                                    <div class="appointment-details">
                                        <p><i class="fas fa-calendar-alt"></i> <?php echo $apt_date; ?></p>
                                        <p><i class="fas fa-clock"></i> <?php echo $apt_time; ?></p>
                                        <p><i class="fas fa-info-circle"></i> Notes: <?php echo !empty($apt['notes']) ? htmlspecialchars($apt['notes']) : 'N/A'; ?></p>
                                    </div>
                                </div>
                                <div class="appointment-status status-<?php echo $status; ?>">
                                    <?php echo ucfirst($status); ?>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <div class="no-appointments">
                            <p>You don't have any appointments yet.</p>
                            <a href="finddoctors.php" class="btn-book-now">Book an appointment now</a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
