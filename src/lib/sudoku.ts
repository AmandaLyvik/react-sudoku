import { sudoku1 } from "../data/sudoku1";

export interface Sudoku {
    data: SudokuRow[];
    type: 'sudoku';
}

export interface SudokuRow {
    data: SudokuCell[];
    type: 'row';
}

export type SudokuCell = SudokuCellConstant | SudokuCellValue | SudokuCellEmpty;

export interface SudokuCellConstant {
    value: number;
    type: 'constant';
} 

export interface SudokuCellValue {
    value: number;
    type: 'value'
}

export interface SudokuCellEmpty {
    type: 'empty'
}


export function validString(src: string): boolean {
    if (src.length > 1) {
        return false;
    }

    if (src.length === 0) {
        return true;
    }

    const value = Number(src);
    if (isNaN(value)) {
        return false;
    }

    if (value === 0) {
        return false;
    }

    return true;
}


export function makeEmptyCell(): SudokuCellEmpty {
    return {
        type: 'empty'
    }
}

export function makeConstantCell(input: number): SudokuCellConstant {
    return {
        value: input,
        type: 'constant'
    }
}

export function makeValueCell(input: number): SudokuCellValue {
    return {
        value: input,
        type: 'value'
    }
}

function makeSudokuRow(cells: SudokuCell[]): SudokuRow {
    return {
        data: cells,
        type: 'row'
    }
}

function makeSudoku(rows: SudokuRow[]): Sudoku {
    return {
        data: rows,
        type: 'sudoku'
    }
}

export function makeEmptySudoku(): Sudoku {
    const rows: SudokuRow[] = new Array(9);

    for (let y = 0; y < rows.length; y++) {
        const cells: SudokuCell[] = new Array(9);

        for (let x = 0; x < cells.length; x++) {
            cells[x] = makeEmptyCell();
        }

        rows[y] = makeSudokuRow(cells);
    }

    return makeSudoku(rows);
}

export function updateCell(x: number, y: number, newCell: SudokuCell, sudoku: Sudoku) {

    const newRows = sudoku.data.map((row, yy) => {
        const newCells = row.data.map((cell, xx) => {
            if (yy === y && xx === x) {
                return newCell;
            }

            return {...cell};
        });

        return makeSudokuRow(newCells);
    })

    return makeSudoku(newRows);
}

export function readSudoku(input: string): Sudoku {
    let sudoku = makeEmptySudoku();
    
    for (let cursor = 0; cursor < sudoku1.length; cursor++) {
        const cell = input[cursor];
        if (cell !== '.') {
            //TODO indexToCoord
            const [x,y] = indexToCoordinate(cursor);
            const constCell = makeConstantCell(Number(cell)); 
            sudoku = updateCell(x, y, constCell, sudoku);
        }
    }

    return sudoku;
}

function indexToCoordinate(index: number): [number,number] {
    const y = Math.floor(index/9);
    const x = index % 9;

    return [x,y];
}

function coordToIndex(x: number, y: number): number {
    return y * 9 + x;
}

export function getRow(sudoku: Sudoku, x: number, y: number): number[] {
    const row: number[] = [];

    for (let col = 0; col < 9; col++) {
        const cell = sudoku.data[y].data[col];
        if (cell.type !== 'empty') {
            row.push(cell.value)
        }
    }

    return row;
}

export function getCol(sudoku: Sudoku, x: number, y: number): number[] {
    const col: number[] = [];

    for (let row = 0; row < 9; row++) {
        const cell = sudoku.data[row].data[x];
        if (cell.type !== 'empty') {
            col.push(cell.value);
        }
    }

    return col;
}

export function getBox(sudoku: Sudoku, x:number, y: number): number[] {
    const boxX = Math.floor(x/3);
    const boxY = Math.floor(y/3);

    const startX = 3 * boxX;
    const startY = 3 * boxY;

    const box: number[] = []; 

    for (let xx = 0; xx < 3; xx++) {
        for (let yy = 0; yy < 3; yy++) {
            const realX = startX + xx;
            const realY = startY + yy;
            const cell = sudoku.data[realY].data[realX];

            if (cell.type !== 'empty') {
                box.push(cell.value);
            }
        }
    }

    return box;
}