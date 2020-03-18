var createPlayground = () => (new Array(10).fill().map(el => (new Array(5).fill())));

function createObject(type, rotation) {
    return {type: type, position: [9, 0], state: 'falling', rotation: rotation}
}

function createRandomObject() {
    // choose random type and rotation
    let objectType = Object.keys(POSITIONS)[Math.floor(Math.random() * 3)];
    let newObject = createObject(objectType, Math.floor(Math.random() * 4));

    // check if it is possible to place the object on playground
    if (countOverlaps(getObjectCells(newObject)) !== 0) {
        gameOver();
    } else {
        currentObject = newObject;
        writeCells(getObjectCells(newObject), TYPE_COLORS[newObject.type]);
        renderPlayground();
    }

}

function countOverlaps(cells) {
    // Remove the cells of current object from playground if it exists
    let currentObjectCells = currentObject ? getObjectCells(currentObject) : [];
    deleteCells(currentObjectCells);

    // Count the number of overlapping cells
    let numOfOverlaps = 0;
    for (let cell of cells) {
        if (playground[cell[0]][cell[1]]) numOfOverlaps++;
    }
    // Write current object`s cells back to the playground
    if (currentObject) writeCells(currentObjectCells, TYPE_COLORS[currentObject.type]);

    return numOfOverlaps;
}

function insidePlayground(cells) {
    for (let cell of cells) {
        if (cell[0] < 0 || cell[1] < 0 || cell[1] > 4) {
            return false;
        }
    }
    return true;
}

function getObjectCells(obj) {
    let initial = POSITIONS[obj.type][obj.rotation];
    return initial.map(el => [el[0] + obj.position[0], el[1] + obj.position[1]]);
}


function movedDown(obj) {
    // Get the cells of object, lying one cell down

    let newObject = JSON.parse(JSON.stringify(obj));
    newObject.position[0]--;
    return newObject;
}

function deleteCells(cells) {
    // Delete the given cells from playground
    writeCells(cells, null);
}


function writeCells(cells, color) {
    // Fill given cells of playground with color
    cells.forEach(el => playground[el[0]][el[1]] = color)
}

function updateStatus() {
    let statusNode = document.getElementById('status');
    let scoreNode = document.getElementById('score');

    statusNode.innerHTML = status;
    scoreNode.innerHTML = score.toString();
}