$( document ).ready(function() {								

$.getJSON( "../questions.json", function( json ) {
	var questions = json;
	var quizPosition = 0;
	iterateQuizPosition();

	var buttonRating = 0;

	$("fieldset button").click(
		function(){
			$(this).addClass("active");
			$(this).prevAll().addClass("active");
			$(this).nextAll().removeClass("active");
			$("button.next").removeClass("inactive");
			$("#display-progress").addClass("click");
			buttonRating = $(this).text();
			console.log($("#display-progress").children("g"));
		}
	);	
	$("button.next").click(
		function(){
			iterateQuizPosition();
			resetQuizStatus();
		}
	);

	function iterateQuizPosition(){
		if(quizPosition<questions.length){
			var quizStep = quizPosition+1;
			$("h1#question-title").text(quizStep + ". " + questions[quizPosition].title);
			$("p#question-description").text(questions[quizPosition].description);
			rotateDartboard();
			quizPosition++;		
		}
	}
	
	function rotateDartboard(){
		$("#display-progress").css("transform","scale(1.9) rotate("+(quizPosition*30)+"deg)");
		$("#dartboard-label").text(questions[quizPosition].title);	
	}
	
	function resetQuizStatus(){
		$("fieldset button").removeClass("active");
		$("button.next").addClass("inactive");		
	}

 });
});
//text label should show up over circle
//chart lights up with appropriate light up
//fix up the positioning, especially for the next button