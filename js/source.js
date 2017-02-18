$( document ).ready(function() {								

$("button.next").addClass("inactive");

$("fieldset button").click(
	function(){
		$(this).addClass("active");
		$(this).prevAll().addClass("active");
		$(this).nextAll().removeClass("active");
		$("button.next").removeClass("inactive");
	}
);	


});
