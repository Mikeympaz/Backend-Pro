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

document.addEventListener("DOMContentLoaded", async function() {
    const user_id = localStorage.getItem("user_id");
    const roomSelect = document.getElementById("room_id");
    const backendURL = "https://hostel-management-teal.vercel.app"; // ✅ Updated Backend URL

    if (!user_id) {
        console.warn("No user logged in. Booking ID won't auto-fill.");
        return;
    }

    document.getElementById("user_id_payment").value = user_id;
    document.getElementById("user_id").value = user_id; // ✅ Auto-Fill User ID in Forms

    // ✅ Load Available Rooms into Dropdown
    try {
        const response = await fetch(`${backendURL}/api/rooms/available`);
        const rooms = await response.json();

        if (!rooms || rooms.length === 0) {
            roomSelect.innerHTML = "<option>No rooms available</option>"; // ✅ Handle empty list
            return;
        }

        roomSelect.innerHTML = ""; // ✅ Clear previous options

        rooms.forEach(room => {
            const option = document.createElement("option");
            option.value = room.id;
            option.textContent = `Room ${room.room_number} - $${room.price}`;
            roomSelect.appendChild(option);
        });

        console.log("Rooms successfully added to dropdown.");
    } catch (error) {
        console.error("Error fetching rooms:", error);
        roomSelect.innerHTML = "<option>Error loading rooms</option>";
    }

    // ✅ Fetch and Autofill Booking ID
    try {
        const response = await fetch(`${backendURL}/api/bookings/latest?user_id=${user_id}`);
        const booking = await response.json();

        if (booking.id) {
            document.getElementById("booking_id").value = booking.id; // ✅ Autofill Booking ID
        } else {
            console.warn("No recent booking found. Creating a new one...");

            const newBookingResponse = await fetch(`${backendURL}/api/bookings/new`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id })
            });

            const newBooking = await newBookingResponse.json();

            if (newBooking.id) {
                document.getElementById("booking_id").value = newBooking.id; // ✅ Assign new Booking ID
            } else {
                console.error("Failed to create a new booking.");
            }
        }
    } catch (error) {
        console.error("Error fetching or creating booking:", error);
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
