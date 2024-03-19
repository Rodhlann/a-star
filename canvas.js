const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 500
const GRID_LINE_WIDTH = 1
const GRID_CELL_WIDTH = 25
const GRID_WIDTH_COUNT = CANVAS_WIDTH / GRID_CELL_WIDTH
const GRID_HEIGHT_COUNT = CANVAS_HEIGHT / GRID_CELL_WIDTH

const BACKGROUND_COLOR = ''
const GRID_LINE_COLOR = '#332522'
const GRID_BORDER_COLOR = '#332522'
const COLLISION_COLOR = '#19634B'
const START_COLOR = '#00A36C'
const END_COLOR = '#A32000'

const gridInit = () => [...Array(GRID_WIDTH_COUNT)]
  .map(() => [...Array(GRID_WIDTH_COUNT)].fill(CELL_STATES.EMPTY))
STATE.grid = gridInit()

ctx.canvas.width = CANVAS_WIDTH;
ctx.canvas.height = CANVAS_HEIGHT;

function drawGrid() {
  // Grid Setup
  ctx.beginPath()
  ctx.fillStyle = GRID_BORDER_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, GRID_LINE_WIDTH);
  ctx.fillRect(0, 0, GRID_LINE_WIDTH, CANVAS_HEIGHT);
  ctx.fillRect(0, CANVAS_HEIGHT - 1, CANVAS_WIDTH, GRID_LINE_WIDTH);
  ctx.fillRect(CANVAS_WIDTH - 1, 0, GRID_LINE_WIDTH, CANVAS_HEIGHT);

  ctx.beginPath()
  ctx.fillStyle = GRID_LINE_COLOR;
  [...Array(GRID_WIDTH_COUNT)].forEach((_, idx) => {
    if (!idx) return;
    ctx.fillRect(0, idx * GRID_CELL_WIDTH, CANVAS_WIDTH, GRID_LINE_WIDTH);
    ctx.fillRect(idx * GRID_CELL_WIDTH, 0, GRID_LINE_WIDTH, CANVAS_WIDTH);
  })
}

function drawCells() {
  STATE.grid.forEach((row, y) => {
    row.forEach((state, x) => {
      const cellPixelPos = cellToCellPixelPos(x, y)
      
      ctx.beginPath();
      switch(state) {
        case CELL_STATES.END: {
          ctx.fillStyle = END_COLOR;
          ctx.fillRect(cellPixelPos.x, cellPixelPos.y, GRID_CELL_WIDTH, GRID_CELL_WIDTH);
          break;
        }
        case CELL_STATES.START: {
          ctx.fillStyle = START_COLOR;
          ctx.fillRect(cellPixelPos.x, cellPixelPos.y, GRID_CELL_WIDTH, GRID_CELL_WIDTH);
          break;
        }
        case CELL_STATES.COLLISION: {
          ctx.fillStyle = COLLISION_COLOR;
          ctx.fillRect(cellPixelPos.x, cellPixelPos.y, GRID_CELL_WIDTH, GRID_CELL_WIDTH);
          break;
        }
        default: {
          ctx.clearRect(cellPixelPos.x, cellPixelPos.y, GRID_CELL_WIDTH, GRID_CELL_WIDTH);
        }
      }
    })
  })
}

function draw() {
  drawCells();
  drawGrid();
}

function pixelToCellPos(x, y) {
  return {
    x: Math.floor((x / CANVAS_WIDTH) * GRID_WIDTH_COUNT),
    y: Math.floor((y / CANVAS_HEIGHT) * GRID_HEIGHT_COUNT) 
  }
}

function cellToCellPixelPos(x, y) {
  return {
    x: (CANVAS_WIDTH * (x / GRID_WIDTH_COUNT)),
    y: (CANVAS_HEIGHT * (y / GRID_HEIGHT_COUNT))
  }
}

// Not sure if this is necessary
function cellToCenteredPixelPos(x, y) {
  return {
    x: (CANVAS_WIDTH * (x / GRID_WIDTH_COUNT)) + (GRID_CELL_WIDTH / 2),
    y: (CANVAS_HEIGHT * (y / GRID_HEIGHT_COUNT)) + (GRID_CELL_WIDTH / 2)
  }
}

function resetCellState() {
  STATE.grid = gridInit();
  draw();
}

function updateSelectedCellState(state) {
  STATE.cellState = state

  const [
    start, 
    collision, 
    end
  ] = document.getElementsByClassName('canvas_legend_button')
  switch(state) {
    case CELL_STATES.END: {
      start.classList.remove('selected')
      collision.classList.remove('selected')
      end.classList.add('selected')
      break;
    }
    case CELL_STATES.START: {
      start.classList.add('selected')
      collision.classList.remove('selected')
      end.classList.remove('selected')
      break;
    }
    case CELL_STATES.COLLISION:
      start.classList.remove('selected')
      collision.classList.add('selected')
      end.classList.remove('selected')
      break;
    default: {
      start.classList.remove('selected')
      collision.classList.remove('selected')
      end.classList.remove('selected')
    }
  }
}

function setCellState(x, y) {
  const gridState = STATE.grid[y][x]

  switch(STATE.cellState) {
    case CELL_STATES.END: {
      if (gridState === CELL_STATES.START) break;
      if (gridState === CELL_STATES.COLLISION) break;
      if (STATE.endPos?.x === x && STATE.endPos?.y === y) {
        STATE.endPos = null;
        STATE.grid[y][x] = CELL_STATES.EMPTY;
        break;
      }

      if (STATE.endPos)
        STATE.grid[STATE.endPos.y][STATE.endPos.x] = CELL_STATES.EMPTY
      STATE.grid[y][x] = CELL_STATES.END
      STATE.endPos = { x, y }
      break;
    }

    case CELL_STATES.START: {
      if (gridState === CELL_STATES.COLLISION) break;
      if (gridState === CELL_STATES.END) break;
      if (STATE.startPos?.x === x && STATE.startPos?.y === y) {
        STATE.startPos = null;
        STATE.grid[y][x] = CELL_STATES.EMPTY;
        break;
      }

      if (STATE.startPos)
        STATE.grid[STATE.startPos.y][STATE.startPos.x] = CELL_STATES.EMPTY
      STATE.grid[y][x] = CELL_STATES.START
      STATE.startPos = { x, y }
      break;
    }

    case CELL_STATES.COLLISION:
    default: {
      if (gridState === CELL_STATES.START) break;
      if (gridState === CELL_STATES.END) break;

      STATE.grid[y][x] = gridState === CELL_STATES.EMPTY ? CELL_STATES.COLLISION : CELL_STATES.EMPTY;
    }
  }
}

// Cell Selection Toggle Logic
canvas.addEventListener('click', (e) => {
  const mousePos = {
    x: e.pageX - canvas.offsetLeft,
    y: e.pageY - canvas.offsetTop
  };

  const cellPos = pixelToCellPos(mousePos.x, mousePos.y);
  setCellState(cellPos.x, cellPos.y);

  draw();
});

drawGrid();
