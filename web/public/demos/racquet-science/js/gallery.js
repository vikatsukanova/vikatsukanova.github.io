$(document).ready(function(){
    
       
        var test = [
        {
        url: "images/image1.jpg",
        url2: "images/image1-thumb.png",
        text: "Practice Wall and Ball Machine"
        },
        {
        url: "images/changing-room.jpg",
        url2: "images/changing-room-thumb.jpg",
        text: "Our change rooms include showers, lockers, hair dryers for your convinience"
        },
        {
        
        url: "images/snack-room.jpg",
        url2: "images/snack-room-thumb.jpg",
        text: "Racquet Science also has a snack bar that serves some healthy wraps and drinks"
        },
        {
        
        url: "images/coach-kid.jpg",
        url2: "images/coach-kid-thumb.jpg",
        text: "Variety of programs from our talended team of instructors"
        },
        
        {
    
        url: "images/court1.png",
        url2: "images/court1-thumb.png",
        text: "Courts are covered by an inflated dome during the indoor season"
        },
            
        {
        
        url: "images/shop1.jpg",
        url2: "images/shop1-thumb.png",
        text: "Tennis equipment is available for sale in our shop"
        },
        
        {
        
        url: "images/building.jpg",
        url2: "images/building-thumb.jpg",
        text: "Our facility is located in a quiet, peaceful, landscaped park setting with free parking"
        },
            
        {
        
        url: "images/court2.jpg",
        url2: "images/court2-thumb.jpg",
        text: "Dome is comfortably heated and has ultra-bright lighting"
        },
        
        {
            
        url: "images/students.jpg",
        url2: "images/students-thumb.jpg",
        text: "Our students from a group lesson"
        },
        
        {
        url: "images/court3.jpg",
        url2: "images/court3-thumb.jpg",
        text: "We have six top quality tennis courts (hard court surface)"
        },
        ]; 
    
    
    
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
            
            $(this).addClass('border').siblings('div').removeClass('border');
        });
    
    
    
        $('.thumbnails').mouseover(function(){
            var image = $(this).index();
            $(this).css('background-image', 'url("'+ test[image-1].url +'")'); 
        });
        $('.thumbnails').mouseout(function(){
            var image = $(this).index();
            $(this).css('background-image', 'url("'+ test[image-1].url2 +'")'); 
        });


});               

