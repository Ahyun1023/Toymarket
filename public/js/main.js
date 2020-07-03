var slide_index = 1;
show_slide(slide_index);

function plus_slide(n) {
  show_slide(slide_index += n);
}

function current_slide(n) {
  show_slide(slide_index = n);
}

function show_slide(n) {
  var i;
  var slide = document.getElementsByClassName("slide");
  var dots = document.getElementsByClassName("dot");
  if (n > slide.length){
    slide_index = 1
  }
  if(n < 1){
    slide_index = slide.length
  }
  for(i = 0; i < slide.length; i++) {
      slide[i].style.display = "none";  
  }
  for(i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slide[slide_index-1].style.display = "block";  
  dots[slide_index-1].className += " active";
}