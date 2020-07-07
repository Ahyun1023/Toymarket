function automatic_ci(){
    $(document).ready(()=>{
        $.ajax({
            url: '/auto_change_info',
            dataType: 'json',
            type: 'POST',
            success: (result)=>{
                if(result.result == false){
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                } else{
                    let users = result.result;
                    users = JSON.parse(users);
                    let em = users.email.split('@');
                    if(users.phone_number.substring(0, 2) == '02'){
                        document.getElementById('phone_number1').value = (users.phone_number.substring(0, 2));
                        document.getElementById('phone_number2').value = (users.phone_number.substring(2, 6));
                        document.getElementById('phone_number3').value = (users.phone_number.substring(6, 10));
                    } else{
                        document.getElementById('phone_number1').value = (users.phone_number.substring(0, 3));
                        document.getElementById('phone_number2').value = (users.phone_number.substring(3, 7));
                        document.getElementById('phone_number3').value = (users.phone_number.substring(7, 11));
                    }
                    document.getElementById('email').value = (em[0]);
                    document.getElementById('email_form').value = (em[1]);
                    document.getElementById('name').value = (users.name);
    
                    document.getElementById('zonecode').value = (users.zonecode);
                    document.getElementById('address').value = (users.address);
                    document.getElementById('detail_address').value = (users.detail_address);
                }
            }
        })
    })
}

function change_info(){
    let special_check = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
    let kor_check =  /^[A-Za-z0-9]+$/;
    let blank_check = /[\s]/g;
    let phone_number1 = $('#phone_number1').val();
    let phone_number2 = $('#phone_number2').val();
    let phone_number3 = $('#phone_number3').val(); 
    let email_form = $('#email_form').val();

    let info = {
        password: $('#password').val(),
        password_check: $('#password_check').val(),
        phone_number: phone_number1 + phone_number2 + phone_number3,
        name: $('#name').val(),
        email: $('#email').val() + '@' + email_form,
        zonecode: $('#zonecode').val(),
        address: $('#address').val(),
        detail_address: $('#detail_address').val(),
    }
    console.log(info.name);
    let count = 0;

    if(info.password.length < 8 || info.password.length > 16){
        alert('비밀번호는 8에서 16까지의 영문과 숫자만 입력할 수 있습니다.');
        return;
    } else if(!kor_check.test(info.id) || !kor_check.test(info.password)){
        alert('비밀번호에는 영문과 숫자만 입력할 수 있습니다.');
        return;
    } else if(info.password != info.password_check){
        alert('비밀번호가 틀렸습니다.');
        return;
    } else if(kor_check.test(info.name) || info.name.length < $('#name').attr('minlength') || blank_check.test(info.name) == true || special_check.test(info.name)){
        alert('이름은 공백을 입력할 수 없으며 2에서 8까지의 한글만 입력할 수 있습니다.');
        return;
    } else if(phone_number2 == '' || phone_number3 == '' || phone_number2 < 99 || phone_number3 < 999){
        alert('올바른 전화번호를 입력해주세요.');
        return;
    }else if(blank_check.test(info.email) == true){
        alert('이메일에 공백은 입력할 수 없습니다.');
        return;
    }else if(blank_check.test($('#email').val()) == true || !kor_check.test($('#email').val())){
        alert('올바른 이메일을 입력해주세요.');
        return;
    } else{
        for(var i in info){
            if(info[i] == ''){
                alert('빈 칸이 존재합니다.');
                break;
            } else{
                count++;
                if(count == 5){
                    delete info.password_check;
                    info = JSON.stringify(info);

                    $(document).ready(()=>{
                        $.ajax({
                            url: '/users/change_info',
                            dataType: 'json',
                            type: 'POST',
                            data: {data: info},
                            success: (result)=>{
                                if(result.result == true){
                                    alert('성공적으로 정보가 수정되었습니다.');
                                    document.go_mypage.submit();
                                } else{
                                    alert('로그인이 필요한 서비스입니다.');
                                    location.href = '/public/login.html';
                                }
                            },
                            error: (error)=>{
                                console.log('error');
                                alert(error);
                            }
                        })
                    })
                }
            }
        }
    }
}