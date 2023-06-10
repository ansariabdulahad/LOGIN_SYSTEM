exports.showMessage = (msg, icon, color) => {

    $('.toast').toast('show');
    $('.toast').addClass('animate__animated animate__slideInRight');
    $('.toast-body p').html(msg);
    $('.toast-head i').addClass(icon);
    $('.toast-head').css({ color: color });

}