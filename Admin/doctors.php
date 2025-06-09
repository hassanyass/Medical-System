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
                            header('location:doctors.php');
                            exit();
                        } else {
                            $message[] = 'Doctor registered, but image upload failed!';
                            header('location:doctors.php');
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
    <title>Manage Doctors - Admin Dashboard</title>
    <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
    <link rel="stylesheet" href="dashboardStyle.css">
    <link rel="stylesheet" href="adminStyle.css">
    <script src="logout.js" defer></script>
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
                        <h2>Admin Panel</h2>
                        <p>admin@medicalsystem.com</p>
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
                            <a href="admin.php">
                                <span class="las la-tachometer-alt"></span>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="doctors.php" class="active">
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
                            <a href="#" id="logoutBtn">
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
                <input type="search" placeholder="Search doctors...">
            </div>
            <div class="header-icons">
                <span class="las la-bookmark"></span>
                <span class="las la-sms"></span>
            </div>
        </header>

        <main>
            <div class="page-header">
                <div>
                    <h1>Manage Doctors</h1>
                    <small>View and manage all doctors in the system</small>
                </div>
                <div class="header-actions">
                    <div class="filter-wrapper">
                        <!-- <select id="specialtyFilter" class="filter-select">
                            <option value="">All Specialties</option>
                            <option value="General Medicine">General Medicine</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="Orthopedics">Orthopedics</option>
                        </select> -->
                        <select id="specialtyFilter" class="filter-select">
                                    <option value="">Select Specialty</option>

                                    <?php
                                        $sql = mysqli_query($con, "SELECT * FROM specialty ORDER BY specialty_id");
            
                                        while($row = mysqli_fetch_array($sql))
                                        {
                                            ?>
                                            <option value="<?php echo $row['specialty_name']; ?>">
                                            <?php echo $row['specialty_name'];?>
                                            </option>
                                            <?php
                                        }
                                    ?>
                                </select>
                        <select id="statusFilter" class="filter-select">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <!-- <option value="inactive">Inactive</option> -->
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <button id="addDoctorBtn" class="btn-primary">
                        <span class="las la-user-plus"></span>
                        Add New Doctor
                    </button>
                </div>
            </div>

            <div class="doctors-grid">
    <?php
    $query_doctors = "SELECT doctor.*, specialty.specialty_name 
                      FROM doctor 
                      INNER JOIN specialty ON specialty_id = doctor_specialty";
    $result_doctors = mysqli_query($con, $query_doctors);

    while($row = mysqli_fetch_assoc($result_doctors)) {
        $doctor_id = $row['doctor_id'];
        $doctor_name = $row['doctor_name'];
        $specialty_name = $row['specialty_name'];
        $status = $row['status'];
        $doctor_photo = $row['doctor_photo'];
        $email = $row['email'];
        $phone = $row['doctor_phone'];
        ?>
        <div class="doctor-card" data-id="<?php echo $doctor_id; ?>" 
             data-specialty="<?php echo htmlspecialchars($specialty_name); ?>" 
             data-status="<?php echo ($status == 1 ? 'active' : ($status == 2 ? 'pending' : 'inactive')); ?>">
            <div class="doctor-header">
                <img src="<?php echo !empty($doctor_photo) ? "../profile_pics/doctor_pics/$doctor_photo" : 'img/doctor.jpg'; ?>" alt="<?php echo htmlspecialchars($doctor_name); ?>">
                <div class="status-badge <?php echo ($status == 1 ? 'active' : ($status == 2 ? 'pending' : 'inactive')); ?>">
                    <?php echo ($status == 1 ? 'active' : ($status == 2 ? 'pending' : 'inactive')); ?>
                </div>
            </div>
            <div class="doctor-info">
                <h3><?php echo htmlspecialchars($doctor_name); ?></h3>
                <p class="specialty"><?php echo htmlspecialchars($specialty_name); ?></p>
                <p class="stats">
                    <span><i class="las la-user-friends"></i> 45 Patients</span>
                    <span><i class="las la-calendar-check"></i> 8 Today</span>
                </p>
                <div class="contact-info">
                    <p><i class="las la-envelope"></i> <?php echo htmlspecialchars($email); ?></p>
                    <p><i class="las la-phone"></i> <?php echo htmlspecialchars($phone); ?></p>
                </div>
            </div>
            <div class="doctor-actions">
                <button class="btn-view" title="View Details" onclick="viewDoctor(<?php echo $doctor_id; ?>)">
                    <span class="las la-eye"></span>
                </button>
                <button class="btn-edit" title="Edit" onclick="editDoctor(<?php echo $doctor_id; ?>)">
                    <span class="las la-edit"></span>
                </button>
                <button class="btn-delete" title="Remove" onclick="deleteDoctor(<?php echo $doctor_id; ?>)">
                    <span class="las la-trash"></span>
                </button>
            </div>
        </div>
    <?php
    }
    ?>
</div>


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
    <script src="doctorsScriptttd.js"></script>
</body>
</html> 