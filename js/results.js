$( document ).ready(function() {								
$.getJSON( "./questions.json", function( json ) {
var questions = json;

//text doesn't show up except maybe on hover
//correctly place distribution label
//color code averages
                                
drawDartboard();
changePanel(calcLowest());


function drawDartboard(){
                                
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  var width = $("div.dartboard-panel").width(),
    height = $("div.dartboard-panel").height(),
    radius = Math.min(width, height) / 1.2,
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
  
  /*
  var newText= arcGroup.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "-18em")
      .text(function(d) { return d.title; })
      .attr("font-family", "sans-serif")
      .attr("font-weight", "lighter")
      .attr("font-size", "14px")
      .attr("fill", "white");
      
  svg.selectAll("text")
      .data(questions)
      .attr("transform", function(d,i){ console.log(d,i); return "translate(" + 0 + "," + 0 + ") rotate("+ -30*i +")";});
  */
  
  var arc = d3.svg.arc()
      .innerRadius(function(d,i) { return (d.index + spacing / 2) * radius; })
      .outerRadius(function(d) { return (d.index + spacing / 2); })
      .cornerRadius(0)
      .startAngle(0)
      .endAngle(0.1667 * Math.PI);
  
  var isFilled = calcAverage(0);
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
    d3.selectAll(".arcGroup").classed("selected",false).classed("highlight",false);
    var sel = d3.select(this);
    sel.classed("selected",true);
    changePanel(getIndex(sel));
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

function getIndex(sel){
  return sel.attr("data");
}

function changePanel(index){
  $(".results-panel .content").html("");
  $(".results-panel .content").append("<h1>"+questions[index].title+"</h1>");
  $(".results-panel .content").append("<h2><span>Team average: </span>"+calcAverage(index)+"</h2>");
  $(".results-panel .content").append("<p>"+questions[index].description+"</p>");
  updateBarGraph(questions[index].ratings);
}

function calcAverage(index){
  var ratings = questions[index].ratings;
  var total = 0;
  for(j=0;j<ratings.length;j++){
    total += (ratings[j]*(j+1));
  }
  total = total/11;
  return total.toFixed(1);
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
   .attr("y", function(d){ return barheight-((d*12)+20);})
   .attr("class",function(d){ return "getrect ";});
   
   rects.exit().remove();
    rects.transition().duration(750)
      .attr("y", function(d){ return barheight-((d*12)+20);})
      .attr("height", function(d) { return (d*12)+3; });

  
  var texts = barsvg.selectAll("text")
    .data(data);
    
    texts.enter().append("text")
      .attr("x", function(d,i){ return (i*singleBar)+(singleBar/2); })
      .attr("y", function(d){ return barheight;})
      .style("text-anchor", "end")
      .text(function(d){ return d;});
     texts.exit().remove();
  
      texts.transition().duration(750)
        .text(function(d){ return d;});    
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

function calcLowest(){
  var lowScore = {score: 5,index: 0};
  for(i=0;i<questions.length;i++){
    var average = calcAverage(i);
      if(average < lowScore.score){
        lowScore.score = average;
        lowScore.index = i;
      }
  }
  return lowScore.index;
}

});
});