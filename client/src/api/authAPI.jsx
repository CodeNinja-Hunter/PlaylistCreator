// Function to send a POST request to the '/auth/login' endpoint with user login information
const login = async (userInfo) => {
  try {
    // Send a POST request to '/auth/login' with user login information in JSON format
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Raw response:", responseText);

    // Throw error if response status is not OK (200-299)
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText); // Attempt to parse error as JSON
        throw new Error(`Error: ${errorData.message || "Unknown server error"}`);
      } catch (jsonErr) {
        throw new Error(`Server returned status ${response.status}: ${responseText || "No response body"}`);
      }
    }

    // Parse the response body as JSON
    let data;
    try {
      data = JSON.parse(responseText); // Use the already-fetched text
    } catch (jsonErr) {
      throw new Error("Failed to parse response as JSON: Unexpected end of input");
    }

    return data; // Return the data received from the server
  } catch (err) {
    console.error("Error from user login:", err); // Log the full error
    return Promise.reject("Could not fetch user info"); // Return a rejected promise
  }
};

export { login }; // Export the login function