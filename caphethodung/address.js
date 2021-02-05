//Chọn địa chỉ
let city, district, ward;
    let adCity, adDistrict, adWard;
    $.getJSON('https://raw.githubusercontent.com/minhvhde130134/location-api/main/location.json', function (data) {
        city = data;
        let len = city.length;
        for (let index = 0; index < len; index++) {
            const element = city[index];
            $('#shipping-province').append(`<option value="` + element.Id + `">` + element.Name + `</option>`);
        }
    });
    $('#shipping-province').change(function () {
        $('.shipping-district').remove();
        district = [];
        adCity='';
        let cityId = $(this).val();
        let cityLen = city.length;
        for (let index = 0; index < cityLen; index++) {
            const element = city[index];
            if (element.Id == cityId) {
                adCity=element.Name;
                district = element.Districts
                break;
            }
        }
        let len = district.length;
        for (let index = 0; index < len; index++) {
            const element = district[index];
            $('#shipping-district').append(`<option class="shipping-district" value="` + element.Id + `">` + element.Name + `</option>`);
        }
    });
    $('#shipping-district').change(function () {
        $('.shipping-ward').remove();
        ward = [];
        adDistrict='';
        let districtId = $(this).val();
        let districtLen = district.length;
        for (let index = 0; index < districtLen; index++) {
            const element = district[index];
            if (element.Id == districtId) {
                adDistrict=element.Name;
                ward = element.Wards;
                break;
            }
        }
        let len = ward.length;
        for (let index = 0; index < len; index++) {
            const element = ward[index];
            $('#shipping-ward').append(`<option class="shipping-ward" value="` + element.Id + `">` + element.Name + `</option>`);
        }
    });
    $('#shipping-ward').change(function () {
        adWard='';
        let wardId = $(this).val();
        let len = ward.length;
        for (let index = 0; index < len; index++) {
            const element = ward[index];
            if (element.Id == wardId) {
                adWard=element.Name;
                break;
            }
        }
    });
    $('button').click(function (e) {
        e.preventDefault();
        let address;
        if(adWard==adDistrict){
            address = adDistrict+' - '+adCity;
        }else{
            address = adWard+' - '+adDistrict+' - '+adCity;
        }        
        alert(address);
    });