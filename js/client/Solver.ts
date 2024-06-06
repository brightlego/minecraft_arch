export {NoSolution, Solution, findSolutions}

import {CoshCurve} from "./CoshCurve";
import {Point} from "./Point";

type NoSolution = "h in invalid range" | "equal x values"
type Solution = NoSolution | [CoshCurve, CoshCurve]


function findSolutions(p1: Point, p2: Point, h: number): Solution {
  // Finds two cosh curves such that both p1 and p2 lie on the curve and the curve's stationary point is at h + p1.y
  // The first solution has the stationary point within p1.x and p2.x, the second solution has it outside.

  // The range of the first solution is [min(p1.y, p2.y), p1.y + h] for h > 0, [p1.y - h, max(p1.y, p2.y)] for h < 0
  // The range of the second solution is [min(p1.y, p2.y), max(p1.y, p2.y)] for all h

  // It gives no solutions when min(p1.y, p2.y) < h < max(p1.y, p2.y) or p1.x = p2.x

  if (p1.x == p2.x) {
    // There are either no solutions or infinitely many
    // when the two points have the same x value
    return "equal x values";
  }

  let a: 1 | -1 | 0;       // The coefficient of cosh(...)
  let d: number;           // The constant offset of cosh
  let factorInner: number; // The inner value of factor

  if (h < 0) {
    a = 1;
    d = p1.y + h - 1;
    // As h < 0, factorInner > 1
    factorInner = 1 - h;
  } else {
    a = -1;
    d = p1.y + h + 1;
    // As h >= 0, factorInner >= 1
    factorInner = h + 1;
  }

  // As factorInner >= 1, factor is always defined
  let factor: number = Math.acosh(factorInner); // A value that ocured several times in the solution
  let deltaY: number = p2.y - p1.y; // The change in y value from one point to another

  if (factorInner - deltaY < 1) {
    // If the above is less than one, k is not defined so there are no
    // solutions. This corresponds to the fact that the 'top' of the arch
    return "h in invalid range";
  }

  // A solution of k = b / (p1.x - c)
  let k: number = Math.acosh(factorInner - deltaY);

  if (deltaY == 0) {
    // If delta Y = 0, then k = 1 and so 1 - k = 0.
    // The solution when 1 - k = 0 corresponds to a line, and so a = 0
    let c: number = (p2.x + k*p1.x)/(1 + k);
    let b: number = factor / (p1.x - c);
    return [new CoshCurve(a, b, c, d), new CoshCurve(0, b, c, d)]
  } else {
    // Has solutions corresponding to k and -k
    let c1 = (p2.x + k*p1.x)/(1 + k);
    let c2 = (p2.x - k*p1.x)/(1 - k);
    let b1 = factor / (p1.x - c1);
    let b2 = factor / (p1.x - c2);
    return [new CoshCurve(a, b1, c1, d), new CoshCurve(a, b2, c2, d)]
  }
}

