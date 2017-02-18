$( document ).ready(function() {								
	var fadeInSpeed = 750;
	var promptText = ["What's on your mind?", "Anything else?"];
	var btnText = ["Okay.", "I'm sorry to hear that.", "Got it.", "I hear you."];
	var btnCompletionText = "No, I'm done.";
	var painText = "How bad is it?";
	var currentFieldBlank = true;
									
	var answers = [];
	var pain = [];
	

	var firstQuestion = true;
	var posOffset = -500;
	
	showNewQuestion();
	$('input:text:visible:first')[0].focus();

	
	
	function showNewQuestion(){
		var prompt = promptText[1];
		if (firstQuestion){
			prompt = promptText[0];
		}
		var newContent = "<h1>"+prompt+"</h1><input type='text' />";
		fadeInNewContent(newContent, ".inner");
		if(!firstQuestion){
			newContent = "<button class='completedQuestions'>"+btnCompletionText+"</button>";
			fadeInNewContent(newContent, ".inner");
		}
		firstQuestion = false;
		currentFieldBlank = true;
	}
	
	function showPainList(){
		var newContent = "<h1>"+painText+"</h1><div class='pain-list'>";
		fadeInNewContent(newContent, ".inner");
		var nextContent = "";
		for(i = 1; i < 7; i++){
			nextContent += "<div class='pain-"+i+"'></div>";
		}
		fadeInNewContent(nextContent, ".pain-list:last-child");
		$(".inner").append("</div>");
	}
	
	function logPainLevel(painLevel){
		pain.push(parsePainLevel(painLevel));
		showNewQuestion();
	}
	
	function parsePainLevel(painLevel){
		var painNumber = parseInt(painLevel.charAt(5));
		return painNumber;
	}
	
	function computeResult(){
/*
		var combinedAnswers = []; 
		for(i = 0; i < pain.length; i++) {
		    var hash = {};
		    hash[pain[i]] = answers[i];
		    combinedAnswers.push(hash);
		}					
		console.log(combinedAnswers);

		$.each( combinedAnswers, function( key, value ) {
			console.log( key + ": " + value );
		});

*/
//answers are sorted by worst to best
//answers are pushed to a canvas
		$(".inner").children().addClass("invisible");

		for(i=0;i<pain.length;i++){
			var newContent = "<div class='result-holder'><div class='pain pain-"+pain[i]+"'></div><div>"+answers[i]+"</div></div>";
			fadeInNewContent(newContent, ".inner");
		}

	}
	
	function fadeInNewContent(newContent, destination){
		$(newContent).hide().appendTo(destination).fadeIn(fadeInSpeed);
		var newPos = $(".inner").children().last().offset().top;
			$('html, body').animate({
				scrollTop: newPos+posOffset
			}, 800, "linear");
	}
	
	$(document).on('focus', 'input:text', function(){
		$(".completedQuestions").addClass("invisible");
	});

	$(document).on('keypress', 'input:text', function(e){
		if(e.which == 13){
			checkIfBlank($(this).val());
		}
	});

	$(document).on('focusout', 'input:text', function(){
		checkIfBlank($(this).val());
	});

	function checkIfBlank(fieldVal){
		if(fieldVal!="" && currentFieldBlank == true){
			answers.push(fieldVal);
			showPainList();
			currentFieldBlank = false;
		}		
	}
	
	$(document).on('click', '.completedQuestions', function(){
		computeResult();
	});
	
	$(document).on('click', '.pain-list div', function(){
		logPainLevel($(this).attr("class"));
	});
	
	
	Array.prototype.randomElement = function () {
		return this[Math.floor(Math.random() * this.length)]
	}

// when you load the page, it's automatically focused on the input field on mobile

});
