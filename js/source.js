$( document ).ready(function() {								

$.getJSON( "./questions.json", function( json ) {
	var questions = json;
	var quizPosition = 0;
	iterateQuizPosition();
	iterateProgressWheel(2)

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
			var stepId = "#step"+quizPosition;
			iterateProgressWheel(stepId);
			resetQuizStatus();
		}
	);

	function lightUpQuiz(attrId, buttonRating){
		var buttonCount = 0;
		$("#dartboard "+attrId).children().each(function () {
			$(this).attr("id","svg-empty");
			if(buttonCount < buttonRating){
				$(this).attr("id","svg-filled");
			}else{
				$(this).attr("id","svg-unfilled");				
			}
			buttonCount++;
		});
	}
	
	function iterateProgressWheel(stepId){
		$("#progress-bar "+stepId).attr("id","step-filled");
	}

	function iterateQuizPosition(){
		if(quizPosition<questions.length){
			var quizStep = quizPosition+1;
			$("h1#question-title").html("<span>" + quizStep + ". </span>" + questions[quizPosition].title);
			$("p#question-description").text(questions[quizPosition].description);
			$("span#progress-step").text(quizStep + "of 12");
			rotateDartboard(quizStep);
			quizPosition++;		
		}
	}
	
	function rotateDartboard(quizStep){
		$("#dartboard").css("transform","scale(1.9) rotate("+(quizPosition*30)+"deg)");
		$(".dartboard-label").text(quizStep + ". " +questions[quizPosition].title);	
	}
	
	function resetQuizStatus(){
		$("fieldset button").removeClass("active");
		$("button.next").addClass("inactive");		
	}

 });
});

//make the next button work nicer
//little svg version lights up at bottom of window
//fix up the positioning, especially for the next button
