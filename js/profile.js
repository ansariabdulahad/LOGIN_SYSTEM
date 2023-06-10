window.onload = () => {
    verifyToken(); // calling...
    logout(); // calling...
}

const verifyToken = () => {
    const token = location.href.split("?")[1];
    const ajax = new XMLHttpRequest();

    ajax.open("POST", "http://localhost:8080/api/verifyToken", true);
    ajax.send(token);

    // GET RESPONSE 
    ajax.onload = () => {
        // console.log("AJAX VERIFY TOKEN RESPONSE >>>", JSON.parse(ajax.response));
        const response = JSON.parse(ajax.response);

        if (response.isVerified) {
            $(".loader").addClass("d-none");
            $(".profile-page").removeClass("d-none");
        }
        else {
            localStorage.removeItem("__token");
            localStorage.removeItem("__secret_id");
            window.location = "http://localhost:8080";
        }
    }
}

// LOGOUT BTN CODING
const logout = () => {
    const logoutBtn = document.querySelector(".logout-btn");

    logoutBtn.onclick = () => {
        localStorage.removeItem("__token");
        localStorage.removeItem("__secret_id");
        window.location = "http://localhost:8080";
    }
}