$(document).ready(function(){
    
    
    // lessons gallery 
    
    $(".tab").on("click", function(event){
        
        event.preventDefault();
        $(this).addClass('active').siblings('div').removeClass('active');
    });
    $("#private-lesson").on("click", function(){
        $(".lesson-image").attr('id', "private-lesson-image");
        $(".lesson-image h2").html("Private &amp;<br>Semi-Private<br>Lessons");
        $(".text").html("<p>We offer Private lessons, as well as Semi-Private lessons for two to four people. Lessons are one hour.<br><br>Contact the club for detailed information on our instructors' fees and to schedule your lessons.<br><br>Non-members: add $20 for private lessons;<br> $10 per person for semi-private lessons. </p>");    
    });
    $("#group-lesson").on("click", function(){
        $(".lesson-image").attr('id', "group-lesson-image");
        $(".lesson-image h2").html("Group<br> Lessons");
        $(".text").html("<p>This year, our Racquet Science are offering to adult tennis players of all levels various packages of good-quality affordable Group Lessons.<br><br>These programs will be conducted as successive three-week sessions for the entire season.</p>");    
    });
     $("#shot-lesson").on("click", function(){
        $(".lesson-image").attr('id', "shot-lesson-image");
        $(".lesson-image h2").html("Shot<br> of The Week");
        $(".text").html("<p>Every week covers a different stroke or strategy, taught in a laid-back and social atmosphere.<br><br> Cost: $10 per week pre-paid, maximum 12 participants per lesson. <br>Non-members welcome.<br></p>");    
    });
    
    //  calendar
    
    $("#event1").on('click', function(){
        $('#time1').show();
    });
    $("#event2").on('click', function(){
        $('#time2').show();
    });
    
    
});