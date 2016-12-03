// 页面加载时加载数据
$(function(){
	$(".swiper-wrapper div")[0].click();
	countDown();
});
// swiper
var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 3,
    paginationClickable: true,
    spaceBetween: 30
});

var index = '';
var that = '';
var timeArr = $(".swiper-wrapper div");
// 点击切换页面并重新加载数据
timeArr.on('click',function(){
	that = $(this);
	index = that.index();
	$(this).addClass('curr').siblings().removeClass('curr');
	$(dlDom).empty();
	getList(that,index);
});
var myScroll,
	downTag = document.querySelector('#downTag'),
	upTag = document.querySelector('#upTag'),
	flag = "",
	dlDom = document.querySelector("#container"),
	maxScrollY = 0;

	myScroll = new IScroll('#wrapper',{
		probeType:2,
		startY:-40   //?
	});
	console.log(myScroll.maxScrollY);
	maxScrollY = myScroll.maxScrollY;

	myScroll.on('scroll',function(){
		console.log(this.y);
		if(this.y > 5 && !flag && this.directionY == -1){
			downTag.innerHTML = "释放刷新！";
			flag = 'down';
		}else if(this.y < -5 && this.directionY && flag=="down"){
			downTag.innerHTML = "下拉";
			flag = "";
		}else if(this.y < maxScrollY - 40 && this.directionY == 1 &&!flag){
			upTag.innerHTML = "释放加载";
			this.maxScrollY = maxScrollY - 40;
			flag = "up";
		}else if(this.y > maxScrollY-40 && flag=="up"&&this.directionY==-1){
			upTag.innerHTML = "上拉";
			this.maxScrollY = maxScrollY;
			flag = '';
		}
	});

	myScroll.on('scrollEnd',function(){
		if(!flag&&this.y<4&&this.y>-40){
			this.scrollTo(0,-40,300);
			flag = "";
		}else if(flag=="down"){
			downTag.innerHTML = "加载中...";
			setTimeout(function(){
				fresh();
			},500)
		}else if (flag == "up"){
			upTag.innerHTML = "加载中....";
			setTimeout(function(){
				getList(that,index);
			},500)
		}
	});


	function fresh(){
		myScroll.scrollTo(0,-40,300);
		downTag.innerHTML = "下拉";
		_refresh();
	}
    
    function getList(element,index){
    	var _index = element.index()+1;
    	// 模拟假数据加载
    	$.ajax({
    		url: "json/data1.json",
    		type:'get',
    		dataType:'json',
    		success:function(data){
    			var str = 'rows'+_index;
				var data = data[str],
					len = data.length;
				console.log(data);
				var html = "";
				for(var i= 0;i<len;i++){
					html +='<dl>'+
							'<dt>'+
								'<img src='+ data[i].imgSrc+'alt="">'+
							'</dt>'+
							'<dd>'+
								'<h1>'+data[i].title+'</h1>'+
								'<p>'+data[i].address+'</p>'+
								'<p>'+data[i].address_2+'</p>'+
								'<div class="price">'+
									'<div>价格</div>'+
									'<ul>'+
    									'<li>￥'+data[i].price1+'元/kg <span>'+data[i].price1_sp+'</span></li>'+
    									'<li>￥'+data[i].price2+'元/kg <span>'+data[i].price2_sp+'</span></li>'+
    									'<li>￥'+data[i].price3+'元/kg <span>'+data[i].price3_sp+'</span></li>'+
									'</ul>'+
								'</div>'+
							'</dd>'+
						'</dl>';
				}
				$(dlDom).append(html);
				upTag.innerHTML;
				_refresh();
	    	},
    	});
    };

    function _refresh(){
    	flag = "";
    	myScroll.refresh();
    	maxScrollY = myScroll.maxScrollY;
    }

    // 倒计时
    function countDown(){
    	var date = new Date();
	    var hour = date.getHours(),
	    	min = date.getMinutes(),
	    	sec = date.getSeconds();
	    $('#hour').text(23-hour);
	    $('#min').text(59-min);
	    $('#sec').text(60-sec);
    }
    var timer = setInterval(function(){
    	countDown();
    },1000);

    document.addEventListener('touchmove',function(e){
    	e.preventDefault();
    },false);