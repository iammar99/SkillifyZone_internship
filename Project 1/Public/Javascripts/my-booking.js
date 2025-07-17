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



// ---------------- Form Validation (Edit) ----------------

document.querySelectorAll(".editForm").forEach(editForm => {
    editForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        function formatTimeWithAmPm(timeStr) {
            if (!timeStr) return "";
            const [hourStr, minuteStr] = timeStr.split(":");
            const hour = parseInt(hourStr, 10);
            const ampm = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minuteStr} ${ampm}`;
        }

        const action = new URL(editForm.action).pathname;
        const id = action.split("/")[action.split("/").length - 1]
        const name = editForm.name.value.trim();
        const date = editForm.date.value.trim();
        const time = editForm.time.value.trim();
        const formattedTime = formatTimeWithAmPm(time);
        const count = editForm.count.value.trim();

        if(count > 20){
            showToast("Guest for one table can be till 20")
            return
        }

        try {
            const response = await fetch(action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, date, formattedTime, count, id })
            })

            const result = await response.json()
            if (result.success) {
                showToast("Reservation Updated", result.success)
                setTimeout(() => {
                    window.location.href = "/my-booking"
                }, 1500)
            }
        } catch (error) {
            console.log(error)
        }
    });
});



