for (let i = 0; i < cellsRow; i++) {
  for (let j = 0; j < cellsColumn; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activeCell, activeCellProp] = getCellAndCellProp(address);

      let enteredData = activeCell.innerText;

      if (enteredData === activeCell.value) return;

      activeCellProp.value = enteredData;

      // If data modifies remove Parent-Children relation, update children with new hardcoded (modified) value
      removeChildrenFromParent(activeCellProp.formula);
      activeCellProp.formula = "";
      updateChildrenCells(address);

      // console.log(activeCellProp);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    //If change in formula, break old Parent-Children relation, evaluate new formula, add new Parent-Children relation
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    if (inputFormula !== cellProp.formula)
      removeChildrenFromParent(cellProp.formula);

    addChildToGraphComponent(inputFormula, address);
    //check formula is cyclic or not, only then evalute
    // true -> cyclic and false -> not cyclic
    let cycleResponse = checkIsGraphCyclic(graphComponentMatrix);
    if (cycleResponse) {
      // alert("Your formula is cyclic");
      let response = confirm(
        "Your formula is cyclic. Do you want to trace your path?"
      );

      while (response === true) {
        //keep on tracking color until user is satisfied
        await checkIsGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
        response = confirm(
          "Your formula is cyclic. Do you want to trace your path?"
        );
      }
      removeChildFromGraphComponent(inputFormula, address);
      return;
    }

    let evaluatedValue = evaluateFormula(inputFormula);

    // To update UI and cellProp in DB
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    addChildrenToParent(inputFormula);
    updateChildrenCells(address);
  }
});

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }

  let decodedFormula = encodedFormula.join(" ");
  // console.log(typeof decodedFormula);
  return eval(decodedFormula);
}

function addChildToGraphComponent(formula, childAdress) {
  let [crid, ccid] = decodeRIDCIDFromAddress(childAdress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);

      // rid -> i and cid -> j
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }
}

function addChildrenToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);

      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildrenFromParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);

      let idx = parentCellProp.children.indexOf(childAddress);

      parentCellProp.children.splice(idx, 1);
    }
  }
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  let [cell, cellProp] = getCellAndCellProp(address);

  cell.innerText = evaluatedValue; //UI

  // Database
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}
