function auto_cal(){
    let price = parseInt($('#sale').text());
    let count = parseInt($('#product_count').val());
    let total = parseInt($('#total_price').text());
    
    total = price * count;
    $('#total_price').text(total);
    $('#hidden_count').val(count);
}

function add_to_cart(){
    let savings_cal = 0;
    let info = {
        id: $("#product_id").text(),
        count: $('#product_count').val(),
        total_price: $("#total_price").text(),
        shipping_fee: $('#shipping_fee').text(),
        savings: $('#savings').text()
    }

    if(info.count == ''){
        alert('구매할 상품의 수량을 입력해주세요.');
        return;
    }
    
    info.count = parseInt(info.count);

    if(info.count <= 0 || info.count > 5){
        alert('장바구니에는 1개에서 5개의 상품만 담을 수 있습니다.');
    } else{
        for(var i = 0; i < info.count; i++){
            savings_cal += parseInt(info.savings); 
        }
        info.savings = savings_cal;
        info = JSON.stringify(info);
        $(document).ready(()=>{
            $.ajax({
                url: '/cart/add-cart',
                dataType: 'json',
                type: 'POST',
                data: {data:info},
                success: (result)=>{
                    if(result.result == true){
                        let check = confirm('상품이 장바구니에 담겼습니다. 확인하러 가시겠습니까?');
                        if(check == true){
                            document.go_cart.submit();
                        }
                    } else if(result.result == 'overlap'){
                        alert('이미 해당 상품이 장바구니 안에 담겨있습니다.');
                    } else if(result.result == 'full_cart'){
                        alert('장바구니가 꽉 찼습니다.');
                    } else{
                        alert('로그인이 필요한 서비스입니다.');
                        location.href = '/public/login.html';
                    }
                }
            })
        })
    }
}

function now_check(){
    let count = $('#product_count').val();
    let id = $('#product_id').text();
    $(document).ready(()=>{
        $.ajax({
            url: '/check_session_count',
            type: 'POST',
            dataType: 'json',
            data: {count: count, id: id},
            success: (result)=>{
                console.log(result);
                if(result.count == false){
                    alert('상품은 1개에서 5개의 상품만 구매할 수 있습니다.');
                } else{
                    document.order_now.action = "/order/now";
                    document.order_now.submit();
                }
            }
        })
    })
}