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
            const y = Math.floor(cursor/9);
            const x = cursor % 9;

            const constCell = makeConstantCell(Number(cell)); 
            sudoku = updateCell(x, y, constCell, sudoku);
        }
    }

    return sudoku;
}
