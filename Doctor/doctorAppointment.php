<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include '../con.php';

if (!empty($_SESSION["user_id2"])) {
    $doctor_id = $_SESSION["user_id2"];
    $select = mysqli_query($con, "SELECT * FROM `doctor` WHERE doctor_id = '$doctor_id'") or die('query failed');
    if (mysqli_num_rows($select) > 0) {
        $fetch = mysqli_fetch_assoc($select);
    }
} else {
    header("Location: ../login.php");
    exit();
}

$today = date("Y-m-d");

$appointments = mysqli_query($con, "
    SELECT a.*, p.patient_name, p.patient_photo
    FROM appointments a
    JOIN patient p ON a.patient_id = p.patient_id
    WHERE a.doctor_id = '$doctor_id'
    ORDER BY a.appointment_date ASC, a.appointment_time ASC
");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Doctor Appointments</title>
  <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
  <link rel="stylesheet" href="dashboardStyle.css">
  <link rel="stylesheet" href="appointmentStyle.css">
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
          <h2><?php echo $fetch["doctor_name"]; ?></h2>
          <p><?php echo $fetch["email"]; ?></p>
        </div>
      </div>
    </div>
    <div class="sidebar-menu">
      <div class="menu-block">
        <div class="menu-head"><span>Dashboard</span></div>
        <ul>
          <li><a href="dashboard.php"><span class="las la-tachometer-alt"></span><span>Overview</span></a></li>
          <li><a href="doctorAppointment.php" class="active"><span class="las la-calendar-check"></span><span>Appointments</span></a></li>
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
      <input type="search" placeholder="Search appointments" />
    </div>
    <div class="header-icons">
      <span class="las la-bookmark"></span>
      <span class="las la-sms"></span>
    </div>
  </header>

  <main>
    <div class="page-header">
      <div>
        <h1>Appointments</h1>
        <small>View and manage upcoming appointments</small>
      </div>
      <div class="header-actions">
        <button class="export-btn" onclick="exportToCSV()">
          <span class="las la-file-export"></span> Export
        </button>
      </div>
    </div>

    <div class="appointments-grid">
      <div class="appointments-section">
        <div class="card">
          <div class="card-header">
            <h3>Upcoming Appointments</h3>
          </div>
          <div class="card-body">
            <table class="appointments-table" id="appointmentsTable">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              <?php if (mysqli_num_rows($appointments) > 0): ?>
                <?php while ($row = mysqli_fetch_assoc($appointments)):
                  $name = $row['patient_name'];
                  $pid = str_pad($row['patient_id'], 4, '0', STR_PAD_LEFT);
                  $photo = (!empty($row['patient_photo']) && file_exists("../profile_pics/user_pics/" . $row['patient_photo']))
                      ? "../profile_pics/user_pics/" . $row['patient_photo']
                      : "../profile_pics/user_pics/patient1.jpg";
                  $date = date('M j, Y', strtotime($row['appointment_date']));
                  $time = date('h:i A', strtotime($row['appointment_time']));
                  $status = ucfirst($row['status']);
                  $statusClass = strtolower($status);
                ?>
                  <tr>
                    <td class='patient-info'>
                      <img src='<?= $photo ?>' alt='<?= $name ?>'>
                      <div>
                        <h4><?= $name ?></h4>
                        <small>ID: P-<?= $pid ?></small>
                      </div>
                    </td>
                    <td><?= $date ?></td>
                    <td><?= $time ?></td>
                    <td><span class='status <?= $statusClass ?>'><?= $status ?></span></td>
                  </tr>
                <?php endwhile; ?>
              <?php else: ?>
                <tr><td colspan="4" style="text-align:center;">No upcoming appointments found.</td></tr>
              <?php endif; ?>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<script>
function exportToCSV() {
  const table = document.getElementById("appointmentsTable");
  let csv = [];
  let rows = table.querySelectorAll("tr");

  for (let row of rows) {
    let cols = row.querySelectorAll("td, th");
    let rowData = [];
    for (let col of cols) {
      rowData.push(col.innerText.trim().replace(/\n/g, " "));
    }
    csv.push(rowData.join(","));
  }

  let csvContent = csv.join("\n");
  let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  let link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", "appointments.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
</body>
</html>
