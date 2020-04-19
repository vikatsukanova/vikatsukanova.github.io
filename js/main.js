

$( document ).ready(function() {

	// $('nav').show().filter(':not(.web-design)').hide();

	    // $('nav li').click(function(event){
     //    event.preventDefault();
     //    $(this).addClass('active').siblings('li').removeClass('active');
    //     var navClass = $(this).attr('class').split(" ")[0];
    //     $('.portfolio').show().filter(':not(#'+navClass+')').hide();
    // });
    
    $('.hamburger-nav').on('click', function() {
//        $(this).toggleClass('open');
        $(this).toggleClass('open');
        $('#hamburger-nav').toggleClass('display');

});

//    $('.hamburger-nav').on('click', function() {
//        $('#hamburger-nav').hide();
//});


}); 