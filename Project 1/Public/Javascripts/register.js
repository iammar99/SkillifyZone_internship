
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




// ---------------- Form Validation (Register) ----------------



const registerForm = document.querySelector(".form-register");

registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();


    const email = registerForm.email.value.trim();
    const password = registerForm.password.value.trim();
    const username = registerForm.username.value.trim();
    const confirmPassword = registerForm.confirmPassword.value.trim();


    if (registerForm.username) {

        if (!email || !username || !password || !confirmPassword) {
            showToast("Fill all Inputs", false)

            return;
        }

        if (password !== confirmPassword) {
            showToast("Password Doesn't Matched", false)
            return;
        }
    }

    // Handling Error 

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password })
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

