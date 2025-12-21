// js/complaint.js
document.addEventListener("DOMContentLoaded", () => {

    // Register complaint
    const complaintForm = document.getElementById("complaintForm");
    if (complaintForm) {
        complaintForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(complaintForm);
            const data = await apiRequest("/complaint/register", "POST", formData, true);
            if (data.error) return alert(data.error);
            alert("Complaint registered successfully!");
            window.location.href = "dashboard.html";
        });
    }

    // Load my complaints
    const complaintsTable = document.getElementById("complaintsTable");
    if (complaintsTable) {
        apiRequest("/complaint/my", "GET").then((data) => {
            if (data.error) return complaintsTable.innerHTML = `<tr><td colspan="4">${data.error}</td></tr>`;
            complaintsTable.innerHTML = "";
            data.data.forEach(c => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${c.title}</td>
                    <td>${c.status}</td>
                    <td>${c.category}</td>
                    <td><a href="complaintDetails.html?id=${c._id}">View</a></td>
                `;
                complaintsTable.appendChild(row);
            });
        });
    }

    // Complaint details page
    const detailsContainer = document.getElementById("detailsContainer");
    if (detailsContainer) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        apiRequest(`/complaint/details/${id}`, "GET").then((data) => {
            if (data.error) return detailsContainer.innerHTML = `<p>${data.error}</p>`;
            const c = data.data;
            detailsContainer.innerHTML = `
                <h2>${c.title}</h2>
                <p><strong>Category:</strong> ${c.category}</p>
                <p><strong>Location:</strong> ${c.location}</p>
                <p><strong>Status:</strong> ${c.status}</p>
                <p>${c.description}</p>
                <div id="images">
                    ${c.images.map(img => `<img src="${img.url}" class="thumb">`).join("")}
                </div>
            `;
        });
    }

});
