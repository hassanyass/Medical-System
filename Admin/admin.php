<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    include '../con.php';
    if(!empty($_SESSION["user_id1"])){
    $user_id = $_SESSION["user_id1"];
    $select = mysqli_query($con, "SELECT * FROM `admin` WHERE admin_id = '$user_id'") or die('query failed');

        if (mysqli_num_rows($select) > 0)
        {
            $fetch = mysqli_fetch_assoc($select);
        }
    }
    else{
    header("Location: ../login.php");
    }
?>

<?php
    $doctor_count_query = mysqli_query($con, "SELECT COUNT(*) AS total_doctors FROM doctor");
    $doctor_data = mysqli_fetch_assoc($doctor_count_query);
    $total_doctors = $doctor_data['total_doctors'];
?>

<?php
    if (isset($_POST['submit'])) {
        $name = mysqli_real_escape_string($con, $_POST['name']);
        $email = mysqli_real_escape_string($con, $_POST['email']);
        $phone = mysqli_real_escape_string($con, $_POST['phone']);
        $specialty = mysqli_real_escape_string($con, $_POST['specialty']);
        $qualifications = mysqli_real_escape_string($con, $_POST['qualifications']);
        $address = mysqli_real_escape_string($con, $_POST['address']);
        $startTime = mysqli_real_escape_string($con, $_POST['startTime']);
        $endTime = mysqli_real_escape_string($con, $_POST['endTime']);
        $status = mysqli_real_escape_string($con, $_POST['status']);
        $user_type = mysqli_real_escape_string($con, $_POST['user_type']);
        $password = mysqli_real_escape_string($con, md5($_POST['password']));
        $cpassword = mysqli_real_escape_string($con, md5($_POST['cpassword']));

        $update_image = $_FILES['img']['name'];
        $update_image_tmp_name = $_FILES['img']['tmp_name'];
        $update_image_folder = '../profile_pics/doctor_pics/' . $update_image;

        if (is_uploaded_file($update_image_tmp_name)) {
            if (move_uploaded_file($update_image_tmp_name, $update_image_folder)) {
                echo "File moved successfully to: $update_image_folder";
            } else {
                echo "move_uploaded_file() failed";
            }
        } else {
            echo "Not a valid uploaded file: $update_image_tmp_name";
        }


        if (empty($name) || empty($phone) || empty($email) || empty($_POST['password']) || empty($_POST['cpassword'])) {
            $message[] = 'All fields are required.';
        } else {
            $select = mysqli_query($con, "SELECT * FROM `doctor` WHERE email = '$email'") or die(mysqli_error($con));

            if (mysqli_num_rows($select) > 0) {
                $message[] = 'User already exists.';
            } else {
                if ($password != $cpassword) {
                    $message[] = 'Confirm password not matched!';
                } else {
                    $insert = mysqli_query($con, "INSERT INTO `doctor` (doctor_name, email, doctor_phone, doctor_specialty, doctor_qualifications, 
                    doctor_clinic_address, from_working_hours, to_working_hours, status, user_type, password, doctor_photo)

                    VALUES ('$name', '$email', '$phone', '$specialty', '$qualifications', 
                    '$address', '$startTime', '$endTime', '$status', '$user_type', '$password', '$update_image')") 
                    or die(mysqli_error($con));

                    if ($insert) {
                        if (move_uploaded_file($update_image_tmp_name, $update_image_folder)) {
                            $message[] = 'Image uploaded and doctor registered successfully!';
                            header('location:admin.php');
                            exit();
                        } else {
                            $message[] = 'Doctor registered, but image upload failed!';
                            header('location:admin.php');
                            exit();
                        }
                    } else {
                        $message[] = 'Registration failed!';
                    }
                }
            }
        }
    }
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
    <link rel="stylesheet" href="dashboardStyle.css">
    <script src="adminScriptt.js" defer></script>
</head>

