//Đăng ký
$("#register-form").on('submit', function(e) {
    e.preventDefault();
    var phone = $("input[name=phone]").val();
    var iPass = $("input[name=password]");;
    var iRePass = $("input[name=rePassword]");
    var password = iPass.val();
    var rePassword = iRePass.val();
    if (phone.length != 10) {
        alert("Số điện thoại phải có 10 chữ số");
        $("input[name=phone]").val('');
    } else if (password != rePassword) {
        alert("Mật khẩu nhập lại không khớp!");
        iPass.val('');
        iRePass.val('');
    } else {
        var email = $("input[name=email]").val();
        var name = $("input[name=fullName]").val();
        var username = $("input[name=username]").val();
        var address = $("input[name=address]").val();
        $('#loading-image').show();
        $.ajax({
            type: "post",
            contentType: "application/json; charset=utf-8",
            url: "/ajax/register",
            data: JSON.stringify({
                "username": username,
                "fullName": name,
                "phone": phone,
                "address": address,
                "email": email,
                "password": password
            }),
            dataType: "text",
            beforeSend: function() {
                loading();
            },
            success: function(response) {
                alert(response);
                loaded();
            },
            error: function() {
                $('#register-form').hide();
                $('#check-account-form').show();
                countDown(60, "#counter");
                sendMail();
                loaded();
            },
        });
    }
});
//xác minh tài khoản
$(document).on('submit', '#check-account-form', function(e) {
    e.preventDefault();
    var code = $("input[name=checkCode]").val();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/ajax/verifyCode/" + code,
        dataType: "text",
        success: function(response) {
            alert("Xác minh thành công!");
            window.location.href = '/';
        },
        error: function() {
            alert("Sai mã xác thực");
        }
    });
});
//gửi lại mail
$(document).on('click', '#resend-email', function(e) {
    e.preventDefault();
    sendMail();
    countDown(60, "#counter");
});

//kích hoạt tài khoản ở profile
$("#active-account").click(function(e) {
    e.preventDefault();
    $('.profile-form').hide();
    $('#check-account-form').show();
    sendMail();
    countDown(60, "#counter");
});



//Thay đổi thông tin người dùng
$("#change-info-form").on('submit', function(e) {
    e.preventDefault();
    var phone = $("input[name=phone]").val();
    if (phone.length != 10) {
        alert("Số điện thoại phải có 10 chữ số");
        $("input[name=phone]").val('');
    } else {
        var name = $("input[name=fullName]").val();
        var id = $("input[name=id]").val();
        var address = $("input[name=address]").val();
        $.ajax({
            type: "post",
            contentType: "application/json; charset=utf-8",
            url: "/ajax/changeProfileInfo",
            data: JSON.stringify({ "id": id, "fullName": name, "phone": phone, "address": address }),
            dataType: "text",
            success: function() {
                alert("Thay đổi thông tin thành công");
            },
            error: function() {
                alert("Thông tin thay đổi không hợp lệ");
            }
        });
    }
});
