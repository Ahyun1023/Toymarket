function success_data(){
    $(document).ready(()=>{
        $.ajax({
            url: '/load/success-data',
            type: 'GET',
            dataType: 'json',
            success: (result)=>{
                let orderedList = JSON.parse(result.orderedList);
                let recommend = JSON.parse(result.recommend);
                let products_name = JSON.parse(result.products_name);
                let products_count = new Array();
                products_count = orderedList[0].count.split(', ');

                var innerHtml = "";
                innerHtml += '<tr>';
                innerHtml += '   <td>' + orderedList[0].id + '</td>';
                innerHtml += '   <td>' + orderedList[0].user_name + '</td>';
                innerHtml += '   <td>' + orderedList[0].order_name + '</td>';
                innerHtml += '   <td>';
                for(var i = 0; i < products_name.length; i++){
                    innerHtml += products_name[i].name;
                    innerHtml += '<br>';
                }
                innerHtml += '</td>';
                if(orderedList[0].payments == 'credit_card'){
                    orderedList[0].payments = '신용카드';
                } else{
                    orderedList[0].payments = '계좌이체';
                }
                innerHtml += '   <td>' + orderedList[0].payments + '</td>';
                innerHtml += '   <td>';
                for(var i = 0; i < products_count.length; i++){
                    innerHtml += products_count[i] + '개';
                    innerHtml += '<br>';
                }
                innerHtml += '</td>';
                innerHtml += '   <td>' + orderedList[0].all_price + '원</td>';
                innerHtml += '   <td>' + orderedList[0].address + '</td>';
                innerHtml += '</tr>';
                $('#order_list').append(innerHtml);

                var innerHtml = "";
                innerHtml += '<tr>';
                for(var i = 0; i < 4; i++){
                    innerHtml += '<td>';
                    innerHtml += '<a href=/product?id=' + recommend[i].id + '><img src="/public/' + recommend[i].image + '" id=" related' + i+1 + '"></a>';
                    innerHtml += '</td>';
                }
                innerHtml += '</tr>';
                innerHtml += '<tr>';
                for(var i = 0; i < 4; i++){
                    innerHtml += '<td id="recommend_title">';
                    innerHtml += '<a href="/product?id=' + recommend[i].id + '"><p id="related_title"> '+ recommend[i].name  + '</p></a>';
                    innerHtml += '</td>';
                }
                innerHtml += '</tr>';
                $('#recommend_list').append(innerHtml);
            }
        })
    })
}

window.onload = function(){
    success_data();
}