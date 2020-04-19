$(document).ready(function(){
    
//POP UP
            $(".donate").on('click', function(){
                $(".pop-up").show();
//                  $("body div, body ul").not(".pop-up, .pop-up-container h3").addClass("blur-filter");
            });
        
        $(".pop-up-close").on('click', function () {
            $(".pop-up").hide();
             $("body").removeClass('blur-filter');
        });


    
//    SHOP
    
        var products = [
        {
        url: "img/totebag.jpg",
        text: "Practice Wall and Ball Machine"
        },
        {
        url: "img/tshirt1.jpg",
        text: "Our change rooms include showers, lockers, hair dryers for your convinience"
        },
        {
        url: "img/mug1.jpg",
        text: "Our change rooms include showers, lockers, hair dryers for your convinience"
        }
        ];
    
    
    var shop;
        var shopLength = products.length;
    for(i = 0; i < shopLength; i++) {
        shop = $('<div id="div'+ i + '" />').css('background-image', 'url("'+ products[i].url +'")').addClass('product');
        $('#products').append(shop);
        
//        $(this).mouseenter( $('#products').html("<p>"+products[description-1].text+"</p>");).mouseleave("p".(hide););
        
//        var description = $(this).index();
//            $('#products').html("<p>"+products[description-1].text+"</p>");
        }
    



    
//    BLOG
    
    $("#tags div").on('click', function(){
        $("article").addClass('view-all');
        var tagClass = $(this).attr('class').split(" ")[0];
        $('article').show().filter(':not(.'+tagClass+')').hide();
    });
    
//    LOAD MORE
    
    $("article").slice(0, 3).show(); // select the first 3
    $(".load-more").on('click',function(e){ // click event for load more
        e.preventDefault();
        $("article:hidden").slice(0, 3).show(); // select next 3 hidden divs and show them
        if($("article:hidden").length == 0){ 
            $(".load-more").fadeOut();
            // check if any hidden divs still exist
//            alert("No more divs"); 
            // alert if there are none left
        }
//            $('html,body').animate({
//      scrollTop: $(this).offset().top
//    }, 5000);
  });


    
    
//    SOLUTION
    
    var test = [
        {
        url: "img/bottles.jpg",
        text: "Practice Wall and Ball Machine"
        },
        {
        url: "img/bookshop",
        text: "Our change rooms include showers, lockers, hair dryers for your convinience"
        },];
    
    
    
                var gallery;
        var testLength = test.length;
    for(i = 0; i < testLength; i++) {
        gallery = $('<div id="div'+ i + '" />').css('background-image', 'url("'+ test[i].url2 +'")').addClass('thumbnails');
        $('#gallery').append(gallery);
        }

    
        $('.thumbnails').on('click', function(){ 

		var image = $(this).index();
            $('#gallery-image').css('background-image', 'url("'+ test[image-1].url +'")');
            
            for(i = 0; i <= testLength; i++) {
            
            var paragraph = $(this).index();
            $('#gallery-text p').html("<p>"+test[paragraph-1].text+"</p>");
            
            };
            
        });
//            $(this).addClass('border').siblings('div').removeClass('border');
//        });
//    
//    
//    
//        $('.thumbnails').mouseover(function(){
//            var image = $(this).index();
//            $(this).css('background-image', 'url("'+ test[image-1].url +'")'); 
//        });
//        $('.thumbnails').mouseout(function(){
//            var image = $(this).index();
//            $(this).css('background-image', 'url("'+ test[image-1].url2 +'")'); 
//        });
//    
//    
//    $("#col-left-solution").onclick(){
//    }
    
        
});