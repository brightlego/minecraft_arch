export {CoshCurve}

import {Curve} from "./Curve";

// a cosh (b (x - c)) + d
class CoshCurve extends Curve {
  a: 1 | -1 | 0; // Whether the curve "curves" upwards or downwards
  b: number; // How "squished" the curve is x-wise
  c: number; // Where the stationary point of the curve is
  d: number; // The y offset of the curve (with an offset)

  constructor(a: 1 | 0 | -1, b: number, c: number, d: number) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  findValue(x: number): number {
    return this.a * Math.cosh(this.b * (x - this.c)) + this.d;
  }
}
