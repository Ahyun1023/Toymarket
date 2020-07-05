function login(){
    let user = {
        id: $('#id').val(),
        password: $('#password').val()
    }

    if(user.id == "" || user.password == ""){
        alert('빈칸이 존재합니다.');
    } else{
        user = JSON.stringify(user);
        $(document).ready(()=>{
            $.ajax({
                url: '/users/login',
                dataType: 'json',
                type: 'POST',
                data: {data:user},
                error: (error)=>{
                    alert(error);
                },
                success: (result)=>{
                    if(result.result == 'success'){
                        location.href = './main.html';
                    } else if(result.result == 'fail_1'){
                        alert('아이디 혹은 비밀번호가 틀렸습니다.');
                    } else if(result.result == 'fail_2'){
                        alert('이미 다른 페이지에서 로그인되어 있습니다.');
                        location.href = '/public/main.html';
                    }
                }
            });
        });
    }

    
}