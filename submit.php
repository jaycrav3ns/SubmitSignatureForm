<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assuming the signature data is sent as a data URL
    $signatureData = $_POST['signature'];

    // Extract the base64-encoded image data
    $data = explode(',', $signatureData);
    $imageData = base64_decode($data[1]);

    // Extract the name from the form data
    $name = $_POST['name'];

    // Sanitize the name to remove any potential special characters
    $sanitizedName = preg_replace("/[^A-Za-z0-9]/", '', $name);

    // Generate a unique filename with the sanitized name and timestamp
    $filename = './signatures/' . $sanitizedName . '_' . time() . '.png';

    // Save the image to the specified folder
    file_put_contents($filename, $imageData);

    // Other form data (title, etc.) can be accessed similarly
    $title = $_POST['title'];

    // Additional processing or storage of form data as needed

    // Respond with success or any additional information
    echo json_encode(['success' => true, 'filename' => $filename]);
} else {
    // Handle non-POST requests as needed
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
