<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    include 'con.php';

    if (!empty($_SESSION["user_id1"])) 
    {
        header("Location: Admin/admin.php");
    }
    else if (!empty($_SESSION["user_id2"])) 
    {
        header("Location: Doctor/dashboard.php");
    }
    else if (!empty($_SESSION["user_id3"])) 
    {
        header("Location: Patient/user.php");
    }

    if (isset($_POST["submit"])) 
    {
        $email = mysqli_real_escape_string($con, $_POST['email']);
        $password = mysqli_real_escape_string($con, md5($_POST['password']));

        $select = mysqli_query($con, "SELECT * FROM `admin` WHERE email = '$email' AND password = '$password'")
        or die('query failed');

        $select2 = mysqli_query($con, "SELECT * FROM `doctor` WHERE email = '$email' AND password = '$password'")
        or die('query failed');

        $select3 = mysqli_query($con, "SELECT * FROM `patient` WHERE email = '$email' AND password = '$password'")
        or die('query failed');

        $row = mysqli_fetch_assoc($select);
        $row2 = mysqli_fetch_assoc($select2);
        $row3 = mysqli_fetch_assoc($select3);

        if (mysqli_num_rows($select) > 0) 
        {
            if ($row['user_type'] == '1') 
            {
                $_SESSION["login"] = true;
                $_SESSION['user_id1'] = $row['admin_id'];
                header('location:Admin/admin.php');
            }
        }
        else if (mysqli_num_rows($select2) > 0) 
        {
            if ($row2['user_type'] == '2') 
            {
                $_SESSION["login"] = true;
                $_SESSION['user_id2'] = $row2['doctor_id'];
                header('location:Doctor/dashboard.php');
            }
        }
        else if (mysqli_num_rows($select3) > 0) 
        {
            if ($row3['user_type'] == '3') 
            {
                $_SESSION["login"] = true;
                $_SESSION['user_id3'] = $row3['patient_id'];
                header("Location: Patient/user.php");
            }
        }
        else 
        {
            $message[] = 'incorrect user name or password!';
        }
    }
?>

<!DOCTYPE html>

<html lang ="en">
    <head>
        <meta charset ="UT-8">
        <meta name ="viewport" content = "width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link rel = "stylesheet" href= "style.css">
        <!-- <script type="text/javascript" src="validation.js" defer></script> --> 
    </head>

    <body>
        <div class = "wrapper">
            <h1>Login</h1>

            <?php
                if (!empty($message)) {
                    foreach ($message as $msg) {
                        echo '<p class="error" id = "error-message">' . $msg . '</p>';
                    }
                }
            ?>

            <form method="post" enctype="multipart/form-data">
                <div>
                    <label for="email-input">
                        <span>@</span>
                    </label>
                    <input type = "email" name ="email" id = "email-input" placeholder="Email">
                </div>
                <div>
                    <label for ="password-input">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>
                    </label>
                    <input type = "password" name ="password" id = "password-input" placeholder="Password">
                </div>
            
                <button name="submit" type = "submit">Login</button>
                
            </form>
            <p>New here? <a href ="signup.php">Create an Account</a></p>
        </div>
    </body>
</html>