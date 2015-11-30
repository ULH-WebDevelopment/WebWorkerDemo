(function(global) {
  var colors = ['#f4b2a7', '#f4e7a7', '#e4f4a7', '#b2f4a7', '#a7f4d3', '#a7f1f4', '#bba7f4', '#f2a7f4', '#f4a7d5', '#f4a7a7'];
  var anim = document.querySelector('#anim');
  var ctx = anim.getContext("2d");
  var inc = 7;
  var old = Date.now();
  var avg;

  function draw(i) {
    ctx.clearRect(0, 0, 300, 300);
    var t = Date.now();
    if (typeof avg === 'undefined') {
      avg = 1000 / (t - old);
    }
    avg = avg * 0.9 + (1000 / (t - old)) * 0.1;
    ctx.fillStyle = 'black';
    ctx.fillText(Math.floor(avg) + " fps", 10, 30);
    old = t;
    for (var j = 0; j < 10; j++) {
      ctx.beginPath();
      ctx.arc(150, 150, 150, (Math.PI / 180) * ((j * 36 + i) % 360), (Math.PI / 180) * (((j + 1) * 36 + i + 1) % 360));
      ctx.lineTo(150, 150);
      ctx.closePath();
      ctx.fillStyle = colors[j];
      ctx.fill();
    }
    requestAnimationFrame(function() {
      draw((i + inc) % 360);
    });

  }
  requestAnimationFrame(function() {
    draw(0);
  });

}(this));
