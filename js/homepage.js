// const showMessage = require('../constant/showMessage.constant');

// GLOBAL VARIABLES
const loginEmailEl = document.querySelector('#login-email');
const loginPassEl = document.querySelector('#login-password');
const checkBox = document.querySelector('#remember-me');

window.onload = () => {

    signupRequest();
    rememberMe();
    showUser();
    autoLogin();
}

// SIGNUP REQUEST CODING
const signupRequest = () => {

    let form = document.querySelector('#signup-form');

    form.onsubmit = function (e) {
        e.preventDefault();

        // Preparing Form Data
        const formData = JSON.stringify({
            name: document.querySelector("#name").value,
            email: document.querySelector("#email").value,
            mobile: document.querySelector("#mobile").value,
            password: document.querySelector("#password").value,
        })

        const ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:8080/api/signup', true);
        ajax.send(formData);

        ajax.onreadystatechange = () => {
            if (ajax.readyState == 2) {
                $('.loader').removeClass('d-none');
            }
        }

        ajax.onload = () => {

            $('.loader').addClass('d-none');
            const data = JSON.parse(ajax.response);

            if (data.message.toLowerCase() === 'collection found') {

                let msg = 'User Already Exists !';
                let icon = 'fas fa-exclamation-circle';
                let color = 'red';

                showMessage(msg, icon, color);
            }
            else {

                let msg = 'Signup Success !';
                let icon = 'fas fa-check-circle';
                let color = 'green';

                showMessage(msg, icon, color);

                form.reset();
            }
        }
    }
}

// LOGIN REQUEST CODING
const rememberMe = () => {
    const form = document.querySelector('#login-form');

    form.onsubmit = function (e) {
        e.preventDefault();

        const userInfo = JSON.stringify({
            username: loginEmailEl.value,
            password: loginPassEl.value
        });

        if (checkBox.checked) {

            localStorage.setItem('userInfo', userInfo);
            loginRequest(userInfo); // calling...
        }
        else {

            loginRequest(userInfo); // calling...
        }
    }
}

// SHOW USER INFO CODING
const showUser = () => {

    if (localStorage.getItem('userInfo') != null) {

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        loginEmailEl.value = userInfo.username;
        loginPassEl.value = userInfo.password;
        checkBox.checked = true;
    }

}

// LOGIN REQUEST FUNCTION CODING
const loginRequest = (userInfo) => {

    const ajax = new XMLHttpRequest();
    const apiUrl = 'http://localhost:8080/api/login';

    ajax.open('POST', apiUrl, true);
    ajax.send(userInfo);

    // SHOW LOADER
    ajax.onreadystatechange = () => {
        if (ajax.readyState == 2) {
            $(".loader").removeClass("d-none");
        }
    }

    // GET RESPONSE
    ajax.onload = () => {

        // HIDE LOADER
        $(".loader").addClass("d-none");

        const response = JSON.parse(ajax.response);
        console.log("AJAX LOGIN REQUEST >>>", response);
        if (response.isLoged) {

            // LOGIN SUCCESS

            const isVerified = verifyToken(response.token, apiUrl);

            if (isVerified) {

                // STORE VERIFIED JWT TOKEN INTO LOCALSTORAGE
                localStorage.setItem("__token", response.token);
                localStorage.setItem("__secret_id", response.secret_id);
                window.location = "/profile?token=" + response.token + "&secretId=" + response.secret_id;
            }
            else {

                showMessage(
                    "Authentication failed !",
                    "fa fa-exclamation-circle mx-1",
                    "red"
                )
            }
        }
        else {

            showMessage(
                response.message,
                "fa fa-exclamation-circle mx-1",
                "red"
            )
        }
    }
}

// VERIFY TOKEN 
const verifyToken = (token, apiUrl) => {

    const jwt = JSON.parse(atob(token.split(".")[1]));

    if (jwt.iss == apiUrl) {

        return true;
    }
    else {
        return false;
    }
}

// SHOW TOAST MESSAGES
const showMessage = (msg, icon, color) => {

    $('.toast').toast('show');
    $('.toast').addClass('animate__animated animate__slideInRight');
    $('.toast-body p').html(msg);
    $('.toast-head i').addClass(icon);
    $('.toast-head').css({ color: color });

}

const autoLogin = () => {
    if (localStorage.getItem("__token") != null && localStorage.getItem("__secret_id") != null) {
        const token = localStorage.getItem("__token");
        const secret = localStorage.getItem("__secret_id");
        window.location = "/profile?token=" + token + "&secretId=" + secret;
    }
}