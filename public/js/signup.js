function signup(){
    let user = {
        id: document.getElementById('id').value,
        password: document.getElementById('password').value,
        password_check: document.getElementById('password_check').value,
        name: document.getElementById('name').value,
        phone_number: document.getElementById('phone_number').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        savings: 0,
        grade: 5,
        use_money: 0
    }
    let count = 0;

    if(user.password != user.password_check){
        alert('비밀번호가 틀렸습니다.');
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
                            url: '/signup',
                            dataType: 'json',
                            type: 'POST',
                            data: {data:user},
                            error: (error)=>{
                                alert(error);
                            }
                        })
                    })
                    alert('회원가입이 완료되었습니다! 다시 로그인해주세요.');
                    location.href = './login.html';
                    break;
                }
            }
        }
    } 
}




