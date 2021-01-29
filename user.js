//Đổi ngôn ngữ
$("#locales").on('change', function() {
    var selectedOption = $('#locales').val();
    if (selectedOption != '') {
        window.location.replace('?lang=' + selectedOption);
    }
    alert(1)
});
//Slide
$('.carousel').carousel({
        interval: 2000
    })
    //Ảnh sản phẩm index
$(".card-img-top").each(function(index, element) {
    let src = $(this).attr('src');
    let link = loadImage(src, 2);
    $(this).attr('src', link);
});
//Ảnh xem sản phẩm
function mainProductImage(element) {
    let src = $(element).attr('data-src');
    let link = loadImage(src, 3);
    $('#product-img').attr('src', link);
}
mainProductImage('#product-img');
$(".thumb").each(function(index, element) {
    let src = $(this).attr('data-src');
    let link = loadImage(src, 0);
    $(this).attr('src', link);
});

function activeThumb() {
    $(".thumb").each(function(index, element) {
        let src = $(this).attr('data-src');
        let link = loadImage(src, 0);
        $(this).attr('src', link);
    });
}
$(".thumb").click(function() {
    mainProductImage(this);

    $(this).addClass('thumb-active');
});


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

//Thêm sản phẩm vào giỏ hàng
$("#add-to-cart").on("click", function(e) {
    e.preventDefault();
    var prodId = $("input[name=id]").val();
    var type = $("input[name=type]:checked").val();
    var quantity = $("input[name=quantity]").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/ajax/addtocart",
        data: JSON.stringify({ "id": prodId, "quantity": quantity, "type": type }),
        dataType: "json",
        success: function(response) {
            $("#cart-item").text(response);
        },
    });
});
//kiểm tra sản phẩm trong giỏ hàng
$.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    url: "/ajax/checkCart",
    dataType: "json",
    success: function(response) {
        $("#cart-item").text(response);
    },
});

//Kiểm tra giỏ hàng có rỗng không
function checkCartItem() {
    if ($("div").hasClass("row-product")) {
        $(".row-no-cart-item").hide();
        return true;
    } else {
        $(".row-no-cart-item").show();
        $(".return-to-buy").text("Chọn mua");
        $('.shipping-fee').remove();
        return false;
    }
}
checkCartItem();

//Tính tổng tiền giỏ hàng
function total() {
    $(".total-item").each(function() {
        var parent = $(this).parents('.row-product');
        var price = noComma(parent.find(".product-price").html());
        var quantity = parent.find('.input-num').val();
        parent.find(".total-item").text(comma(price * quantity));
    });
    var total = 0;
    var shippingFee = 0;
    var discount = 0;
    if ($('.value-discount').length)
        discount = $('.value-discount').html();
    if ($('.shipping-fee').length)
        shippingFee = noComma($('.shipping-fee').html());
    var inputs = $(".total-item");
    for (var i = 0; i < inputs.length; i++) {
        total += noComma($(inputs[i]).text());
    }
    $('.total-cart').html(comma(parseInt(total)));
    $('.total').html(comma(parseInt(total + shippingFee - discount * total / 100)));
}
total();

//Xoá sản phẩm khỏi giỏ hàng
$(".remove-cart-item").on("click", function() {
    if (confirm("Bạn muốn xóa sản phẩm khỏi giỏ hàng?")) {
        var parent = $(this).parents('.row-product');
        parent.remove();
        var prodId = parent.find("input[name=productId]").val();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/ajax/removeCartItem",
            data: JSON.stringify({ "id": prodId }),
            dataType: "json",
            success: function(response) {
                $("#cart-item").text(response);
            },
        });
        checkCartItem();
        total();
    }
});

// Nhập mã giảm giá
$(document).on("click", "#enter-promotion", function(e) {
    e.preventDefault();
    var code = $("input[name=code]").val();
    var checkStatus = $('input[name=status]').val();;
    if (checkStatus == 0) {
        if (confirm('Bạn có muốn đăng nhập để miễn phí vận chuyển và sử dụng mã giảm giá hiện có?'))
            window.location.href = '/login';
    }
    if (checkStatus == 1) {
        if (confirm('Tài khoản của bạn chưa kích hoạt, bạn có muốn kích hoạt bây h?'))
            window.location.href = '/profile';
    }
    if (checkStatus == 2) {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "/ajax/enterPromotion/" + code,
            dataType: "json",
            success: function(response) {
                if (response > 0) {
                    alert("Bạn đã áp dụng mã giảm giá thành công");
                    $("input[name=code]").hide();
                    $(".enter-promotion").hide();
                    $(".discount-value").show();
                    $(".added-promotion").html(code);
                    $(".value-discount").html(response);
                    var totalNow = $('.promotion-entered').html();
                    $('.promotion-entered').html(comma(noComma(totalNow) * response / 100));
                }
                if (response == -1) {
                    alert("Bạn chỉ được nhập 1 mã!");
                }
                if (response == -2) {
                    alert("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
                }

            },
            error: function() {
                alert("có lỗi");
            }
        });
    }
});
//Bỏ mã giảm giá
$(document).on("click", "#reject-promotion", function() {
    if (confirm("Bạn không muốn sử dụng mã giảm giá này?")) {
        var discount = $('.value-discount').html();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "/ajax/rejectPromotion/",
            dataType: "text",
            success: function(response) {
                $("input[name=code]").show();
                $(".enter-promotion").show();
                $(".discount-value").hide();
                $('.promotion-entered').html(comma(noComma($('.promotion-entered').html()) * parseInt(100) / discount));
            },
            error: function() {
                alert("có lỗi");
            }
        });
    }
});
