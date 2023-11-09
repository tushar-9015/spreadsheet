let cellsRow = 100;
let cellsColumn = 26;

const addressColCont = document.querySelector(".address-col-cont");
const addressRowCont = document.querySelector(".address-row-cont");
const cellsCont = document.querySelector(".cells-cont");
const addressBar = document.querySelector(".address-bar");

for (i = 0; i < cellsRow; i++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerHTML = i + 1;
  addressColCont.appendChild(addressCol);
}

for (i = 0; i < cellsColumn; i++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerHTML = String.fromCharCode(65 + i);
  addressRowCont.appendChild(addressRow);
}

for (i = 0; i < cellsRow; i++) {
  let rowCont = document.createElement("div");
  rowCont.setAttribute("class", "row-cont");
  for (j = 0; j < cellsColumn; j++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("contenteditable", "true");
    cell.setAttribute("spellcheck", "false");

    //Attributes for cell and storage identification
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);
    addListnerCellAddress(cell, i, j);
    rowCont.appendChild(cell);
  }
  cellsCont.appendChild(rowCont);
}

function addListnerCellAddress(cell, i, j) {
  cell.addEventListener("click", () => {
    let rowId = i + 1;
    let colId = String.fromCharCode(65 + j);
    addressBar.value = `${colId}${rowId}`;
  });
}

//By default click on first cell via DOM
let firstCell = document.querySelector(".cell");
firstCell.click();
