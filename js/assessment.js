$( document ).ready(function() {								

$.getJSON( "./questions.json", function( json ) {
	var questions = json;

// -- ASSESSMENT PAGE --
	var quizPosition = 0;
	var allowNext = false;
	var quizIsDone = false;
	iterateQuizPosition();
	$("#thanks").hide();

	$("fieldset button").click(
		function(){
			$(this).addClass("active");
			$(this).prevAll().addClass("active");
			$(this).nextAll().removeClass("active");
			$("button.next").removeClass("inactive");
			var buttonRating = $(this).text();
			var attrId = "#attr"+quizPosition;
			allowNext = true;
		}
	);	

	$("button.next").click(
		function(event){
			if(allowNext){
				iterateQuizPosition();
				var stepId = "#step"+quizPosition;
				resetQuizStatus();
				allowNext = false;
				if(quizIsDone){
					showYourResponses();
				}
			}
		}
	);
	
	function showYourResponses(){
		$("#thanks").show();
	}
	
	function iterateQuizPosition(){
		if(quizPosition == questions.length){
			quizIsDone = true;
		}
		if(quizPosition<questions.length){
			var quizStep = quizPosition+1;
			$("h1#question-title").html("<span>" + quizStep + ". </span>" + questions[quizPosition].title);
			$("p#question-description").text(questions[quizPosition].description);
			$("span#progress-step").text(quizStep + " of 12");
			quizPosition++;
			if(quizPosition == questions.length){
				$("button.next").text("Finished");
			}
		}
	}
	
	function resetQuizStatus(){
		$("fieldset button").removeClass("active");
		$("button.next").addClass("inactive");		
	}

 });
});