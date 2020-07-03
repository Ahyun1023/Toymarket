function order_list(){
    $(document).ready(()=>{
        $.ajax({
            url: '/check_session',
            type: 'POST',
            success: (result)=>{
                if(result.result != 'logined'){
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                } else{
                    location.href = '/public/order_list.html';
                }
            }
        })
    })
}

function changeInfo_check(){
    $(document).ready(()=>{
        $.ajax({
            url: '/check_session',
            type: 'POST',
            success: (result)=>{
                if(result.result != 'logined'){
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                } else{
                    location.href = '/public/change_info.html';
                }
            }
        })
    })
}