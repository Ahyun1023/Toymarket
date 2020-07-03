function automatic_all(){
    $(document).ready(()=>{
        $.ajax({
            url: '/check_session',
            type: 'POST',
            success: (result)=>{
                if(result.result == 'logined'){
                    let signup = document.getElementById('signup');
                    let login = document.getElementById('login');
                    signup.innerHTML = "";
                    login.innerHTML = "<a href='#' id='logout' onclick='logout()'>로그아웃</a>";
                }
            }
        })
    })
}

function automatic_required(){
    $(document).ready(()=>{
        $.ajax({
            url: '/check_session',
            type: 'POST',
            success: (result)=>{
                if(result.result != 'logined'){
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                }
            }
        })
    })
}

function cart(){
    $(document).ready(()=>{
        $.ajax({
            url:'/check_session',
            type: 'POST',
            success: (result)=>{
                if(result.result == 'logined'){
                    document.go_cart.submit();
                } else{
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                }
            }
        })
    })
}

function mypage(){
    $(document).ready(()=>{
        $.ajax({
            url:'/check_session',
            type: 'POST',
            success: (result)=>{
                if(result.result == 'logined'){
                    document.go_mypage.submit();
                } else{
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                }
            }
        })
    })
}

function logout(){
    $(document).ready(()=>{
        $.ajax({
            url:'/users/logout',
            type: 'POST',
            success: (result)=>{
                if(result.result == 'logined'){
                        alert('로그아웃 되었습니다.');
                        location.href = '/public/main.html';
                } else{
                    alert('이미 로그인되어 있지 않습니다.');
                    location.href = '/public/main.html';
                }
            }
        })
    })
}

function go_order_list(){
    $(document).ready(()=>{
        $.ajax({
            url:'/check_session',
            type: 'POST',
            success: (result)=>{
                if(result.result == 'logined'){
                        location.href = '/public/order_list.html';
                } else{
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                }
            }
        })
    })
}

function search_address(){
    new daum.Postcode({
        oncomplete: function(data) {
            document.getElementById('zonecode').value = data.zonecode;
            document.getElementById('address').value = data.address;
        }
    }).open();
}

function numberMax(data){
    if(data.value.length > 4){
        data.value = data.value.slice(0, 4);
    }
}

function Go_top(){
    window.scrollTo(0, 0);
}