// Storage -> 2D matrix (Basic needed)
let graphComponentMatrix = [];

for (let i = 0; i < cellsRow; i++) {
  let row = [];

  for (let j = 0; j < cellsColumn; j++) {
    // why array -> more than 1 child relation(dependency)
    row.push([]);
  }
  graphComponentMatrix.push(row);
}

// true -> cyclic and false -> not cyclic
function checkIsGraphCyclic(graphComponentMatrix) {
  //Dependecy -> visited, dfsVsited (2D array)
  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < cellsRow; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];

    for (let j = 0; j < cellsColumn; j++) {
      // default
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }

    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < cellsRow; i++) {
    for (let j = 0; j < cellsColumn; j++) {
      if (visited[i][j] === false) {
        let response = dfsCycleDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisited
        );
        if (response === true) return [i, j]; // Found cycle so return immediately, no need to explore more path
      }
    }
  }
  return null;
}

//Start -> vis(true) dfs(true)
//End -> dfs(false)
//if vis[i][j] -> already explored path, so go back no use to explore again
//Cycle detection condition -> if (vis[i][j] == true && dfs[i][j] == true) -> cycle
//Return -> true/false
//True -> Cyclic, False -> Not cyclic
function dfsCycleDetection(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nbr, nbc] = graphComponentMatrix[srcr][srcc][children];
    if (visited[nbr][nbc] === false) {
      let response = dfsCycleDetection(
        graphComponentMatrix,
        nbr,
        nbc,
        visited,
        dfsVisited
      );
      if (response === true) {
        return true; // Found cycle so return immediately, no need to explore more path
      }
    } else if (visited[nbr][nbc] === true && dfsVisited[nbr][nbc] === true) {
      return true; // Found cycle so return immediately, no need to explore more path
    }
  }

  dfsVisited[srcr][srcc] = false;
  return false;
}
