$(document).ready(function(){
 var data = ["MATH101C","ENGL101A","COMM111"];
  
  for (i = 1; i <= data.length; i++){
    var radioBtn = $('<input type="radio" name="rbtnCount onclick="dothis(this)'+ i +'"/>'+ i +'<br />');
    radioBtn.appendTo('#listBtn');
  }
  var radthis = false; 
  // must match default radio state true if checked, false if not         
  function dothis(elem) {
  	(radthis && elem.checked) ? (elem.checked = false) : (elem.checked = true);                
  	radthis = elem.checked;            
  } 
});