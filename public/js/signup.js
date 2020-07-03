function signup(){
    let kor_check =  /^[A-Za-z0-9]+$/; 
    let blank_check = /[\s]/g;
    let phone_number1 = $('#phone_number1').val();
    let phone_number2 = $('#phone_number2').val();
    let phone_number3 = $('#phone_number3').val(); 
    let email_form = $('#email_form').val();

    let user = {
        id: $('#id').val(),
        password: $('#password').val(),
        password_check: $('#password_check').val(),
        name: $('#name').val(),
        phone_number: phone_number1 + phone_number2 + phone_number3,
        email: $('#email').val() + '@' + email_form,
        zonecode: $('#zonecode').val(),
        address: $('#address').val(),
        detail_address: $('#detail_address').val(),
        savings: 0,
        grade: 5,
        use_money: 0
    }
    let count = 0;
    let warning = false;

    console.log(user);

    if(user.id.length < 4 || user.id.length > 10){
        alert('아이디는 4에서 10까지의 영문과 숫자만 입력할 수 있습니다.');
        return;
    } else if(user.password.length < 8 || user.password.length > 16){
        alert('비밀번호는 8에서 16까지의 영문과 숫자만 입력할 수 있습니다.');
        return;
    } else if(!kor_check.test(user.id) || !kor_check.test(user.password)){
        alert('아이디나 비밀번호에는 영문과 숫자만 입력할 수 있습니다.');
        return;
    } else if(kor_check.test(user.name) || user.name.length < $('#name').attr('minlength') || blank_check.test(user.name) == true){
        alert('이름은 2에서 8까지의 한글만 입력할 수 있습니다.');
        return;
    } else if(user.password != user.password_check){
        alert('비밀번호가 틀렸습니다.');
        return;
    } else if(phone_number2 == '' || phone_number3 == '' || phone_number2 < 99 || phone_number3 < 999){
        alert('올바른 전화번호를 입력해주세요.');
        return;
    }else if(blank_check.test($('#email').val()) == true){
        alert('이메일에 공백은 입력할 수 없습니다.');
        return;
    } else if(email_form == ''){
        alert('이메일 형식을 선택해주세요.');
    } else{
        for(var i in user){
            if(user[i] == ""){
                alert('빈 칸이 존재합니다.');
                break;
            } else{
                count++;
                if(count == 7){
                    delete user.password_check;
                    user = JSON.stringify(user);
                    $(document).ready(()=>{
                        $.ajax({
                            url: '/users/signup',
                            dataType: 'json',
                            type: 'POST',
                            data: {data:user},
                            error: (error)=>{
                                alert(error);
                            },
                            success: (result)=>{
                                if(result.result == 'same id exist'){
                                    warning = true;
                                    alert('같은 아이디가 존재합니다.');
                                } else if(warning == false){
                                    alert('회원가입이 완료되었습니다! 다시 로그인해주세요.');
                                    location.href = './login.html';
                                }
                            }
                        })
                    })
                }
            }
        }
    } 
}