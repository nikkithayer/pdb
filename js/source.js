$( document ).ready(function() {								

$.getJSON( "../questions.json", function( json ) {
	var questions = json;
	var quizPosition = 0;
	iterateQuizPosition();

	$("fieldset button").click(
		function(){
			$(this).addClass("active");
			$(this).prevAll().addClass("active");
			$(this).nextAll().removeClass("active");
			$("button.next").removeClass("inactive");
			var buttonRating = $(this).text();
			var attrId = "#attr"+quizPosition;
			lightUpQuiz(attrId, buttonRating);
		}
	);	

	$("button.next").click(
		function(){
			iterateQuizPosition();
			resetQuizStatus();
		}
	);

	function lightUpQuiz(attrId, buttonRating){
//		$("#dartboard "+attrId).children().attr("id","svg-error");
		var buttonCount = 0;
		$("#dartboard "+attrId).children().each(function () {
			if(buttonCount < buttonRating){
				$(this).attr("id","svg-filled");
				buttonCount++;
			}
		});
	}

	function iterateQuizPosition(){
		if(quizPosition<questions.length){
			var quizStep = quizPosition+1;
			$("h1#question-title").text(quizStep + ". " + questions[quizPosition].title);
			$("p#question-description").text(questions[quizPosition].description);
			rotateDartboard(quizStep);
			quizPosition++;		
		}
	}
	
	function rotateDartboard(quizStep){
		$("#dartboard").css("transform","scale(1.9) rotate("+(quizPosition*30)+"deg)");
		$("#dartboard-label").text(quizStep + ". " +questions[quizPosition].title);	
	}
	
	function resetQuizStatus(){
		$("fieldset button").removeClass("active");
		$("button.next").addClass("inactive");		
	}

 });
});

//chart lights up with appropriate light up
//fix up the positioning, especially for the next button