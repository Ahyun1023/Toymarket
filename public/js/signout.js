function signout(){
    let user = {
        id: $('#id').val(),
        password: $('#password').val(),
        password_check: $('#password_check').val()
    }
    let count = 0;

    if(user.password != user.password_check){
        alert('비밀번호가 틀렸습니다.');
    } else{
        for(var i in user){
            if(user[i] == ''){
                alert('빈 칸이 존재합니다.');
                break;
            } else{
                count++;
                console.log(count);
                if(count == 3){
                    delete user.password_check;
                    user = JSON.stringify(user);
                    $(document).ready(()=>{
                        $.ajax({
                            url: '/users/signout',
                            dataType: 'json',
                            type: 'POST',
                            data: {data:user},
                            error: (error)=>{
                                alert(error);
                            },
                            success: (result)=>{
                                if(result.result == true){
                                    alert('성공적으로 회원 탈퇴되었습니다.');
                                    location.href = './main.html';
                                } else{
                                    alert('로그인이 필요한 서비스입니다.');
                                    location.href = '/public/login.html';
                                }
                                
                            }
                        })
                    })
                }
            }
        }
    }
}