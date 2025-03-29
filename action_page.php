<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['yourname'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];

    // Format the data as JSON
    $data = [
        "name" => $name,
        "email" => $email,
        "subject" => $subject,
        "date" => date("Y-m-d H:i:s")
    ];
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);

    // GitHub Repository Information
    $githubRepo = "your-username/your-repo";  // Change this to your repo
    $githubToken = "your_github_personal_access_token";  // Generate from GitHub Settings
    $fileName = "contact_data_" . time() . ".json"; // Unique file name

    // GitHub API URL to create a new file
    $githubUrl = "https://api.github.com/repos/$githubRepo/contents/$fileName";

    // Prepare data for GitHub API request
    $postData = json_encode([
        "message" => "New contact form submission",
        "content" => base64_encode($jsonData),
    ]);

    // Send data to GitHub
    $ch = curl_init($githubUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: token $githubToken",
        "User-Agent: PHP Script",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

    $response = curl_exec($ch);
    curl_close($ch);

    // Redirect back to the form page
    header("Location: thank_you.html");  // Create a simple thank you page
    exit();
}
?>
