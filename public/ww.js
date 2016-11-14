var id = 0;
var maxFitness = 100000000000;
var maxIndex = 0;

var width=100;
var height = 300;
var round = 1;
var off = {
  fitness: 0,
  arr: new Uint8Array(new ArrayBuffer(width*4))
};
this.addEventListener('message', function(e) {
  id = e.data.id || id;
  var arr = new Uint8Array(e.data.data);

  function fitness(i) {
    var diff = 0;
    for (var j = 1; j < width; j++) {
      /*rouge*/
      diff += Math.pow(arr[i * width * 4 + (j - 1) * 4] - arr[i * width * 4 + (j) * 4], 2);
      /*vert*/
      diff += Math.pow(arr[i * width * 4 + (j - 1) * 4 + 1] - arr[i * width * 4 + (j) * 4 + 1], 2);
      /*bleu*/
      diff += Math.pow(arr[i * width * 4 + (j - 1) * 4 + 2] - arr[i * width * 4 + (j) * 4 + 2], 2);
      /*alpha*/
      diff += Math.pow(arr[i * width * 4 + (j - 1) * 4 + 3] - arr[i * width * 4 + (j) * 4 + 3], 2);
    }
    return diff;
  }

  function offspring(i, j) {
    var cut = Math.floor(Math.random()*width);


    // for (var k = 0; k < width; k++) {
    //   if (k <cut) {
    //     off.arr[k * 4] = (arr[i * width * 4 + k * 4]);
    //     off.arr[k * 4 + 1] = (arr[i * width * 4 + k * 4 + 1]);
    //     off.arr[k * 4 + 2] = (arr[i * width * 4 + k * 4 + 2]);
    //     off.arr[k * 4 + 3] = (255);
    //   } else {
    //     off.arr[k * 4] = (arr[j * width * 4 + k * 4]);
    //     off.arr[k * 4 + 1] = (arr[j * width * 4 + k * 4 + 1]);
    //     off.arr[k * 4 + 2] = (arr[j * width * 4 + k * 4 + 2]);
    //     off.arr[k * 4 + 3] = (255);
    //   }
    // }

    for (var k = 0; k < width-cut; k++) {

        off.arr[k * 4] = (arr[i * width * 4 + (k+cut) * 4]);
        off.arr[k * 4 + 1] = (arr[i * width * 4 + (k+cut) * 4 + 1]);
        off.arr[k * 4 + 2] = (arr[i * width * 4 + (k+cut) * 4 + 2]);
        off.arr[k * 4 + 3] = (arr[i * width * 4 + (k+cut) * 4 + 3]);//(255);
      }
    for ( k = width-cut; k < width; k++) {
        off.arr[k * 4] = (arr[j * width * 4 + (k-(width-cut)) * 4]);
        off.arr[k * 4 + 1] = (arr[j * width * 4 + (k-(width-cut)) * 4 + 1]);
        off.arr[k * 4 + 2] = (arr[j * width * 4 + (k-(width-cut)) * 4 + 2]);
        off.arr[k * 4 + 3] = (arr[j * width * 4 + (k-(width-cut)) * 4 + 3]);//(255);

    }

    off.fitness = 0;
    for (k = 1; k < width; k++) {
      /*rouge*/
      off.fitness += Math.pow(off.arr[(k - 1) * 4] - off.arr[(k) * 4], 2);
      /*vert*/
      off.fitness += Math.pow(off.arr[(k - 1) * 4 + 1] - off.arr[(k) * 4 + 1], 2);
      /*bleu*/
      off.fitness += Math.pow(off.arr[(k - 1) * 4 + 2] - off.arr[(k) * 4 + 2], 2);
      /*alpha*/
      off.fitness += Math.pow(off.arr[(k - 1) * 4 + 3] - off.arr[(k) * 4 + 3], 2);
    }
    //return off;
  }
  for (var time = 0; time < 10; time++) {

    var j = Math.floor(Math.random() * (height));
    var i;
    do{
      i = Math.floor(Math.random() * (height));
    } while(i==j);

    var f1 = fitness(i);
    if (maxFitness > f1){
      maxFitness = f1;
      maxIndex = i;
    }
    var f2 = fitness(j);
    if (maxFitness > f2){
      maxFitness = f2;
      maxIndex = j;
    }
    offspring(i, j);
    if (maxFitness > off.fitness){
      maxFitness = off.fitness;
    }
    if (f1 < f2 && off.fitness < f2) {
      if(f1>off.fitness){
        maxIndex = j;
      }
      for (var k = 0; k < width*4; k++) {
        arr[j * width * 4 + k] = off.arr[k];
      }
    } else if (f2 < f1 && off.fitness < f1) {
      if(f2>off.fitness){
        maxIndex = i;
      }
      for (var k = 0; k < width*4; k++) {
        arr[i * width * 4 + k] = off.arr[k];
      }
    }


  }

  postMessage({
    'id': id,
    'data': arr.buffer,
    'fitness': maxFitness,
    'round':round++,
    'index':maxIndex
  }, [arr.buffer]);
});
