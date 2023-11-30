function colorPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function checkIsGraphCyclicTracePath(
  graphComponentMatrix,
  cycleResponse
) {
  let [srcr, srcc] = cycleResponse;
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

  //   for (let i = 0; i < cellsRow; i++) {
  //     for (let j = 0; j < cellsColumn; j++) {
  //       if (visited[i][j] === false) {
  //         let response = dfsCycleDetectionTracePath(
  //           graphComponentMatrix,
  //           i,
  //           j,
  //           visited,
  //           dfsVisited
  //         );
  //         if (response === true) return true;
  //       }
  //     }
  //   }

  let response = await dfsCycleDetectionTracePath(
    graphComponentMatrix,
    srcr,
    srcc,
    visited,
    dfsVisited
  );

  if (response === true) Promise.resolve(true);
  return Promise.resolve(false);
}

async function dfsCycleDetectionTracePath(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;
  let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);
  cell.style.backgroundColor = "lightblue";
  await colorPromise(); // delay for 1sec

  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nbr, nbc] = graphComponentMatrix[srcr][srcc][children];
    if (visited[nbr][nbc] === false) {
      let response = await dfsCycleDetectionTracePath(
        graphComponentMatrix,
        nbr,
        nbc,
        visited,
        dfsVisited
      );
      if (response === true) {
        cell.style.backgroundColor = "transparent";
        await colorPromise();
        return Promise.resolve(true);
      }
    } else if (visited[nbr][nbc] === true && dfsVisited[nbr][nbc] === true) {
      let cyclicCell = document.querySelector(
        `.cell[rid="${nbr}"][cid="${nbc}"]`
      );
      cyclicCell.style.backgroundColor = "lightsalmon";
      await colorPromise();
      cyclicCell.style.backgroundColor = "transparent";
      await colorPromise();
      cell.style.backgroundColor = "transparent";
      return Promise.resolve(true);
    }
  }

  dfsVisited[srcr][srcc] = false;
  return Promise.resolve(false);
}
