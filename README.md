# WebWorker Demo

This WebApp is a simple demonstration of the usage of WebWorkers. The app shows that heavy computation work can be done on WebWorkers without affecting the main process' performances.

## The main App

The first part of the app shows a rotating rainbow-colored disc rendered at optimal frame rate (60 fps) using the  [`requestAnimationFrame()`](https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame) function. The code for this animation is located in the `public/anim.js` file.

The lower part is composed of a rectangular area (1000x300) filled with randomly colored pixels. This area is composed of 10 arrays of random data coding for the color of each pixel. Each array of data is given to a WebWorker that does some computation on it and then return it back to main process.

### Creating workers

The app creates 10 WebWorkers and assign them a script name (`ws.js`) that they will load :

```javascript
// Creation of 10 WebWorkers
var workers = [];
for (var i = 0; i < 10; i++) {
  workers.push(new Worker("ww.js"));
}
```

### sending data to workers

An array of data is created foreach worker. We use [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and binary buffers ([ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)). These are fast _typed_ arrays.

var SIZE = 100 * 300 * 4;
arrayBuffer = new ArrayBuffer(SIZE);
view = new Uint8Array(arrayBuffer);
// Initialize with random values within [0,255]
// ...


Sending the data with an unique id to the worker so it can start working. The last parameter (`[view.buffer]`) is the reference of the array included in the `data` attribute that will be transferred to the worker.

```javascript
var data = {
  'id': workers_id++,
  'data': view.buffer
};
worker.postMessage(data, [view.buffer]);
```


### Receiving Data

Data can be received from the worker thanks to a message passing mechanism with event listeners.  

When message is received from a WebWorker, the main app immediately renders it on the canvas. We do not wait for the _animation frame event_ or we could loose the access to the data.

```javascript
worker.addEventListener("message", handler, false);
function handler (event){
  // get index and data from this worker
  var id = event.data.id;
  var data = event.data.data;
  // create a image from the binary data
  var arr = new Uint8ClampedArray(data);
  // draw the image on the dedicated canvas (shift by the `id` value)
  ctx.putImageData(new ImageData(arr, 100, 300), id * 100, 0);
}
```



## The WebWorker

The aim of the WebWorker, although not really efficient or realistic, is to somehow search for the average color from the data set that is given.

The worker  mimics the behavior  of a genetic algorithm trying to optimize the colors in the dataset. This data is represented as a 2D array. One line is seen as a solution vector (a chromosome). The set off all lines are the population of chromosomes. Given a fitness function, classical genetic algorithms (GAs) iteratively try to modify the dataset in order to improve the fitness. The GA selects 2 random chromosomes (2lines of the dataset), then create a third one that is a combination of both (the offspring chromozome). If this new chromosome has a better fitness than one of the parents it takes that parent's place in the dataset.

The fitness here is the pairwise difference between any pair of adjacent colors of the vector. The lower the difference, the better the fitness.  

When started the worker waits for messages containing the data to be used for the algorithm.

After the computation, it sends a message back to the main app transferring the data again.

```javascript
postMessage({
  'id': id,
  'data': arr.buffer,
  'fitness': maxFitness,
  'round':round++,
  'index':maxIndex
}, [arr.buffer]);
```

## Analysis


Although the algorithm needs a lot of CPU cycles the most extensive task is the exchange of information. Although this example uses transferable objects, data transfer is always a bottleneck.
