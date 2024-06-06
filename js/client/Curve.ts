export {Curve}

abstract class Curve {
  abstract findValue(x: number): number

  toFunction(): (x: number) => number {
    return x => this.findValue(x);
  }
}
