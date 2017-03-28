$( document ).ready(function() {								

$.getJSON( "./questions.json", function( json ) {
	var questions = json.descriptions;

//scale up dartboard
//refine colors
//hover state on dartboard only if it's okay


// -- ASSESSMENT PAGE --
	var quizPosition = 0;
	var allowNext = false;
	var quizIsDone = false;
	var currentRating = 0;
	var ratings = [];
	iterateQuizPosition();
	$("#thanks").hide();
	drawDartboard();

	$("fieldset button").click(
		function(){
			var buttonRating = $(this).text();
      addRating(buttonRating,quizPosition);
      currentRating = buttonRating;
		}
	);	

	$("button.next").click(
		function(event){
			if(allowNext){
				iterateQuizPosition();
				resetQuizStatus();
				logResponse();
				allowNext = false;
				if(quizIsDone){
					showYourResponses();
				}
			}
		}
	);
	
	function logResponse(){
  	ratings.push(currentRating);
 	}
	
	function showYourResponses(){
		$("#thanks").show();
	}
	
	$("#thanks button").click(function(){
      window.location = "results.html?val="+ratings;
	});
	
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

  function drawDartboard(){
                                
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  var width = $("div.dartboard-panel").width(),
    height = $("div.dartboard-panel").height(),
    radius = Math.min(width, height) / 1.3,
    spacing = .095;

  var svg = d3.select("div.dartboard-panel").append("svg")
      .attr("width", width)
      .attr("height", height);
  
  var defs = svg.append("defs");
  
  var filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "200%")
      .attr("width", "200%");
  
  filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3.5)
      .attr("result", "blur");
  
  filter.append("feColorMatrix")
      .attr("in","blur")
      .attr("type","matrix")
      .attr("values","1 0 0 0 0 0 1 0.1 0 0 0 0 0.7 0 0.5 0 0 0 0.3 -0.04")
      .attr("result","matrixOut");
      
  filter.append("feOffset")
      .attr("in", "matrixOut")
      .attr("dx", 3.5)
      .attr("dy", 3.5)
      .attr("result", "offsetBlur");
  
  var feMerge = filter.append("feMerge");
  
  feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
      .attr("in", "matrixOut");
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
      
  
  var circles = svg.selectAll("circle")
    .data(circleRadii)
    .enter()
    .append("circle").style("filter", "url(#drop-shadow)");
  
  var circleAttributes = circles
     .attr("cx", width/2)
     .attr("cy", height/2)
     .attr("r", function (d) { return (d.index + spacing / 2) * radius; })
     .attr("class",function(d){ return "circle " + d.class;});
  
  var arcGroup = svg.selectAll("g")
      .data(questions)
      .enter()
      .append("g")
      .attr("class","arcGroup")
      .attr("data",function(d,i){ return i;})
      .attr("title",function(d,i){ return d.title;})
      .attr("transform", function(d,i){ return "translate(" + width / 2 + "," + height / 2 + ") rotate("+ 30*i +")";});
    
  var arc = d3.svg.arc()
      .innerRadius(function(d,i) { return (d.index + spacing / 2) * radius; })
      .outerRadius(function(d) { return (d.index + spacing / 2); })
      .cornerRadius(0)
      .startAngle(0)
      .endAngle(0.1667 * Math.PI);
  
  var arcPath = arcGroup.selectAll("path")
      .data(circleRadii)
      .enter()
      .append("path")
      .attr("class","arc")
      .attr("data", function(d){ return d.class;})
      .attr("d", arc);
  
  var bullseye = d3.selectAll(".bullseye")
      .moveToFront();

  
  arcPath.on("click",function(){
    var sel = d3.select(this);
    var index = d3.select(this.parentNode).attr("data");
    index++;
    if(index == quizPosition){
      addRating(sel.attr("data").substr(7),quizPosition);
    }
  });

}  

function addRating(rating,index){
  var activeButton = $('button:contains("'+rating+'")');
  activeButton.addClass("active");
  activeButton.prevAll().addClass("active");
  activeButton.nextAll().removeClass("active");

  index = index-1;
  $("g.arcGroup[data='"+index+"'] path").removeClass("selected unselected");
  var ratingGroup = $("g.arcGroup[data='"+index+"'] path");
  for(j=0;j<ratingGroup.length;j++){
    if((j)<rating){
      $(ratingGroup[j]).addClass("selected");
    }else{
      $(ratingGroup[j]).addClass("unselected");      
    }    
  }

	$("button.next").removeClass("inactive");
	allowNext = true;

}

function circleRadii() {
  return [
    {index: .5, class: "circle-1"},
    {index: .4, class: "circle-2"},
    {index: .3, class: "circle-3"},
    {index: .2, class: "circle-4"},
    {index: .12, class: "circle-5"},
    {index: .05, class: "bullseye"}
  ];
}


 });
});