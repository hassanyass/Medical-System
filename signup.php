<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    include 'con.php';

    $message = [];

    // Preserve form input values
    $name = '';
    $phone = '';
    $email = '';

    if (isset($_POST['submit'])) {
        $name = mysqli_real_escape_string($con, $_POST['name']);
        $phone = mysqli_real_escape_string($con, $_POST['phone']);
        $email = mysqli_real_escape_string($con, $_POST['email']);
        $user_type = mysqli_real_escape_string($con, $_POST['user_type']);
        $password = mysqli_real_escape_string($con, md5($_POST['password']));
        $cpassword = mysqli_real_escape_string($con, md5($_POST['cpassword']));

        if (empty($name) || empty($phone) || empty($email) || empty($_POST['password']) || empty($_POST['cpassword'])) {
            $message[] = 'All fields are required.';
        } else {
            $select = mysqli_query($con, "SELECT * FROM `patient` WHERE email = '$email'") or die(mysqli_error($con));

            if (mysqli_num_rows($select) > 0) {
                $message[] = 'User already exists.';
            } else {
                if ($password != $cpassword) {
                    $message[] = 'Confirm password not matched!';
                } else {
                    $insert = mysqli_query($con, "INSERT INTO `patient` (patient_name, patient_phone, email, password, user_type) 
                                                VALUES ('$name', '$phone', '$email', '$password', '$user_type')") or die(mysqli_error($con));

                    if ($insert) {
                        $message[] = 'Registered successfully!';
                        $name = $phone = $email = '';
                    } else {
                        $message[] = 'Registration failed!';
                    }
                }
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Signup</title>
        <link rel="stylesheet" href="style.css">
        <!-- <script type="text/javascript" src="validation.js" defer></script> -->
    </head>

    <body>
        <div class="wrapper">
            <h1>Signup</h1>

            <?php
            if (!empty($message)) {
                foreach ($message as $msg) {
                    echo '<p class="error" id = "error-message">' . $msg . '</p>';
                }
            }
            ?>

            <form method="post" enctype="multipart/form-data">
                <div>
                    <label for="name-input">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                        </svg>
                    </label>
                    <input type="text" name="name" placeholder="Name" value="<?= htmlspecialchars($name) ?>">
                </div>
                <input type="hidden" name="user_type" value="3">
                <div>
                    <label for="phone-input">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/>
                        </svg>
                    </label>
                    <input type="text" name="phone" placeholder="Phone" value="<?= htmlspecialchars($phone) ?>">
                </div>
                <div>
                    <label for="email-input">@</label>
                    <input type="email" name="email" placeholder="Email" value="<?= htmlspecialchars($email) ?>">
                </div>
                <div>
                    <label for="password-input">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
                        </svg>
                    </label>
                    <input type="password" name="password" placeholder="Password">
                </div>
                <div>
                    <label for="repeat-password-input">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
                        </svg>
                    </label>
                    <input type="password" name="cpassword" placeholder="Confirm Password">
                </div>
                <button type="submit" name="submit">Signup</button>
            </form>

            <p>Already have an account? <a href="login.php">Login</a></p>
        </div>
    </body>
</html>