window.onload = function(){
    check_login();
    list_load();
}

function check_login(){
    $(document).ready(()=>{
        $.ajax({
            url: '/check_session',
            type: 'POST',
            success: (result)=>{
                if(result.result == 'not_login'){
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/public/login.html';
                }
            }
        })
    })
}

function list_load(){
    $(document).ready(()=>{
        $.ajax({
            url: '/list-load',
            type: 'GET',
            dataType: 'json',
            success: (results)=>{
                let result = JSON.parse(results.result);
                let products_name = JSON.parse(results.products_name);

                let count = new Array();

                for(var i = 0; i < result.length; i++){
                    count[i] = result[i].count.split(', ');
                }

                for (var i = 0; i < result.length; i++) {
                    var innerHtml = "";
                    innerHtml += '<tr>';
                    innerHtml += '   <td>' + parseInt(i+1) + '.' + '</td>';
                    innerHtml += '   <td>' + result[i].id + '</td>';
                    innerHtml += '   <td>' + result[i].user_name + '</td>';
                    innerHtml += '   <td>' + result[i].order_name + '</td>';
                    innerHtml += '   <td>';
                    for(var j = 0; j < products_name[i].length; j++){
                        innerHtml += products_name[i][j];
                        innerHtml += '<br>';
                    }
                    innerHtml += '</td>';
                    if(result[i].payments == 'credit_card'){
                        result[i].payments = '신용카드';
                    } else{
                        result[i].payments = '계좌이체';
                    }
                    innerHtml += '   <td>' + result[i].payments + '</td>';
                    innerHtml += '   <td>';
                    for(var j = 0; j < products_name[i].length; j++){
                        innerHtml += count[i][j] + '개';
                        innerHtml += '<br>';
                    }
                    innerHtml += '</td>';
                    innerHtml += '   <td>' + result[i].all_price + '원 </td>';
                    innerHtml += '   <td>' + result[i].address + ' ' + result[i].detail_address + '</td>';
                    innerHtml += '   <td>' + result[i].date.substr(0, 10) + '</td>';
                    innerHtml += '</tr>';
                    $('#list').append(innerHtml);
                }
            }
        })
    })
}