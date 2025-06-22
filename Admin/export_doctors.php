<?php
include '../con.php'; // adjust path if needed

header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=doctors_export.xls");
header("Pragma: no-cache");
header("Expires: 0");

echo "<table border='1'>";
echo "<tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Specialty</th>
        <th>Qualifications</th>
        <th>Address</th>
        <th>From</th>
        <th>To</th>
        <th>Status</th>
      </tr>";

$query = mysqli_query($con, "
    SELECT doctor.*, specialty.specialty_name 
    FROM doctor 
    INNER JOIN specialty ON doctor_specialty = specialty.specialty_id
");

while($row = mysqli_fetch_assoc($query)) {
    echo "<tr>
            <td>{$row['doctor_id']}</td>
            <td>{$row['doctor_name']}</td>
            <td>{$row['email']}</td>
            <td>{$row['doctor_phone']}</td>
            <td>{$row['specialty_name']}</td>
            <td>{$row['doctor_qualifications']}</td>
            <td>{$row['doctor_clinic_address']}</td>
            <td>{$row['from_working_hours']}</td>
            <td>{$row['to_working_hours']}</td>
            <td>" . ($row['status'] == 1 ? 'Active' : ($row['status'] == 2 ? 'Pending' : 'Inactive')) . "</td>
          </tr>";
}
echo "</table>";
?>
