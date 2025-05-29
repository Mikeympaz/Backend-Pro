function buttonClick() {
    alert("Your booking has been submitted!");
}

// ✅ Store User ID after successful login
document.getElementById("loginForm")?.addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const backendURL = "https://hostel-management-teal.vercel.app"; // ✅ Updated Backend URL

    try {
        const response = await fetch(`${backendURL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.user && data.user.id) {
            localStorage.setItem("user_id", data.user.id); // ✅ Store User ID after login
            alert("Login successful!");
            window.location.href = "dashboard.html"; // ✅ Redirect user after login
        } else {
            alert("Invalid email or password. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});
document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("user_id");

    if (userId) {
        const userInput1 = document.getElementById("user_id");
        const userInput2 = document.getElementById("user_id_payment");

        if (userInput1) userInput1.value = userId;
        if (userInput2) userInput2.value = userId;
    } else {
        console.warn("No user_id found in localStorage. Please log in.");
    }

    // ✅ STEP 2: Fetch and populate room dropdown
    const roomSelect = document.getElementById("room_id");
    const backendURL = "http://localhost:5000"; // Use your actual backend base URL

    try {
        const response = await fetch(`${backendURL}/api/rooms/available`);
        const rooms = await response.json();

        console.log("🔍 Rooms fetched:", rooms);

        if (!rooms || rooms.length === 0) {
            roomSelect.innerHTML = "<option>No rooms available</option>";
            return;
        }

        roomSelect.innerHTML = "";

        rooms.forEach(room => {
            const option = document.createElement("option");
            option.value = room.id;
            option.textContent = `Room ${room.room_number} - $${room.price}`;
            roomSelect.appendChild(option);
        });

        console.log("✅ Rooms added to dropdown.");
    } catch (error) {
        console.error("❌ Error fetching rooms:", error);
        roomSelect.innerHTML = "<option>Error loading rooms</option>";
    }
});



// ✅ Room Booking Request
document.getElementById("bookingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const user_id = document.getElementById("user_id").value.trim();
    const room_id = document.getElementById("room_id").value;
    const check_in_date = document.getElementById("check_in_date").value;
    const check_out_date = document.getElementById("check_out_date").value;
    const backendURL = "https://hostel-management-teal.vercel.app"; // ✅ Updated Backend URL

    if (!user_id || !room_id || !check_in_date || !check_out_date) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch(`${backendURL}/api/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, room_id, check_in_date, check_out_date })
        });

        const data = await response.json();
        alert(data.message || "Booking Successful!");
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});

// ✅ Payment Request - Includes Auto-Fill of Transaction ID
document.getElementById("paymentForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const user_id = document.getElementById("user_id_payment").value.trim();
    const booking_id = document.getElementById("booking_id").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const backendURL = "https://hostel-management-teal.vercel.app"; // ✅ Updated Backend URL

    if (!user_id || !booking_id || !amount) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch(`${backendURL}/api/payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, booking_id, amount })
        });

        const data = await response.json();

        console.log("Received Transaction ID:", data.transaction_id); // ✅ Debugging

        // ✅ Ensure Transaction ID exists before autofilling
        if (data.transaction_id && data.transaction_id.trim() !== "") {
            document.getElementById("transaction_id").value = data.transaction_id;
        } else {
            console.error("❌ Transaction ID is missing! Check backend response.");
            alert("Warning: Transaction ID not received. Please verify payment status.");
        }

        alert(data.message);
    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Something went wrong. Please try again.");
    }
});
