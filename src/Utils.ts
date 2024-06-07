export {cosh, acosh, min, max}

function cosh(x: number): number {
  return (Math.exp(x) + Math.exp(-x))/2;
}

function acosh(x: number): number {
  return Math.log(x + Math.sqrt(x*x - 1));
}

function min(xs: number[]): number {
  let min = Infinity;
  xs.forEach((x) => {
    if (x < min) {
      min = x;
    }
  })
  return min;
}

function max(xs: number[]): number {
  let max = -Infinity;
  xs.forEach((x) => {
    if (x > max) {
      max = x;
    }
  })
  return max;
}
