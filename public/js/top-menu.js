$(document).ready(function () {
  console.log('fuck');
  $("#men_ex").hide();
  $(".fa-bars").click(function () {
    $("#men_ex").slideToggle(1000);
  });
});
