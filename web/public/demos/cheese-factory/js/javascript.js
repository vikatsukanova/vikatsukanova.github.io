$(document).ready(function(){
     $(".cheese-box").mouseover(function(){
//         $(this).css("display", "block");
         $("#cheese-outline1").css("display", "block");
     });
//    $(".cheese-box").mouseover(function(){
//         $("#cheese-outline2").css("display", "block");
//     });
//    $(".cheese-box").mouseover(function(){
//         $("#cheese-outline3").css("display", "block");
//     });
    $(".cheese-box").mouseout (function(){
         $(".outline-cheese-box").css("display", "none");
     });
});