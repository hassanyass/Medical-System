<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include '../con.php';

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

// Load doctors
$doctors_result = mysqli_query($con, "SELECT doctor.*, specialty.specialty_name 
    FROM doctor 
    INNER JOIN specialty ON specialty.specialty_id = doctor.doctor_specialty 
    WHERE status = 1");

$doctors = [];
while ($row = mysqli_fetch_assoc($doctors_result)) {
    $doctors[] = $row;
}

// Load doctor_schedule
$schedule_result = mysqli_query($con, "SELECT * FROM doctor_schedule");

$schedule = [];
while ($row = mysqli_fetch_assoc($schedule_result)) {
    $doctor_id = $row['doctor_id'];
    $day = $row['day_of_week'];
    $start_time = $row['start_time'];
    $end_time = $row['end_time'];

    // Build slots in 1 hour intervals
    $slots = [];
    $current = strtotime($start_time);
    $end = strtotime($end_time);

    while ($current <= $end) {
        $slots[] = date('H:i', $current);
        $current = strtotime('+1 hour', $current);
    }

    $schedule[$doctor_id][$day] = $slots;
}

// Load appointments
$appointments_result = mysqli_query($con, "SELECT * FROM appointments");

$appointments = [];
while ($row = mysqli_fetch_assoc($appointments_result)) {
    $appointments[] = [
        'doctor_id' => $row['doctor_id'],
        'date' => $row['appointment_date'],
        'time' => date('H:i', strtotime($row['appointment_time']))
    ];
}

?>

<?php
if (isset($_POST['book_appointment'])) {
    $doctor_id = mysqli_real_escape_string($con, $_POST['doctor_id']);
    $appointment_date = mysqli_real_escape_string($con, $_POST['appointment_date']);
    $appointment_time = mysqli_real_escape_string($con, $_POST['appointment_time']);
    $reason = mysqli_real_escape_string($con, $_POST['reason']);
    $contact_method = mysqli_real_escape_string($con, $_POST['contactMethod']);

    // Check if slot already booked
    $check = mysqli_query($con, "SELECT * FROM appointments 
        WHERE doctor_id = '$doctor_id' 
        AND appointment_date = '$appointment_date' 
        AND appointment_time = '$appointment_time'");

    if (mysqli_num_rows($check) > 0) {
        echo "<script>alert('This slot is already booked!');</script>";
    } else {
        // Save appointment
        $insert = mysqli_query($con, "INSERT INTO appointments 
            (doctor_id, patient_id, appointment_date, appointment_time, status, notes) 
            VALUES 
            ('$doctor_id', '$user_id', '$appointment_date', '$appointment_time', 'Pending', '$reason')");

        if ($insert) {
            echo "<script>alert('Appointment booked successfully!'); location.href='finddoctors.php';</script>";
            exit();
        } else {
            echo "<script>alert('Failed to book appointment!');</script>";
        }
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Find Doctors - Medical System</title>
    <link rel="stylesheet" href="user.css">
    <link rel="stylesheet" href="findDoctors.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
<div class="container">
    <nav class="sidebar">
        <div class="profile-section">
            <div class="profile-image">
                <img src="default-avatar.jpg" alt="User Profile" id="userProfilePic">
            </div>
            <h3 id="userName">Welcome, <?php echo htmlspecialchars($fetch['patient_name']); ?></h3>
        </div>
        <ul class="nav-links">
            <li><a href="user.php"><i class="fas fa-home"></i> Dashboard</a></li>
            <li class="active"><a href="finddoctors.php"><i class="fas fa-user-md"></i> Find Doctors</a></li>
            <li><a href="appointments.php"><i class="fas fa-calendar-check"></i> My Appointments</a></li>
            <li><a href="chat.html"><i class="fas fa-comments"></i> Chat</a></li>
            <li><a href="../login.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    </nav>

    <main class="main-content">
        <div class="page-header">
            <h1>Find Doctors</h1>
            <div class="search-filters">
                <input type="text" placeholder="Search doctors by name" id="searchInput">
                <select id="specialtyFilter">
                    <option value="">All Specialties</option>
                    <?php
                    $specialties = mysqli_query($con, "SELECT * FROM specialty");
                    while ($spec = mysqli_fetch_assoc($specialties)) {
                        echo '<option value="' . htmlspecialchars($spec['specialty_name']) . '">' . htmlspecialchars($spec['specialty_name']) . '</option>';
                    }
                    ?>
                </select>
                <button class="search-btn">Search</button>
            </div>
        </div>

        <div class="doctors-calendar-container">
            <div class="doctors-list">
                <?php foreach ($doctors as $doc): ?>
                    <div class="doctor-card" data-doctor-id="<?php echo $doc['doctor_id']; ?>">
                        <img src="<?php echo !empty($doc['doctor_photo']) ? '../profile_pics/doctor_pics/' . $doc['doctor_photo'] : 'img/doctor.jpg'; ?>" alt="<?php echo htmlspecialchars($doc['doctor_name']); ?>">
                        <h4><?php echo htmlspecialchars($doc['doctor_name']); ?></h4>
                        <p><?php echo htmlspecialchars($doc['specialty_name']); ?></p>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="prev-week"><i class="fas fa-chevron-left"></i></button>
                    <h2>Select a doctor</h2>
                    <button class="next-week"><i class="fas fa-chevron-right"></i></button>
                </div>

                <div class="calendar-grid">
                    <div class="time-column">
                        <?php
                        $times = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];
                        foreach ($times as $time) {
                            echo '<div class="time-slot">' . date('g:i A', strtotime($time)) . '</div>';
                        }
                        ?>
                    </div>
                    <div class="days-grid">
                        <!-- Will be filled by JS -->
                    </div>
                </div>
            </div>

            <div class="booking-details">
                <h3>Book Appointment</h3>
                <div class="selected-slot">
                    <p><i class="fas fa-calendar-alt"></i> Selected Date: <span id="selectedDate">Select a time slot</span></p>
                    <p><i class="fas fa-clock"></i> Selected Time: <span id="selectedTime">Select a time slot</span></p>
                    <p><i class="fas fa-user-md"></i> Doctor: <span id="selectedDoctor">Select a doctor</span></p>
                </div>
                <form class="booking-form" method="POST">
                    <input type="hidden" name="doctor_id" id="hiddenDoctorId" required>
                    <input type="hidden" name="appointment_date" id="hiddenDate" required>
                    <input type="hidden" name="appointment_time" id="hiddenTime" required>
                    <div class="form-group">
                        <label>Reason for Visit</label>
                        <textarea name="reason" required></textarea>
                    </div>
                    <!-- <div class="form-group">
                        <label>Preferred Contact Method</label>
                        <select name="contactMethod" required>
                            <option value="phone">Phone</option>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                        </select>
                    </div> -->
                    <button type="submit" class="book-btn" name="book_appointment">Book Appointment</button>
                </form>
            </div>
        </div>
    </main>
</div>

<!-- Pass data to JS -->
<script>
const doctors = <?php echo json_encode($doctors); ?>;
const schedule = <?php echo json_encode($schedule); ?>;
const appointments = <?php echo json_encode($appointments); ?>;
</script>
<script src="findDoctorsab.js"></script>
</body>
</html>
