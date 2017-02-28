$( document ).ready(function() {								

$.getJSON( "./questions.json", function( json ) {
	var questions = json;

// -- ASSESSMENT PAGE --
	var quizPosition = 0;
	var allowNext = false;
	iterateQuizPosition();
	iterateProgressWheel("#step1");

	$("fieldset button").click(
		function(){
			$(this).addClass("active");
			$(this).prevAll().addClass("active");
			$(this).nextAll().removeClass("active");
			$("button.next").removeClass("inactive");
			var buttonRating = $(this).text();
			var attrId = "#attr"+quizPosition;
			lightUpQuiz(attrId, buttonRating);
			allowNext = true;
		}
	);	

	$("button.next").click(
		function(event){
			if(allowNext && (quizPosition < questions.length)){
				iterateQuizPosition();
				var stepId = "#step"+quizPosition;
				iterateProgressWheel(stepId);
				resetQuizStatus();
				allowNext = false;
				console.log(quizPosition);
				event.preventDefault();
			}
		}
		//if you haven't put a button in, 
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
			$("span#progress-step").text(quizStep + " of 12");
			rotateDartboard(quizStep);
			quizPosition++;
			if(quizPosition == questions.length){
				$("button.next").text("Finished");
			}
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
		
// -- RESULTS PAGE --	
	populateQuizResults();
	$("h1.assessment-dropdown").next().hide();
	$("h1.assessment-dropdown:first").next().show();
	
	$("#dartboard-results g").click(function(){
		var responseClass = $(this).attr("id").toString();
		highlightResults($(this));
		showAttributeInfo($("h1.assessment-dropdown."+responseClass));
	});
	
	$("h1.assessment-dropdown").click(
		function(){
			var responseId = $(this).attr("class").split(' ').pop().toString();
			highlightResults($("g#"+responseId));
			showAttributeInfo($(this));			
		}
	);

	function highlightResults(ele){
		$("#dartboard-results").children().children().removeClass("highlight");		
		ele.children().addClass("highlight");
	}

	function showAttributeInfo(ele){
		$("h1.assessment-dropdown").next().hide();
		$("h1.assessment-dropdown").removeClass("open");
		ele.addClass("open");
		ele.next().show("fast");
	}

	function populateQuizResults(){
		questions.sort(function(a, b) {
			return parseFloat(a.average) - parseFloat(b.average);
		});
		for(i=0;i<questions.length;i++){
			$(".assessment-fields").append('<h1 class="assessment-dropdown result'+questions[i].position+'">'+questions[i].title+'<span>Average: '+questions[i].average+'</span></h1>');
			$(".assessment-fields").append('<div class="result-content">'+questions[i].content+'</div>');
		}
	}

 });
});