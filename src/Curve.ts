import {Point} from "./Point";

export {Curve}


// A curve of the form a f(b(x - c)) + d where f(x) is an even concave curve with a stationary point at 0
class Curve {
  fn: (x: number) => number = x => NaN;

  a: 1 | 0 | -1;
  b: number;
  c: number;
  d: number;

  constructor(a: 1 | 0 | -1, b: number, c: number, d: number, fn: (x: number) => number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.fn = fn;
  }


  findValue(x: number): number {
    return this.a * this.fn(this.b*(x - this.c)) + this.d;
  }

  findInfinum(low: number, high: number): number {
    if (low > high) {
      return this.findInfinum(high, low);
    }
    switch (this.a) {
      case -1:
        if (high < this.c) {
          return this.findValue(low);
        } else if (low > this.c) {
          return this.findValue(high);
        } else {
          let delta = Math.max(high - this.c, this.c - low);
          return this.findValue(this.c + delta);
        }
      case 0:
        return this.d;
      case 1:
        if (high < this.c) {
          return this.findValue(high);
        } else if (low > this.c) {
          return this.findValue(low);
        } else {
          return this.a*this.fn(0) + this.d;
        }
    }
  }

  findSupremum(low: number, high: number): number {
    if (low > high) {
      return this.findSupremum(high, low);
    }
    switch (this.a) {
      case 1:
        if (high < this.c) {
          return this.findValue(low);
        } else if (low > this.c) {
          return this.findValue(high);
        } else {
          let delta = Math.max(high - this.c, this.c - low);
          return this.findValue(this.c + delta);
        }
      case 0:
        return this.d;
      case -1:
        if (high < this.c) {
          return this.findValue(high);
        } else if (low > this.c) {
          return this.findValue(low);
        } else {
          return this.a*this.fn(0) + this.d;
        }
    }
  }


  toFunction(): (x: number) => number {
    return x => this.findValue(x);
  }

}
