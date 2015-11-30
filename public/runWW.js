(function(window) {

  var width=100;
  var height= 300;

  var canvas = window.document.querySelector('#ga');
  var ctx = canvas.getContext("2d");
  var statusDom = window.document.querySelectorAll('.status');
  var progressDom = window.document.querySelectorAll('progress');
  function log(index, text) {
    statusDom[index].textContent = text;
  }
  function logProgress(index, progress) {
    if(progressDom[index].max === 1){
        progressDom[index].max = progress;
    }
    progressDom[index].value = progressDom[index].max - progress;
  }

  // function that draws the data as an array of pixels on a canvas
  function drawResult(id) {
    var arr = new Uint8ClampedArray(arrays[id]);
    ctx.putImageData(new ImageData(arr, 100, 300), id * 100, 0);
  }

  // Creation of 10 WebWorkers
  var workers = [];
  for (var i = 0; i < 10; i++) {
    workers.push(new Worker("ww.js"));
  }

  var workers_id = 0;
  var arrays = [];

  workers.forEach(function(worker) {

    function handler(event) {
      var id = event.data.id;

      arrays[id] = event.data.data;
      drawResult(id);

      if (event.data.fitness > 0) {
        log( id, ' round '+event.data.round );
        logProgress(id, event.data.fitness);

        worker.postMessage({
          'id': id,
          'data': arrays[id]
        }, [arrays[id]]);
      } else {
        log(id, ' round '+event.data.round+' / terminated');
        logProgress(id, event.data.fitness);
        worker.terminate();
      }
    }

    worker.addEventListener("message", handler, false);


    var SIZE = 100 * 300 * 4;
    var arrayBuffer = null;
    var view = null;
    var originalLength = null;

    //log('creating a ' + SIZE + ' bytes long buffer');

    arrayBuffer = new ArrayBuffer(SIZE);
    view = new Uint8Array(arrayBuffer);
    originalLength = view.length;
    var i = 0;
    while (i < originalLength) {
      view[i++] =  Math.floor(Math.random()*256);
      view[i++] =  Math.floor(Math.random()*256);
      view[i++] =  Math.floor(Math.random()*256);
      view[i++] = Math.floor(Math.random()*256);//255;
    }
    arrays[workers_id] = view.buffer;
    drawResult(workers_id);
    var data = {
      'id': workers_id++,
      'data': view.buffer
    };

    worker.postMessage(data, [view.buffer]);
  });

})(window);
