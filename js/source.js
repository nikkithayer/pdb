$( document ).ready(function() {								

$("button.next").addClass("inactive");
var buttonRating = 0;

console.log($("div.response").width());

$("fieldset button").click(
	function(){
		$(this).addClass("active");
		$(this).prevAll().addClass("active");
		$(this).nextAll().removeClass("active");
		$("button.next").removeClass("inactive");
		$("#display-progress").addClass("click");
		buttonRating = $(this).text();
		console.log($("#display-progress").children("g"));
	}
);	

});
//chart displays reliably in lower left
//chart rotates when you click next
//data moves when you click next (no animation, rails model for quiz questions tbd)
//questions stored as json probably
//chart lights up with appropriate light up