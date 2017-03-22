$( document ).ready(function() {								
$.getJSON( "./questions.json", function( json ) {
var questions = json;

//text doesn't show up except maybe on hover
//content fades in and out next door
//brightened selected state
//bar graph                
                                
var width = $("div.dartboard-panel").width(),
  height = $("div.dartboard-panel").height(),
  radius = Math.min(width, height) / 1.2,
  spacing = .095;
                                
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

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

var arcPath = arcGroup.selectAll("path")
    .data(fields)
    .enter()
    .append("path")
    .attr("class",function(d,i){ 
var isFilled = Math.floor(Math.random()*4)+1;
      var unfilled = "";
      if(isFilled <= i){
        unfilled = "unfilled";
        isFilled = 0;
      }
      return "arc " + unfilled;})
    .attr("d", arc);

var bullseye = d3.selectAll(".bullseye")
    .moveToFront();

arcGroup.on("mouseover",function(){
  var sel = d3.select(this);
  sel.classed("selected",true);
});

arcGroup.on("mouseout",function(){
  var sel = d3.select(this);
  sel.classed("selected",false);
  changePanel(getIndex(sel));
});

function getIndex(sel){
  return sel.attr("data");
}

function changePanel(index){
  $(".results-panel .content").html("");
  $(".results-panel .content").append("<h1>"+questions[index].title+"</h1>");
  $(".results-panel .content").append("<h2><span>Team average: </span>"+questions[index].average+"</h2>");
  $(".results-panel .content").append("<p>"+questions[index].description+"</p>");
  var random = [];
  for(i=0;i<5;i++){
    random.push(Math.floor(Math.random()*9)+1);
  }
  updateBarGraph(random);
}

var barwidth = $("div.results-panel").width()-70,
  barheight = 150;
                                  
var barsvg = d3.select("div.results-panel").append("svg")
    .attr("width", barwidth)
    .attr("height", barheight);
    
function updateBarGraph(data){
var rects = barsvg.selectAll("rect")
  .data(data);

  rects.enter().append("rect")
   .attr("width", barwidth/fields().length)
   .attr("height", function(d){ return (d*15)+3;})
   .attr("x", function(d,i){ return barwidth/fields().length*i;})
   .attr("y", function(d){ return barheight-((d*15)-20);})
   .attr("class",function(d){ return "getrect ";});
   
   rects.exit().remove();
    rects.transition().duration(750)
       .attr("y", function(d) { return barheight - (d*15)-20; })
       .attr("height", function(d) { return (d*15)+3; });

var texts = barsvg.selectAll("text")
  .data(data);
  
  texts.enter().append("text")
    .attr("x", function(d,i){ return (i*barwidth/fields().length)+(barwidth/fields().length/2); })
    .attr("y", function(d){ return barheight;})
    .style("text-anchor", "end")
    .text(function(d){ return d;});
   texts.exit().remove();

    texts.transition().duration(750)
      .text(function(d){ return d;});
    
}

updateBarGraph([1,3,5,0,6])


function circleRadii() {
  return [
    {index: .5, class: "circle-1"},
    {index: .4, class: "circle-2"},
    {index: .3, class: "circle-3"},
    {index: .2, class: "circle-4"},
    {index: .12, class: "circle-5"},
    {index: .05, class: "root-bullseye bullseye"}
  ];
}

function fields() {
  return [
    {index: .5},
    {index: .4},
    {index: .3},
    {index: .2},
    {index: .12}
  ];
}

});
});