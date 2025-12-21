// js/auth.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const data = await apiRequest("/auth/login", "POST", { email, password });

            if (data.error) return alert(data.error);

            sessionStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "administration") {
                window.location.href = "../admin/dashboard.html";
            } else {
                window.location.href = "../citizen/dashboard.html";
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const user = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                confirmPassword: document.getElementById("confirmPassword").value,
                role: document.getElementById("role").value,
            };

            const data = await apiRequest("/auth/signup", "POST", user);

            if (data.error) return alert(data.error);

            alert("Signup successful! You can now login.");
            window.location.href = "login.html";
        });
    }

    // Logout button if exists
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
});
