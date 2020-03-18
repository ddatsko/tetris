document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case DOWN:
      moveDown();
      break;
    case LEFT:
      moveLeft();
      break;
    case RIGHT:
      moveRight();
      break;
    case PAUSE:
      processPause();
      break;
    case UP:
      rotate();
      break;
    default:
      break;

  }
});