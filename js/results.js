$( document ).ready(function() {								
$.getJSON( "./questions.json", function( json ) {
var questions = json;
var ratings = formatURLString(parseURL());

//add overall average / highest variation in footer?

                                
drawDartboard();
selectOn(calcLowest());
populateFooter();

function populateFooter(){
var format = d3.time.format("%b %d");
var dateConvert = format(new Date());
  $("footer .date h2").text(dateConvert);
  $("footer .total-responses h2").text(ratings.responses);
  $("footer .lowest-average h2").text(calcAverage(calcLowest()));
  $("footer .highest-average h2").text(calcAverage(calcHighest()));
  $("footer .lowest-average p").text(questions.descriptions[calcLowest()].title);
  $("footer .highest-average p").text(questions.descriptions[calcHighest()].title);
}

$("li.highest-average").click(function(){
  selectOn(calcHighest());
});

$("li.lowest-average").click(function(){
  selectOn(calcLowest());
});

function parseURL(){
  var query = window.location.search.substring(5);
  var URLresponses = query.split(",");
  var newArr=[];
  if(URLresponses.length < 12){
    newArr = questions.ratings;
  }else{
    var newArr = [];
    newArr.push(URLresponses);
  }
  return newArr;
}

function formatURLString(allData){
  var formattedData = [];
  var returnData={};
  for(k=0;k<questions.descriptions.length;k++){
      var newObj = [0,0,0,0,0];
      for(l=0;l<allData.length;l++){
        switch(parseInt(allData[l][k])){
          case 1:
            newObj[0]++;
          break;
          case 2:
            newObj[1]++;
          break;
          case 3:
            newObj[2]++;
          break;
          case 4:
            newObj[3]++;
          break;
          case 5:
            newObj[4]++;
          break;
        }
      }
      formattedData.push(newObj);
  }
  returnData.responses = allData.length;
  returnData.data = formattedData;
  return returnData;  
}

function calcAverage(index){
  var total = 0;
  var responses = ratings.responses;
  for(j=0;j<ratings.data[0].length;j++){
    total += (ratings.data[index][j]*(j+1));
  }
  total = total/responses;
  return total.toFixed(1);
}

function calcLowest(){
  var lowScore = {score: 5,index: 0};
  for(i=0;i<ratings.data.length;i++){
    var average = calcAverage(i);
      if(average < lowScore.score){
        lowScore.score = average;
        lowScore.index = i;
      }
  }
  return lowScore.index;
}

function calcHighest(){
  var highScore = {score: 0,index: 0};
  for(i=0;i<ratings.data.length;i++){
    var average = calcAverage(i);
      if(average > highScore.score){
        highScore.score = average;
        highScore.index = i;
      }
  }
  return highScore.index;
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
      .data(questions.descriptions)
      .enter()
      .append("g")
      .attr("class","arcGroup")
      .attr("data",function(d,i){ return i;})
      .attr("title",function(d,i){ return d.title;})
      .attr("transform", function(d,i){ return "translate(" + width / 2 + "," + height / 2 + ") rotate("+ 30*i +")";});
  
  
  var newText= arcGroup.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "0em")
      .attr("dx", "0em")
      .text(function(d) { return d.title; })
      .style('text-anchor', function(d,i){ 
        var orientation;
        if(i<6){
          orientation = "start";
        }else{
          orientation = "end";
        }
        return orientation;
      });
      
  svg.selectAll("text")
      .data(questions.descriptions)
      .attr("transform", function(d,i){ 
           return "translate(" + 55 + "," + -235 + ") rotate("+ -30*i +")";
      })
      .moveToFront();
  
  
  var arc = d3.svg.arc()
      .innerRadius(function(d,i) { return (d.index + spacing / 2) * radius; })
      .outerRadius(function(d) { return (d.index + spacing / 2); })
      .cornerRadius(0)
      .startAngle(0)
      .endAngle(0.1667 * Math.PI);
  
  var isFilled;
  var arcPath = arcGroup.selectAll("path")
      .data(circleRadii)
      .enter()
      .append("path")
      .attr("class",function(d,i){ 
        var index = d3.select(this.parentNode).attr("data");
        var fill = "";
        if(i+1>isFilled){
          fill = "unfilled";
        }else{ fill = "filled"}
        if(i==0){
          isFilled = calcAverage(index);
        }
        return "arc " + fill; })
      .attr("d", arc);
  
  var bullseye = d3.selectAll(".bullseye")
      .moveToFront();
  
  arcGroup.on("click",function(){
    selectOn(d3.select(this).attr("data"));
  });
  
  arcGroup.on("mouseover",function(){
    d3.selectAll(".arcGroup").classed("highlight",false);
    var sel = d3.select(this);
    sel.classed("highlight",true);
  });
  
  arcGroup.on("mouseout",function(){
     d3.selectAll(".arcGroup").classed("highlight",false); 
  });
}  

function selectOn(index){
  d3.selectAll(".arcGroup").classed("selected",false).classed("highlight",false);
  var sel = d3.select("[data='"+index+"']");
  sel.classed("selected",true);
  changePanel(index);  
}

function changePanel(index){
  var average = parseInt(calcAverage(index));
  var colorCode;
  switch(average){
    case 1:
      colorCode = "dartboard-lowest";
    break;
    case 2:
      colorCode = "dartboard-second-lowest";
    break;
    case 3:
      colorCode = "dartboard-middle";
    break;
    case 4:
      colorCode = "dartboard-second-highest";
    break;
    case 5:
      colorCode = "dartboard-highest";
    break;
  }
  
  $(".results-panel .content").html("");
  if(calcLowest()==index){
    $(".results-panel .content").append("<span class='lowest-score'>Lowest Average</span>"); 
    colorCode = "dartboard-error";   
  }
  if(calcHighest()==index){
    $(".results-panel .content").append("<span class='highest-score'>Highest Average</span>"); 
    colorCode = "dartboard-highest";   
  }
  $(".results-panel .content").append("<h1>"+questions.descriptions[index].title+"</h1>");
  $(".results-panel .content").append("<h2 class='"+colorCode+"'><span>Team average: </span>"+calcAverage(index)+"</h2>");
  $(".results-panel .content").append("<h4>Previous Average: <span>"+questions.descriptions[index].previous+"</span></h4>");
  if(questions.descriptions[index].intro){
    $(".results-panel .content").append("<p>"+questions.descriptions[index].intro+"</p>");  
  }
  if(questions.descriptions[index].tools){
    $(".results-panel .content").append("<h3>Tools</h3");  
    for(m=0;m<questions.descriptions[index].tools.length;m++){
      if(questions.descriptions[index].tools[m].link){
          $(".results-panel .content").append("<a href='>"+questions.descriptions[index].tools[m].link+"'>"+questions.descriptions[index].tools[m].name+"</a>");
      }else{
        $(".results-panel .content").append("<p>"+questions.descriptions[index].tools[m].name+"</p>");      
      }
    }
  }
  if(questions.descriptions[index].furtherReading){
    $(".results-panel .content").append("<h3>Further Reading</h3");  
    for(m=0;m<questions.descriptions[index].furtherReading.length;m++){
      $(".results-panel .content").append("<p><a href='>"+questions.descriptions[index].furtherReading[m].link+"'>"+questions.descriptions[index].furtherReading[m].title+"</a></p>");
    }
  }
  
  //if there's further reading, list it and link it
  updateBarGraph(ratings.data[index]);
}

function updateBarGraph(data){
  var barwidth = $("div.results-panel").width()-70,
    barheight = 150;
                                        
  var barsvg = d3.select("div.results-panel").append("svg")
      .attr("width", barwidth)
      .attr("height", barheight);

  var defs = barsvg.append("defs");
  
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
      
  var singleBar = barwidth/5;
      
  var rects = barsvg.selectAll("rect")
    .data(data);
  
  rects.enter().append("rect").style("filter", "url(#drop-shadow)")
   .attr("width", barwidth/5)
   .attr("height", function(d){ return (d*12)+3;})
   .attr("x", function(d,i){ return singleBar*i;})
   .attr("y", function(d){ return barheight-((d*12)+40);})
   .attr("class",function(d){ return "getrect ";});
   
   rects.exit().remove();
    rects.transition().duration(750)
      .attr("y", function(d){ return barheight-((d*12)+40);})
      .attr("height", function(d) { return (d*12)+3; });
  
  var texts = barsvg.selectAll("text")
    .data(data);
    
    texts.enter().append("text")
      .attr("x", function(d,i){ return (i*singleBar)+(singleBar/2); })
      .attr("y", function(d){ return barheight-20;})
      .style("text-anchor", "end")
      .text(function(d,i){ return i+1;});
     texts.exit().remove();
  
  var labels = barsvg.selectAll("test")
    .data(data);
    
    labels.enter().append("text")
      .attr("x", function(d,i){ return (i*singleBar)+(singleBar/2); })
      .attr("y", function(d,i){ return barheight-((d*12)+3)-50;})
      .style("text-anchor", "end")
      .attr("class","legend")
      .text(function(d){ return d;});
    labels.exit().remove();
               
barsvg.append("text")
  .attr("class", "legend")
  .attr("width",barwidth)
  .attr("height","15")
  .style('text-anchor', "middle")
  .attr("x",function(d){ return barwidth/2;})
  .attr("y",function(d){ return barheight;})
  .text("Response Distribution");
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