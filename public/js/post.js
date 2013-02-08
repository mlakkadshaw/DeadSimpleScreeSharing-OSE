
var STATUS = null;
$(document).ready(function() {
  $("#about_pop").popover();
  
  $("#about_pop").hover(function() {
    $(this).popover('show');

    $(".popover").hover(function() {
      console.log("Handler Called")
      $(this).show();
    }, function() {
      $(this).hide();
    });
  }, function() {
    
  });

  

});

function connect() {
  var socket = io.connect(document.location.href)
  socket.on("status", function(data) {
    STATUS = data.data;
  });
  console.log("Connect Called");
  return socket;
}

function send(data) {
  if((typeof data == 'object') && (data.__proto__ !== Blob.prototype)) {
    data = JSON.stringify(data)
  }
  console.log("Send Called");
  socket.emit('stream', {'data':data})
}

function convertDataURIToBlob(dataURI, mimetype) {
  if (!dataURI) {
    return new Uint8Array(0);
  }

  var BASE64_MARKER = ';base64,';
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var uInt8Array = new Uint8Array(raw.length);

  for (var i = 0; i < uInt8Array.length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  


  return new Blob([uInt8Array], {type: mimetype});
}

// do {
//   var id = prompt('Enter a session id');
// } while (!id);


var screenshot = document.querySelector('#screenshot');
screenshot.onload = function(e) {
  window.webkitURL.revokeObjectURL(this.src);
};


var socket = connect();
// var img = new Image();
// var myCanvas = document.getElementById("screen");
// var ctx = myCanvas.getContext('2d');

// img.onload = function() {
//  // ctx.drawImage(img,800,600);
// }
socket.on('test', function(data) {
  console.log("TEST RECIVED");
});

socket.on('no_connection', function(data) {
  $("#connection_status").html('No Connection');
});

socket.on('op_stream', function(e) {
  $("#connection_status").html('Connected');
  //var data = e.data;
   //img.src = data;
  // ctx.drawImage(img,0,0,800,600);
  //console.log(e);

  //var data = convertDataURIToBlob(e.data)
  var data = e.data;
  screenshot.src = data;
});

