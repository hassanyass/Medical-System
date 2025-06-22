<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    include '../con.php';

    if (!empty($_SESSION["user_id2"])) {
        $user_id = $_SESSION["user_id2"];
        $select = mysqli_query($con, "SELECT * FROM `doctor` WHERE doctor_id = '$user_id'") or die('query failed');

        if (mysqli_num_rows($select) > 0) {
            $fetch = mysqli_fetch_assoc($select);
        }
    } else {
        header("Location: ../login.php");
        exit();
    }

    $patient_query = mysqli_query($con, "SELECT COUNT(DISTINCT patient_id) AS total_patients FROM appointments WHERE doctor_id = '$user_id'");
    $total_patients = mysqli_fetch_assoc($patient_query)['total_patients'];

    $today = date("Y-m-d");

    $appointments_today_query = mysqli_query($con, "SELECT COUNT(*) AS today_appointments FROM appointments WHERE doctor_id = '$user_id' AND appointment_date = '$today'");
    $today_appointments = mysqli_fetch_assoc($appointments_today_query)['today_appointments'];

    $upcoming_query = mysqli_query($con, "SELECT COUNT(*) AS upcoming FROM appointments WHERE doctor_id = '$user_id' AND appointment_date > '$today' AND status = 'Confirmed'");
    $upcoming_appointments = mysqli_fetch_assoc($upcoming_query)['upcoming'];

    $consult_query = mysqli_query($con, "SELECT COUNT(*) AS consultations FROM appointments WHERE doctor_id = '$user_id' AND appointment_date = '$today'");
    $consult_row = mysqli_fetch_assoc($consult_query);
    $today_consultations = $consult_row ? $consult_row['consultations'] : 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Doctor Dashboard</title>
  <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css"/>
  <link rel="stylesheet" href="dashboardStyle.css"/>
</head>
<body>
<input type="checkbox" id="nav-toggle" />
<div class="sidebar">
  <div class="sidebar-brand">
    <div class="brand-flex">
      <img src="img/logo.png" width="50px" alt="logo" />
      <div class="brand-icons">
        <span class="las la-bell"></span>
        <span class="las la-user-circle"></span>
      </div>
    </div>
  </div>
  <div class="sidebar-main">
    <div class="sidebar-doctor">
      <div class="doctor-profile">
        <img src="img/doctor.jpg" alt="doctor" />
        <div class="doctor-info">
          <h2><?php echo $fetch["doctor_name"] ?></h2>
          <p><?php echo $fetch["email"] ?></p>
        </div>
      </div>
    </div>
    <div class="sidebar-menu">
      <div class="menu-block">
        <div class="menu-head"><span>Dashboard</span></div>
        <ul>
          <li><a href="dashboard.php" class="active"><span class="las la-tachometer-alt"></span><span>Overview</span></a></li>
          <li><a href="doctorAppointment.php"><span class="las la-calendar-check"></span><span>Appointments</span></a></li>
          <li><a href="doctorPatients.html"><span class="las la-user-md"></span><span>Patients</span></a></li>
          <li><a href="doctorChat.html"><span class="las la-comments"></span><span>Chats</span></a></li>
          <li><a href="../logout.php"><span class="las la-sign-out-alt"></span><span>Logout</span></a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div class="main-content">
  <header>
    <div class="menu-toggle">
      <label for="nav-toggle"><span class="las la-bars"></span></label>
    </div>
    <div class="search-wrapper">
      <span class="las la-search"></span>
      <input type="search" placeholder="Search here" />
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
      <div class="button-group">
        <button><span class="las la-tools"></span>Settings</button>
      </div>
    </div>

    <div class="cards-grid">
      <div class="card">
        <div class="card-icon"><span class="las la-users"></span></div>
        <div class="card-info">
          <h2>Total Patients</h2>
          <h3><?php echo $total_patients; ?></h3>
          <small>Unique patients who booked</small>
        </div>
      </div>
      <div class="card">
        <div class="card-icon"><span class="las la-calendar-check"></span></div>
        <div class="card-info">
          <h2>Appointments Today</h2>
          <h3><?php echo $today_appointments; ?></h3>
          <small>Scheduled for today</small>
        </div>
      </div>
      <div class="card">
        <div class="card-icon"><span class="las la-clock"></span></div>
        <div class="card-info">
          <h2>Upcoming</h2>
          <h3><?php echo $upcoming_appointments; ?></h3>
          <small>Confirmed appointments</small>
        </div>
      </div>
      <div class="card">
        <div class="card-icon"><span class="las la-user-check"></span></div>
        <div class="card-info">
          <h2>Consultations</h2>
          <h3><?php echo $today_consultations; ?></h3>
          <small>Appointments today</small>
        </div>
      </div>
    </div>

    <div class="recent-appointments">
      <div class="section-header">
        <h2>Recent Appointments</h2>
        <a href="doctorAppointment.php" class="view-all">
          <span class="las la-angle-right"></span> View All
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
          <?php
            $appt_query = mysqli_query($con, "
              SELECT a.*, p.patient_name, p.patient_photo
              FROM appointments a
              JOIN patient p ON a.patient_id = p.patient_id
              WHERE a.doctor_id = '$user_id'
              ORDER BY a.appointment_date DESC
              LIMIT 5
            ");
            while ($row = mysqli_fetch_assoc($appt_query)) {
                $pname = $row['patient_name'];
                $pid = $row['patient_id'];
                $photo = !empty($row['patient_photo']) ? "../profile_pics/user_pics/" . $row['patient_photo'] : "../profile_pics/user_pics/patient1.jpg";
                $date = date('F j, Y', strtotime($row['appointment_date']));
                $time = date('h:i A', strtotime($row['appointment_time']));
                $status = $row['status'];

                echo "
                <tr>
                    <td class='patient-info'>
                    <img src='$photo' alt='patient'>
                    <div>
                        <h4>$pname</h4>
                        <small>ID: P-" . str_pad($pid, 4, '0', STR_PAD_LEFT) . "</small>
                    </div>
                    </td>
                    <td>$date</td>
                    <td>$time</td>
                    <td><span class='status " . ($status == 'Confirmed' ? 'confirmed' : 'pending') . "'>" . ucfirst($status) . "</span></td>
                    <td>
                    <div class='action-buttons'>
                        <button class='action-btn view-btn' title='View Details'><span class='las la-eye'></span></button>
                        <button class='action-btn edit-btn' title='Edit'><span class='las la-edit'></span></button>
                    </div>
                    </td>
                </tr>";
                }
          ?>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
</body>
</html>
