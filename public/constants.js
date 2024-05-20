export const CANVAS_WIDTH = 500
export const CANVAS_HEIGHT = 500
export const GRID_LINE_WIDTH = 1
export const GRID_CELL_WIDTH = 25
export const GRID_WIDTH_COUNT = CANVAS_WIDTH / GRID_CELL_WIDTH
export const GRID_HEIGHT_COUNT = CANVAS_HEIGHT / GRID_CELL_WIDTH

export const BACKGROUND_COLOR = ''
export const GRID_LINE_COLOR = '#332522'
export const GRID_BORDER_COLOR = '#332522'
export const COLLISION_COLOR = '#19634B'
export const START_COLOR = '#00A36C'
export const PATH_COLOR = 'cyan'
export const END_COLOR = '#A32000'

export const CELL_STATES = {
 EMPTY: 0,
 COLLISION: 1,
 START: 2,
 END: 3,
 PATH: 4
}

window.CELL_STATES = CELL_STATES;