var canvas = document.getElementById('signature');
var ctx = canvas.getContext("2d");
var drawing = false;
var prevX, prevY;
var currX, currY;
var signature = document.getElementsByName('signature')[0];
var nameInput = document.getElementById('nameInput');
var titleInput = document.getElementById('titleInput');

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stop);
canvas.addEventListener("mousedown", start);

function start(e) {
  drawing = true;
}

function stop() {
  drawing = false;
  prevX = prevY = null;
  signature.value = canvas.toDataURL();
}

function draw(e) {
  if (!drawing) {
    return;
  }
  // Test for touchmove event, this requires another property.
  var clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  var clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  currX = clientX - canvas.offsetLeft;
  currY = clientY - canvas.offsetTop;
  if (!prevX && !prevY) {
    prevX = currX;
    prevY = currY;
  }

  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  prevX = currX;
  prevY = currY;
}

function onSubmit(e) {
  console.log({
    'name': nameInput.value,
    'signature': signature.value,
  });
  return false;
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  signature.value = '';
}

function clearForm() {
  nameInput.value = '';
  titleInput.value = '';
  clearSignature();
}

function saveSignature() {
  var formName = document.getElementsByName('name')[0].value;
  var formTitle = document.getElementsByName('title')[0].value;

  // Save the drawn signature as a PNG
  domtoimage.toBlob(canvas)
    .then(function(signatureBlob) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a new image element for the saved signature
      var img = new Image();
      img.onload = function() {
        // Draw the saved signature onto the canvas
        ctx.drawImage(img, 0, 0);

        // Draw the additional text
        ctx.fillStyle = "red";
        ctx.font = "bold 12px Verdana";
        ctx.textAlign = 'center';
        
        // Combine name and title into a single line
        var combinedText = formName + ' ' + formTitle;

        ctx.fillText(combinedText, canvas.width / 2, canvas.height - 10);

        // Save the combined result as a PNG
        domtoimage.toBlob(canvas)
          .then(function(combinedBlob) {
            var url = URL.createObjectURL(combinedBlob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'signature.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          })
          .catch(function(error) {
            console.error('Error saving combined signature:', error);
          });
      };
      img.src = URL.createObjectURL(signatureBlob);
    })
    .catch(function(error) {
      console.error('Error saving signature:', error);
    });
}
