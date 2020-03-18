function move(moveFunc) {
    if (moved) return;
    let newPosition = getObjectCells(currentObject).map(moveFunc);
    if (insidePlayground(newPosition) && countOverlaps(newPosition) === 0) {
        deleteCells(getObjectCells(currentObject));
        currentObject.position = moveFunc(currentObject.position);
        writeCells(getObjectCells(currentObject), TYPE_COLORS[currentObject.type]);
    }
    moved = true;
}


function moveDown() {
    // Check if there still exists an object to move
    if (!currentObject) {
        return;
    }


    let newObject = movedDown(currentObject);

    // check if the object can be moved down or should be placed on the current position
    if (insidePlayground(getObjectCells(newObject)) && countOverlaps(getObjectCells(newObject)) === 0) {
        // delete cells from the old position
        deleteCells(getObjectCells(currentObject));

        // update position and write it to the playground
        currentObject.position[0]--;
        writeCells(getObjectCells(currentObject), TYPE_COLORS[currentObject.type]);
    } else {
        // fix the cells of current object and disable it
        currentObject = null;
    }

    renderPlayground();
}


function moveRight() {
    move(el => [el[0], el[1] + 1]);
}

function moveLeft() {
    move(el => [el[0], el[1] - 1]);
}


function rotate() {
    // Only one rotation on each step is allowed
    if (rotated) return;
    rotated = true;

    // get new positions and check if the rotation is possible
    let newRotation = (currentObject.rotation + 1) % 4;
    let newCells = POSITIONS[currentObject.type][newRotation].map(el => [el[0] + currentObject.position[0], el[1] + currentObject.position[1]]);
    if (insidePlayground(newCells) && countOverlaps(newCells) === 0) {
        deleteCells(getObjectCells(currentObject));
        currentObject.rotation = newRotation;
        writeCells(newCells, TYPE_COLORS[currentObject.type])
    }
}

function processPause() {
    // pause or unpause the game depending on the current state
    if (!pause) {
        clearInterval(gameInterval);
        status = 'Paused';
        pause = true;
    } else {
        status = 'Running';
        runGame();
        pause = false;
    }
    updateStatus();
}


function gameOver() {
    console.log("Game Over");
    clearInterval(gameInterval);
    status = "Game Over";
    updateStatus();
    pause = true;
}


function deleteFullRows() {
    for (let i in playground) {
        let row = playground[i];
        // IF all the cells of row are filled
        if (row.filter(el => el).length === 5) {
            // delete the current row and push an empty one to the top
            playground.splice(i, 1);
            playground.push(new Array(5).fill(null));

            // update total score
            score++;
            updateStatus();

            // recursively call the function
            deleteFullRows();
            break;
        }
    }
}




function runGame() {
    gameInterval = setInterval(() => {
        moveDown();
        renderPlayground();
        if (!currentObject) {
            deleteFullRows();
            createRandomObject();
        }

        // update variables to make moving and rotation possible again
        moved = false;
        rotated = false;
    }, timeout);
}

// interval 1 second
let playground = createPlayground();
renderPlayground();
updateStatus();
runGame();