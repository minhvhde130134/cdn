//Đổi ngôn ngữ
$("#locales").on('change', function() {
    var selectedOption = $('#locales').val();
    if (selectedOption != '') {
        window.location.replace('?lang=' + selectedOption);
    }
    alert(1)
});

//Slide

//Ảnh sản phẩm index
$(".card-img-top").each(function(index, element) {
    let src = $(this).attr("data-src");
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
