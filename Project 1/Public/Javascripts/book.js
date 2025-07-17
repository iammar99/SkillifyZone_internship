// ---------------- Year ----------------
const year = new Date
if (document.getElementById("year")) {
    document.getElementById("year").innerHTML = year.getFullYear()
}


// ---------------- Toastify ----------------

const showToast = (text, success) => {
    if (!success) {
        var background = "linear-gradient(to right,rgb(176, 41, 0),rgb(242, 73, 0))"
    }
    else {
        var background = "linear-gradient(to right, #4CAF50, #388E3C)"
    }
    Toastify({
        text: text,
        className: "info",
        style: {
            background: background,
        }
    }).showToast();
}

// ---------------- Form Validation (Book) ----------------



const bookingForm = document.querySelector(".booking-form");


bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault()

    function formatTimeWithAmPm(timeStr) {
        if (!timeStr) return "";
        const [hourStr, minuteStr] = timeStr.split(":");
        const hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minuteStr} ${ampm}`;
    }

    const name = bookingForm.name.value.trim()
    const date = bookingForm.date.value.trim(); 
    const time = bookingForm.time.value.trim()
    const formattedTime = formatTimeWithAmPm(time);
    const count = bookingForm.count.value.trim()
    if (!name || !date || !formattedTime || !count) {
        showToast("Fill all inputs", false)
        return
    }


    if (count > 20) {
        showToast("Guest can't be more than 20 !! Book more tables", false)
        return
    }



    const response = await fetch("/book", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, date, formattedTime, count })
    })

    const result = await response.json()
    if (result.success) {
        showToast(result.message, result.success)
        setTimeout(() => {
            window.location.href = `/${result.redirect}`
        }, 100)
    }

})

