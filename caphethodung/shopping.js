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