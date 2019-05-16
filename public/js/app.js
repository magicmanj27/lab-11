


$(document).ready(function(){
  $('.formButton').on('click', function(e){
    console.log($(e.target).next());
    $(e.target).next().toggle(this);
  });
});

