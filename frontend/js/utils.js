// js/utils.js
const BASE_URL = "http://localhost:3000"; // Adjust as needed

// Generic API request
async function apiRequest(endpoint, method = "GET", body = null, isForm = false) {
    const options = { method, credentials: "include" };

    if (isForm) {
        options.body = body;
    } else if (body) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return response.json();
}

// Check if logged in
function checkAuth(role = null) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        window.location.href = "../auth/login.html";
    }
    if (role && user.role !== role) {
        alert("You are not authorized for this page");
        window.location.href = role === "administration" ? "../admin/dashboard.html" : "../citizen/dashboard.html";
    }
}

// Logout function
async function logout() {
    await apiRequest("/auth/logout", "POST");
    sessionStorage.clear();
    window.location.href = "../auth/login.html";
}
