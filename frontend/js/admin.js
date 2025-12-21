// js/admin.js
document.addEventListener("DOMContentLoaded", () => {

    // Admin dashboard table
    const adminTable = document.getElementById("adminComplaintsTable");
    if (adminTable) {
        apiRequest("/admin/all", "GET").then((data) => {
            if (data.error) return adminTable.innerHTML = `<tr><td colspan="4">${data.error}</td></tr>`;
            adminTable.innerHTML = "";
            data.data.forEach(c => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${c.title}</td>
                    <td>${c.status}</td>
                    <td>${c.category}</td>
                    <td><a href="complaintDetails.html?id=${c._id}">View</a></td>
                `;
                adminTable.appendChild(row);
            });
        });
    }

    // Admin complaint details page
    const detailsContainer = document.getElementById("adminDetailsContainer");
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
                <label>Update Status:</label>
                <select id="statusSelect">
                    <option ${c.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option ${c.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option ${c.status === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
                <button id="updateBtn">Update Status</button>
            `;
            document.getElementById("updateBtn").addEventListener("click", async () => {
                const newStatus = document.getElementById("statusSelect").value;
                const result = await apiRequest("/admin/update", "POST", { complaintId: id, newStatus });
                if (result.error) return alert(result.error);
                alert("Status updated successfully!");
                location.reload();
            });
        });
    }

});