<body>
    <input type="checkbox" id="nav-toggle">
    <div class="sidebar">
        <div class="sidebar-brand">
            <div class="brand-flex">
                <div class="brand-logo">
                    <i class="las la-heartbeat"></i>
                    MediCare
                </div>
                <div class="brand-icons">
                    <span class="las la-bell"></span>
                    <span class="las la-user-circle"></span>
                </div>
            </div>
        </div>
        <div class="sidebar-main">
            <div class="sidebar-doctor">
                <div class="doctor-profile">
                    <img src="img/admin.jpg" alt="admin">
                    <div class="doctor-info">
                        <h2><?php echo $fetch["admin_name"] ?></h2>
                        <p><?php echo $fetch["email"] ?></p>
                    </div>
                </div>
            </div>
            <div class="sidebar-menu">
                <div class="menu-block">
                    <div class="menu-head">
                        <span>System Management</span>
                    </div>
                    <ul>
                        <li>
                            <a href="admin.php" class="active">
                                <span class="las la-tachometer-alt"></span>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="doctors.php">
                                <span class="las la-user-md"></span>
                                <span>Manage Doctors</span>
                            </a>
                        </li>
                        <li>
                            <a href="messages.html">
                                <span class="las la-comments"></span>
                                <span>Patient Messages</span>
                            </a>
                        </li>
                        <li>
                            <a href="activity-logs.html">
                                <span class="las la-history"></span>
                                <span>Activity Logs</span>
                            </a>
                        </li>
                        <li class="logout-item">
                            <a href="../logout.php" id="logoutBtn">
                                <span class="las la-sign-out-alt"></span>
                                <span>Log Out</span>
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
                    <h1>Admin Dashboard</h1>
                    <small>System Overview and Management</small>
                </div>
                <div class="button-group">
                    <button id="addDoctorBtn">
                        <span class="las la-user-plus"></span>
                        Add New Doctor
                    </button>
                    <button>
                        <span class="las la-tools"></span>
                        Settings
                    </button>
                </div>
            </div>

            <!-- Overview Cards -->
            <div class="cards-grid">
                <div class="card">
                    <div class="card-icon">
                        <span class="las la-user-md"></span>
                    </div>
                    <div class="card-info">
                        <h2>Total Doctors</h2>
                        <h3><?php echo $total_doctors ?></h3>
                        <small>Active doctors in system</small>
                    </div>
                </div>

                <div class="card">
                    <div class="card-icon">
                        <span class="las la-users"></span>
                    </div>
                    <div class="card-info">
                        <h2>Total Patients</h2>
                        <h3>145</h3>
                        <small>Registered patients</small>
                    </div>
                </div>

                <div class="card">
                    <div class="card-icon">
                        <span class="las la-calendar-check"></span>
                    </div>
                    <div class="card-info">
                        <h2>Today's Appointments</h2>
                        <h3>28</h3>
                        <small>Across all doctors</small>
                    </div>
                </div>

                <div class="card">
                    <div class="card-icon">
                        <span class="las la-envelope"></span>
                    </div>
                    <div class="card-info">
                        <h2>New Messages</h2>
                        <h3>15</h3>
                        <small>Unread patient messages</small>
                    </div>
                </div>
            </div>

            <!-- Doctor Management Section -->
            <div class="recent-appointments">
                <div class="section-header">
                    <h2>Doctor Management</h2>
                    <a href="doctors.php" class="view-all">
                        <span class="las la-angle-right"></span>
                        View All Doctors
                    </a>
                </div>
                <div class="appointments-list">
                    <table class="appointments-table">
                        <thead>
                            <tr>
                                <th>Doctor Name</th>
                                <th>Specialty</th>
                                <th>Patients</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                $query_pag_data = "SELECT * FROM doctor
                                INNER JOIN specialty ON specialty_id = doctor_specialty";

                                $result_pag_data = mysqli_query($con, $query_pag_data);

                                $i = 1;

                                while($row = mysqli_fetch_assoc($result_pag_data))
                                {
                                    $doctor_id = $row['doctor_id'];
                                    $doctor_name = $row['doctor_name'];
                                    $specialty_name = $row['specialty_name'];
                                    $status = $row['status'];
                                    $doctor_photo = $row['doctor_photo'];
                                    ?>
                                        <tr>
                                            <td class="patient-info">
                                                    <img src="<?php echo !empty($doctor_photo) ? "../profile_pics/doctor_pics/$doctor_photo" : 'img/doctor.jpg'; ?>" alt="doctor">                                                <div>
                                                    <h4><?php echo "Dr. ", $doctor_name ?></h4>
                                                    <?php
                                                        if ($doctor_id < 10)
                                                        {
                                                            ?>
                                                                <small><?php echo "D-000", $doctor_id ?></small>
                                                            <?php
                                                        }
                                                        elseif ($doctor_id >= 10 & $doctor_id < 100)
                                                        {
                                                            ?>
                                                                <small><?php echo "D-00", $doctor_id ?></small>
                                                            <?php
                                                        }
                                                    ?>
                                                </div>
                                            </td>
                                            <td><?php echo $specialty_name ?></td>
                                            <td>45 patients</td>
                                            <?php
                                                if ($status == 1){
                                                    ?>
                                                        <td><span class="status confirmed">Active</span></td>
                                                    <?php
                                                }
                                                elseif ($status == 2){
                                                    ?>
                                                        <td><span class="status pending">Pending</span></td>
                                                    <?php
                                                }
                                            ?>
                                            <td>
                                                <div class="action-buttons">
                                                    <button class="action-btn view-btn" title="View Details">
                                                        <span class="las la-eye"></span>
                                                    </button>
                                                    <button class="action-btn edit-btn" title="Edit">
                                                        <span class="las la-edit"></span>
                                                    </button>
                                                    <button class="action-btn delete-btn" title="Remove">
                                                        <span class="las la-trash"></span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php
                                }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Add Doctor Modal -->
            <div id="addDoctorModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><span class="las la-user-md"></span> Add New Doctor</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <form id="addDoctorForm" method="post" enctype="multipart/form-data" class="modal-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="doctorName">Full Name</label>
                                <input type="text" name="name" placeholder="Enter doctor's full name" required>
                            </div>
                            <div class="form-group" hidden>
                                <input type="text" name="password" value="123" required>
                                <input type="text" name="cpassword" value="123" required>
                                <input type="text" name="user_type" value="2" required>
                                <input type="text" name="status" value="1" required>
                            </div>
                            <div class="form-group">
                                <label for="doctorEmail">Email</label>
                                <input type="email" name="email" placeholder="Enter doctor's email" required>
                            </div>
                            <div class="form-group">
                                <label for="doctorPhone">Phone Number</label>
                                <input type="tel" name="phone" placeholder="Enter phone number" required>
                            </div>
                            <div class="form-group">
                                <label>Specialty</label>
                                <select name="specialty" required>
                                    <option value="">Select Specialty</option>

                                    <?php
                                        $sql = mysqli_query($con, "SELECT * FROM specialty ORDER BY specialty_id");
            
                                        while($row = mysqli_fetch_array($sql))
                                        {
                                            ?>
                                            <option value="<?php echo $row['specialty_id']; ?>">
                                            <?php echo $row['specialty_name'];?>
                                            </option>
                                            <?php
                                        }
                                    ?>
                                </select>
                            </div>
                        </div>
                        <div class="form-full">
                            <div class="form-group">
                                <label for="doctorQualifications">Qualifications</label>
                                <textarea name="qualifications" rows="3" 
                                    placeholder="Enter doctor's qualifications, certifications, and experience" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="doctorAddress">Clinic Address</label>
                                <textarea name="address" rows="2" 
                                    placeholder="Enter clinic/practice address" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="doctorSchedule">Working Hours</label>
                                <div class="schedule-grid">
                                    <input type="time" id="startTime" name="startTime" required>
                                    <span>to</span>
                                    <input type="time" id="endTime" name="endTime" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="doctorImage">Profile Image</label>
                                <div class="image-upload">
                                    <input type="file" id="doctorImage" name="img" accept="image/*">
                                    <img id="imagePreview" name="img" src="" alt="Preview" style="display: none;">
                                    <label for="doctorImage" class="upload-label">
                                        <span class="las la-cloud-upload-alt"></span>
                                        Choose Image
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" name="submit" class="btn-primary">
                                <span class="las la-save"></span> Add Doctor
                            </button>
                            <button type="button" class="btn-secondary close-modal">
                                <span class="las la-times"></span> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</body>
</html> 