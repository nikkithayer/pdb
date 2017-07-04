$( document ).ready(function() {								

  $(".hidden").hide();

  $("#admin-login button").click(function(){
    $("#admin-login").hide();
    $("#dashboard").show();
  });
  
  $("#dashboard button").click(function(){
    $("#dashboard").hide();
    $("#new-client").show();
  });
  
  $("#dashboard a").click(function(){
    $("#dashboard").hide();
    $("#project").show();
  });
  
  $("#new-client").click(function(
    
  ));

});