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



// ---------------- Textare Resizer ----------------


function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}



// ---------------- Form Validation (Review) ----------------


const reviewForm = document.querySelector("#review-form");

reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reviewText = reviewForm.floatingTextarea.value;
    const rating = reviewForm.querySelector('input[name="rating"]:checked')?.value;


    if (!reviewText || !rating) {
        showToast("Fill all inputs", false)
        return
    }

    const response = await fetch("/review", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewText, rating })
    })

    const result = await response.json()
    if(result.success){
        showToast("Thanks for sharing your thoughts",true)
        setTimeout(()=>{
            window.location.href = "/"
        },1500)
    }
    else{
        showToast("Something went wrong",false)
    }
    console.log(result)

});
