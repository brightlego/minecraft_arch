import {max, min} from "./Utils";

export {plotCurve}

import {Curve} from "./Curve";
import {Point} from "./Point";

function getLowerBounds(curve: Curve, start: number, end: number, step:number): number[] {
  let n = Math.floor((end - start)/step);
  let arr = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    arr[i] = curve.findInfinum(start + i*step, start + (i+1)*step);
  }
  return arr;
}

function getUpperBounds(curve: Curve, start: number, end: number, step:number): number[] {
  let n = Math.floor((end - start)/step);
  let arr = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    arr[i] = curve.findSupremum(start + i*step, start + (i+1)*step);
  }
  return arr;
}

function generateGrid(width: number, height: number,
                      bitmap: (x: number, y: number) => boolean,
                      useSlabs: boolean): HTMLTableElement {
  let grid = document.createElement("table")
  grid.classList.add("bitmap", useSlabs ? "slab" : "block");
  console.log(`width: ${width}; height: ${height}`)
  let cellSize: number;

  if (width < height*0.8) {
    cellSize = 100 / height
  } else {
    cellSize = 100 / width
  }
  grid.style.width = `${cellSize*0.5*width}vh`

  let step = useSlabs ? 0.5 : 1;
  for (let y = height-1; y >= 0; y -= step) {
    let row = grid.insertRow();
    for (let x = 0; x < width; x++) {
      let cell = row.insertCell()
      cell.style.width = `${cellSize*0.5}vh`;
      cell.style.height = `${cellSize*step*0.5}vh`;
      if (bitmap(x, y)) {
        cell.className = "bitmap-on";
      } else {
        cell.className = "bitmap-off";
      }
    }
  }
  return grid
}

function plotCurve(curve: Curve, p1: Point, p2: Point, thickness: number, useSlabs: boolean): HTMLTableElement {
  let end = Math.max(p2.x, p1.x);
  let start = Math.min(p1.x, p2.x);


  let width = Math.ceil(end - start);
  let lowerBounds = getLowerBounds(curve, start, end, 1)
    .map((x: number) => useSlabs ? Math.floor(2*x)/2 : Math.floor(x));
  let upperBounds = getUpperBounds(curve, start, end, 1).map(x => x + thickness)
    .map((x: number) => useSlabs ? Math.ceil(2*x)/2 : Math.ceil(x));
  console.log(lowerBounds, upperBounds)
  let yMin = min(lowerBounds);
  let yMax = max(upperBounds);

  console.log(`yMin: ${yMin}, yMax: ${yMax}`)
  let height = Math.floor(yMax - yMin) + 1;
  height = Math.max(4, height);
  if (!Number.isFinite(height) || !Number.isFinite(width)) {
    return document.createElement("table");
  }

  let bitmap = (x: number, y: number) => (lowerBounds[x] <= yMin + y && yMin + y <= upperBounds[x]);
  return generateGrid(width, height, bitmap, useSlabs);
}

