$( document ).ready(function() {
    
    
//HAMBURGER NAV
    
    $('.hamburger-nav-icon').on('click', function() {
        $(this).toggleClass('open');
        $('.hamburger-nav').toggleClass('display');

    });

    
    //TABS
    
    $('.tab-box').show().filter(':not(.description)').hide();
    
    $(".tab").click(function(event){
        event.preventDefault();
        $(this).addClass('active').siblings('li').removeClass('active');
        var tagClass = $(this).attr('class').split(" ")[1];
        $('.tab-box').show().filter(':not(.'+tagClass+')').hide();
    });
    


       $("select").change(function(){
        $("#products").addClass('view-all');
        var selectClass = $(this).val();
        $('.gear').show().filter(':not(.'+selectClass+')').hide();
           
    });
    
        $("select").change(function(){
        $("#parks-section").addClass('view-all');
        var selectClass = $(this).val();
        $('.park').show().filter(':not(.'+selectClass+')').hide();
           
    });
    
        $(".activity").on('click', function(){
        $(".filter-activity").toggleClass('display-block');    
    });
    
        $(".feature").on('click', function(){
        $(".filter-feature").toggleClass('display-block');    
    });
    
    
  
//$.fn.followTo = function (pos) {
//    var $this = this,
//        $window = $(window);
//
//    $window.scroll(function (e) {
//        if ($window.scrollTop() > pos) {
//            $this.css({
//                top: 0,
//                position: 'absolute',
//                bottom: -30
////                top: pos
//            });
//        } else {
//            $this.css({
//                position: 'fixed',
//               top: 50
//            });
//        }
//    });
//};
//
//$('#filters').followTo(4050);
//
//    
//$(window).scroll(function(){
//    $("#filters").css("margin-top",Math.max(-30,80-$(this).scrollTop()));
//});
    
    
    
    
    
    $(window).scroll(function () { 

footertotop = ($('footer').position().top);
scrolltop = $(document).scrollTop()+600;
difference = scrolltop-footertotop;
        


if (scrolltop > footertotop) {

$('.filters').css('margin-top',  0-difference).hide();

}
else  {
     $(".filters").css("margin-top",Math.max(-100,0-$(this).scrollTop()));
     $('.filters').show();
    
}
});
    
    
    $(window).scroll(function () { 

footertotop = ($('footer').position().top);
scrolltop = $(document).scrollTop()+900;
difference = scrolltop-footertotop;
        


if (scrolltop > footertotop) {
        
        $('#gear-description').css('margin-top',  150-difference).hide();

}
else  {
    
         $("#gear-description").css("margin-top",Math.max(-130,0-$(this).scrollTop()));
     $('#gear-description').show();
}
});
    
    $(window).scroll(function () { 

footertotop = ($('footer').position().top);
scrolltop = $(document).scrollTop()+700;
difference = scrolltop-footertotop;
        


if (scrolltop > footertotop) {

$('#explore-canada-filter').css('margin-top',  0-difference).hide();

}
else  {
     $("#explore-canada-filter").css("margin-top",Math.max(-100,0-$(this).scrollTop()));
//     $('.filters').show();
    
}
});
    
    //MAPS

//banff
        
            google.maps.event.addDomListener(window, 'load', init);
        
            function init() {
                var mapOptions = {
                    zoom: 13,
                    scrollwheel:  false,
                    center: new google.maps.LatLng(51.1783629, -115.5707694000000),
                    styles: [{"featureType":"administrative.locality","elementType":"all","stylers":[{"hue":"#2c2e33"},{"saturation":7},{"lightness":19},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"saturation":"-3"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#f39247"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#f39247"},{"saturation":"0"},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ff6f00"},{"saturation":"100"},{"lightness":31},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#f39247"},{"saturation":"0"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#008eff"},{"saturation":-93},{"lightness":31},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#f3dbc8"},{"saturation":"0"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":-2},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#e9ebed"},{"saturation":-90},{"lightness":-8},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":10},{"lightness":69},{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":-78},{"lightness":67},{"visibility":"simplified"}]}]
                };
                var mapElement = document.getElementById('banff-map');
                var map = new google.maps.Map(mapElement, mapOptions);

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(51.1783629, -115.57076940000002),
                    map: map,
                    title: 'Snazzy!'
                });
            }    
      

 
    
});   