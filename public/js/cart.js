let change_count_count;
let change_count_id;

function change_count(id){
    change_count_count = id;
    change_count_id = id.substring(13, 14);
}

function update_count(){
    let count = document.getElementById(change_count_count).value;
    let id = document.getElementById(change_count_id).value;

    if(count == ''){
        alert('구매하려는 상품의 수량을 입력해주세요.');
        return;
    }
    
    count = parseInt(count);

    if(count > 5 || count < 1){
        alert('상품은 1개부터 5개까지 구입할 수 있습니다.');
    } else if(count == ''){
        alert('숫자만 입력해주세요.');
    } else{
        $(document).ready(()=>{
            $.ajax({
                url: '/cart/update-count',
                type: 'POST',
                data: {count: count, id: id},
                success: (result)=>{
                    if(result.result == false){
                        alert('로그인이 필요한 서비스입니다.');
                        location.href = '/public/login.html';
                    } else{
                        window.location.reload();   
                    }
                }
            })
        })
    }
}

function delete_cart(id){
    let delete_id = id.substring(13, 14);
    $(document).ready(()=>{
        $.ajax({
            url: '/cart/delete-cart',
            type: 'POST',
            data: {data: delete_id},
            success: (result)=>{
                if(result.result == true){
                    alert('삭제되었습니다.');
                    window.location.reload();
                } else{
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                }
            }
        })
    })
}

function no_product(){
    let check = $('#none_cart').text();
    if(check == '장바구니에 담은 상품이 없습니다.'){
        alert('장바구니에 담긴 상품이 없습니다.');
        document.go_cart.submit();
    }
}