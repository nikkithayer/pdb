$( document ).ready(function() {								

$("button.next").addClass("inactive");

$("fieldset button").hover(
	function(){
		$(this).addClass("selected");
		$(this).prevAll().addClass("selected");
		$(this).nextAll().removeClass("selected");
	}
);	

});
