import {Solution, solvers} from "./Solver";
import {plotCurve} from "./Plotter";

export function generateExtraParams() {
  let form = (<HTMLFormElement> document.getElementById("curve-params")).elements;
  let solverID = (<HTMLSelectElement> form.namedItem("curve-type")).value;
  solvers.map[solverID].generateParams();
}

function getExtraParams(form: HTMLFormElement): {[name: string]: number}  {
  console.log(form);
  let out: {[name: string]: number} = {};
    for (let i = 0; i < form.elements.length; i++) {
      let untyped_elem = <unknown> form.elements.item(i);
      let typed_elem = <{ valueAsNumber: number, name: string }> untyped_elem;
      if (!(typed_elem.name === undefined || typed_elem.valueAsNumber === undefined)) {
        out[typed_elem.name] = typed_elem.valueAsNumber;
      }
    }
    return out;
}

export function update(): void {
  let form = (<HTMLFormElement> document.getElementById("curve-params")).elements;
  let p1x = (<HTMLInputElement> form.namedItem("p1x")).valueAsNumber;
  let p1y = (<HTMLInputElement> form.namedItem("p1y")).valueAsNumber;
  let p2x = (<HTMLInputElement> form.namedItem("p2x")).valueAsNumber;
  let p2y = (<HTMLInputElement> form.namedItem("p2y")).valueAsNumber;

  let height = (<HTMLInputElement> form.namedItem("height")).valueAsNumber;
  let useSlabs = (<HTMLInputElement> form.namedItem("useSlabs")).checked;
  let thickness = (<HTMLInputElement> form.namedItem("thickness")).valueAsNumber
  let solverID = (<HTMLSelectElement> form.namedItem("curve-type")).value;
  let extraParams = getExtraParams(<HTMLFormElement> document.getElementById("curve-bonus-params"));
  let solver = solvers.map[solverID];

  let solution1 = <HTMLDivElement> document.getElementById("solution1");
  let solution2 = <HTMLDivElement> document.getElementById("solution2");

  solution1.innerHTML = "";
  solution2.innerHTML = "";

  let p1 = {x: p1x, y: p1y};
  let p2 = {x: p2x, y: p2y};


  let solutions: Solution = solver.generateSolver(extraParams).findSolution(p1, p2, height);

  console.log(solutions);

  if (solutions === "h in invalid range" || solutions === "equal x values") {
    solution1.innerText = solutions;
  } else {
    solution1.appendChild(plotCurve(solutions[0], p1, p2, thickness, useSlabs));
    solution2.appendChild(plotCurve(solutions[1], p1, p2, thickness, useSlabs));
  }
}

export function onStart() {
  let curveTypeSelector = <HTMLSelectElement> document.getElementById("curve-type");
  curveTypeSelector.innerHTML = "";
  solvers.order.forEach(id => {
    let optionElem = document.createElement("option");
    if (id === solvers.order[0]) {
      optionElem.selected = true;
    }
    optionElem.value = id;
    optionElem.innerText = id;
    curveTypeSelector.add(optionElem);
  })
  update();
}


