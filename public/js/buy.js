function check_savings(){
    let use_saving = $('#use_saving').val();
    let have_saving = parseInt($('#have_saving').text());
    let before_price = $('#before_price').text();

    if(before_price < have_saving){
        $('#have_saving').text(before_price / 2);
    }

    if(use_saving > have_saving){
        alert(have_saving + 'P까지만 사용하실 수 있습니다.');
        resetSavings(before_price);
    } else if(use_saving % 1 != 0){
        alert('소수는 입력할 수 없습니다.');
        resetSavings(before_price);
    } else if(use_saving < 0){
        alert('0 이하의 숫자는 입력할 수 없습니다.');
        resetSavings(before_price);
    } else{
        $('#after_price').text(before_price - use_saving);
        $('#final_price').text(before_price - use_saving);
    }
}

function resetSavings(before_price){
    document.getElementById('use_saving').value = 0;
    $('#after_price').text(before_price);
    $('#final_price').text(before_price);
}

function all_savings_use(){
    let before_price = $('#before_price').text();
    let have_saving = $('#have_saving').text();
    $('#use_saving').val(have_saving);

    $('#after_price').text(before_price - have_saving);
    $('#final_price').text(before_price - have_saving);
}

function order(){
    let user_phone1 = $('#user_phone1').val();
    let user_phone2 = $('#user_phone2').val();
    let user_phone3 = $('#user_phone3').val();
    let receive_phone1 = $('#phone_number1').val();
    let receive_phone2 = $('#phone_number2').val();
    let receive_phone3 = $('#phone_number3').val();
    let date = new Date();
    let date_mon = parseInt(date.getMonth() + 1);
    let product_id = new Array();
    let count = new Array();
    let blank_check = /[\s]/g;
    let kor_check =  /^[A-Za-z0-9]+$/; 
    let special_check = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;

    for(var i = 0; i < $('#count').val(); i++){
        count.push($('#count' + i).text().substr(0, 1));
    }

    for(var i = 0; i < 5; i++){
        check_id = document.getElementById(i);
        if(check_id != null){
            product_id[i] = check_id.value;
        } else{
            break;
        }
    }

    product_id = product_id.join(', ');
    count = count.join(', ');

    let all_data = {
        user_name: $('#user_name').val(),
        user_phone:  user_phone1 + user_phone2 + user_phone3,
        user_email: $('#user_email').val() + '@' + $('#email_form').val(),
        order_name: $('#receiver').val(),
        zonecode: $('#zonecode').val(),
        address: $('#address').val(),
        detail_address: $('#detail_address').val(),
        order_phone: receive_phone1 + receive_phone2 + receive_phone3,
        remark: $('#remark').val(),
        payments: $('input[name="payments"]:checked').val(),
        all_price: $('#final_price').text(),
        date: date.getFullYear() + '-' + String(date_mon) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        product_id: product_id,
        count: count
    }
    
    let etc_data = {
        use_savings: $('#use_saving').val(),
        savings: $('#total_savings').text()
    }

    if(etc_data.use_savings == ''){
        alert('사용할 적립금의 금액을 정확히 입력해주세요.');
    }

    let total_savings = parseInt(etc_data.savings) - parseInt(etc_data.use_savings);
    if(user_phone2 == '' || user_phone3 == '' || blank_check.test(user_phone2) == true || blank_check.test(user_phone3) == true){
        alert('주문자 정보에 전화 번호를 입력해주세요');
        return;
    } else if($('#user_email').val() == '' || blank_check.test($('#user_email').val()) == true || !kor_check.test($('#user_email').val())){
        alert('주문자 정보에 이메일을 정확히 입력해주세요.');
        return;
    } else if(receive_phone2 == '' || receive_phone3 == '' || phone_number2 < 99 || phone_number3 < 999){
        alert('배송 정보에 정확한 전화 번호를 입력해주세요');
        return;
    }  else if(all_data.order_name == '' || all_data.order_name.length < $('#name').attr('minlength') ||
     blank_check.test(all_data.order_name) == true || kor_check.test(all_data.order_name) || special_check.test(all_data.order_name)){
        alert('배송 정보에 이름을 정확히 입력해주세요.');
        return;
    } else if(all_data.order_address == '' || blank_check.test(all_data.order_address) == true){
        alert('배송 정보에 주소를 입력해주세요.');
        return;
    }  else if(all_data.payments == undefined){
        alert('결제 수단을 선택해주세요.');
        return;
    } else if($("input:checkbox[id='check']").is(':checked') == false){
        alert('구매 의사 확인을 동의해 주셔야 주문을 진행하실 수 있습니다.');
        return;
    }

    all_data = JSON.stringify(all_data);
    total_savings = JSON.stringify(total_savings);

    $(document).ready(()=>{
        $.ajax({
            url: '/buy-products',
            type: 'POST',
            dataType: 'json',
            data: {all_data: all_data, total_savings: total_savings},
            success: (result)=>{
                if(result.result == true){
                    location.href = '/public/order_success.html';
                } else{
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                }
            }
        })
    });
}