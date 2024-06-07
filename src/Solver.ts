import {Curve} from "./Curve";

export {NoSolution, Solution, solvers}

import {Point} from "./Point";
import {acosh, cosh} from "./Utils"

type NoSolution = "h in invalid range" | "equal x values"
type Solution = NoSolution | [Curve, Curve]

class Solver {
  fn: (x: number) => number;
  inv: (x: number) => number;

  constructor(fn: (x: number) => number, inv: (x: number) => number) {
    this.fn = fn;
    this.inv = inv;
  }

  findBC(p1: Point, p2: Point, factor1: number, factor2: number, sign: 1 | -1): [number, number] {
    let c = (p2.x * factor1 + sign*p1.x * factor2) / (factor1 + sign*factor2)
    let b: number;
    if (c == p1.x) {
      b = factor2 / (p2.x - c);
    } else {
      b = factor1 / (p1.x - c);
    }
    return [b, c]
  }

  findSolution(p1: Point, p2: Point, h: number): Solution {
    if (p1.x === p2.x) {
      return "equal x values";
    }

    let a: 1 | 0 | -1;
    if (h < 0) {
      a = 1
    } else if (h > 0) {
      a = -1;
    } else {
      return [new Curve(0, 0, 0, p1.y, this.fn), new Curve(0,0,0,p1.y, this.fn)]
    }
    let f0 = this.fn(0);
    if (a*(p2.y - p1.y) < a*h) {
      return "h in invalid range";
    }
    let factor1 = this.inv(f0 - a*h); // f^{-1} (f(0) - ah)
    let factor2 = this.inv(f0 - a*h + a*(p2.y - p1.y)); // f^{-1} (f(0) - ah + a delta y)

    let d = p1.y + h - a * f0;
    if (factor1 == factor2) {
      let [b, c] = this.findBC(p1, p2, factor1, factor2, 1);
      return [new Curve(a, b, c, d, this.fn), new Curve(0, 0, 0, p1.y, this.fn)]
    } else if (factor1 == -factor2) {
      let [b, c] = this.findBC(p1, p2, factor1, factor2, -1);
      return [new Curve(a, b, c, d, this.fn), new Curve(0,0,0,p1.y, this.fn)]
    } else {
      let [b1, c1] = this.findBC(p1, p2, factor1, factor2, 1);
      let [b2, c2] = this.findBC(p1, p2, factor1, factor2, -1);
      return [new Curve(a, b1, c1, d, this.fn), new Curve(a, b2, c2, d, this.fn)]
    }
  }
}

let coshSolver = new Solver(cosh, acosh);

function resetForm() {
  let form = <HTMLFormElement> document.getElementById("curve-bonus-params");
  form.innerHTML = ""
}

let polynomialSolver = (params: {[name: string]: number}) => new Solver(x => Math.pow(Math.abs(x), params["power"]), x => Math.pow(x, 1/params["power"]));

function generatePolynomialForm() {
  let form = <HTMLFormElement> document.getElementById("curve-bonus-params");
  // Break up the HTML as otherwise the browser thinks that it is a HTML file despite it being labeled as text/javascript
  form.innerHTML = "<label for='pow" + "er'>Power: </l" + "abel" +"><input t"+"ype='number'"+" name='power' id="+"'power' value='2' step='any' onchange='Src.update()'/>"
}

type solversType = {
  map: {[id: string]: {
    generateSolver: (params: {[name: string]: number}) => Solver,
    generateParams: () => void
  }},
  order: string[];
}

let solvers: solversType = {
  map: {
    "Hyperbolic Cosine": {
      generateSolver: (_) => coshSolver,
      generateParams: resetForm
    },
    "Polynomial": {
      generateSolver: polynomialSolver,
      generateParams: generatePolynomialForm
    },
  },
  order: ["Hyperbolic Cosine", "Polynomial"]
}
