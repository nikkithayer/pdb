$( document ).ready(function() {								

$.getJSON( "./questions.json", function( json ) {
	var questions = json;
	var quizPosition = 0;
	iterateQuizPosition();
	populateResults();
	$(".results h1").next().hide();
	$(".results h1:first").next().show();
	
	$("#dartboard-results g").hover(function(){
		var responseClass = $(this).attr("id");
		console.log($("h1.assessment-dropdown").eq(2).attr("class"));
		$("h1.assessment-dropdown."+responseClass).next().show("fast");
	}, function(){
//		$("h1.assessment-dropdown").hasClass(responseClass).next().hide("fast");
	});
	
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

	$("h1.assessment-dropdown").click(
		function(){
			$(this).next().toggle();
		}
	);

	function populateResults(){
		questions.sort(function(a, b) {
			return parseFloat(a.average) - parseFloat(b.average);
		});
		for(i=0;i<questions.length;i++){
			$(".assessment-fields").append('<h1 class="assessment-dropdown results'+questions[i].position+'">'+questions[i].title+'<span>Average: '+questions[i].average+'</span></h1>');
			$(".assessment-fields").append('<div class="result-content">'+questions[i].content+'</div>');
		}
	}

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