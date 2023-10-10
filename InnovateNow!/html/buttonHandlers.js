function handleSubmitButton() {
    let userText = document.getElementById("userTextField").value;
    let textDiv = document.getElementById("text-area");
    textDiv.innerHTML = "";

    if (userText && userText !== "") {
        let userRequestObj = {
            text: userText,
        };

        let userRequestJSON = JSON.stringify(userRequestObj);

        // Create a new XMLHttpRequest
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("typeof: " + typeof this.responseText);
                console.log("data: " + this.responseText);

                // Parse the response as JSON
                let responseObj = JSON.parse(this.responseText);

                if (responseObj.success) {
                    // Registration was successful, you can display a success message or redirect to another page
                    alert("Registration successful!");
                    // Clear the user text field
                    document.getElementById("userTextField").value = "";

                    // Redirect to credentials.html
                    window.location.href = "/credentials.html";
                } else {
                    // Registration failed, display an error message
                    alert("Registration failed: " + responseObj.message);
                }
            }
        };

        // Open a POST request to the registration endpoint
        xhttp.open("POST", "/register", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        // Send the JSON data to the server
        xhttp.send(userRequestJSON);
    }
}
