
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



// ---------------- Form Validation (Login) ----------------

const loginForm = document.querySelector(".form-login");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();


    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();


    if (!email || !password) {
        showToast("Fill all Inputs", false)
        return;
    }


    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            showToast(result.message, true)
            setTimeout(() => {
                window.location.href = `/${result.redirect}`;
            }, 1500);

        } else {
            showToast(result.message, false)
            setTimeout(() => {
                window.location.href = `/${result.redirect}`;
            }, 1500);
        }

    } catch (error) {
        showToast("Something went wrong", false)
    }


});
