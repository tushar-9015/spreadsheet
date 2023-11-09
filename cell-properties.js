//storage
let sheetDB = [];

for (let i = 0; i < cellsRow; i++) {
  let sheetRow = [];

  for (let j = 0; j < cellsColumn; j++) {
    let cellProp = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: "14",
      fontColor: "#000000",
      BGcolor: "#000000", //Just for indication purposes
    };
    sheetRow.push(cellProp);
  }

  sheetDB.push(sheetRow);
}

//selectors for cell properties

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let activeColor = "#d1d8e0";
let inactiveColor = "#ecf0f1";

//Application of two-way binding
//Attach property listeners

bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  // Modification
  cellProp.bold = !cellProp.bold; // Data change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // UI change
  bold.style.backgroundColor = cellProp.bold ? activeColor : inactiveColor; //UI change(2)
});

italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  // Modification
  cellProp.italic = !cellProp.italic; // Data change
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // UI change(1)
  italic.style.backgroundColor = cellProp.italic ? activeColor : inactiveColor; // UI change (2)
});

underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  // Modification
  cellProp.underline = !cellProp.underline; // Data change
  cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // UI change (1)
  underline.style.backgroundColor = cellProp.underline
    ? activeColor
    : inactiveColor; // UI change (2)
});

fontSize.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  // Modification
  cellProp.fontSize = fontSize.value; // Data change
  cell.style.fontSize = cellProp.fontSize + "px"; // UI change(1)
  cellProp.value = cellProp.fontSize; // UI change (2)
});

fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  // Modification
  cellProp.fontFamily = fontFamily.value; // Data change
  cell.style.fontFamily = cellProp.fontFamily; // UI change(1)
  cellProp.value = cellProp.fontFamily; // UI change (2)
});

fontColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  // Modification
  cellProp.fontColor = fontColor.value; // Data change
  cell.style.color = cellProp.fontColor; // UI change(1)
  cellProp.value = cellProp.fontColor; // UI change (2)
});

BGcolor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  // Modification
  cellProp.BGcolor = BGcolor.value; // Data change
  cell.style.backgroundColor = cellProp.BGcolor; // UI change(1)
  cellProp.value = cellProp.BGcolor; // UI change (2)
});

alignment.forEach((alignElem) => {
  alignElem.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    let alignValue = e.target.classList[2]; // accessing the unique class
    cellProp.alignment = alignValue; // Data change
    cell.style.textAlign = cellProp.alignment; // UI change(1)

    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = activeColor;
        centerAlign.style.backgroundColor = inactiveColor;
        rightAlign.style.backgroundColor = inactiveColor;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColor;
        centerAlign.style.backgroundColor = activeColor;
        rightAlign.style.backgroundColor = inactiveColor;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColor;
        centerAlign.style.backgroundColor = inactiveColor;
        rightAlign.style.backgroundColor = activeColor;
        break;
    } // UI change(2)
  });
});

let allCells = document.querySelectorAll(".cell");

for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
  //Work
  cell.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let cellProp = sheetDB[rid][cid];

    // Apply cell Properties
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor =
      cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
    cell.style.textAlign = cellProp.alignment;

    // Apply properties UI Props container
    bold.style.backgroundColor = cellProp.bold ? activeColor : inactiveColor;
    italic.style.backgroundColor = cellProp.italic
      ? activeColor
      : inactiveColor;
    underline.style.backgroundColor = cellProp.underline
      ? activeColor
      : inactiveColor;
    fontColor.value = cellProp.fontColor;
    BGcolor.value = cellProp.BGcolor;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    switch (
      cellProp.alignment // UI change (2)
    ) {
      case "left":
        leftAlign.style.backgroundColor = activeColor;
        centerAlign.style.backgroundColor = inactiveColor;
        rightAlign.style.backgroundColor = inactiveColor;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColor;
        centerAlign.style.backgroundColor = activeColor;
        rightAlign.style.backgroundColor = inactiveColor;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColor;
        centerAlign.style.backgroundColor = inactiveColor;
        rightAlign.style.backgroundColor = activeColor;
        break;
    }
  });
}

function activeCell(address) {
  let [rid, cid] = decodeRIDCIDFromAddress(address);

  // Access cell and storage object
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
  // address -> "A1"
  let rid = Number(address.slice(1) - 1); // 1 -> 0
  let cid = Number(address.charCodeAt(0)) - 65; // "A" -> 65
  return [rid, cid];
}
