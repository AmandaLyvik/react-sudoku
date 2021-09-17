
import { type } from "os";
import { legalOptions, solve } from "./solver";
import { makeConstantCell, makeEmptyCell, makeEmptySudoku, Sudoku, SudokuCellConstant, updateCell } from "./sudoku";

export function generateSudoku(difficulty: number): Sudoku {
    if (difficulty < 1 || difficulty > 81 - 17) {
        throw new Error(`Invalid Difficulty ${difficulty}`);
    }
    let sudoku = makeEmptySudoku();

    sudoku = solve(sudoku) as Sudoku;

    for (let i = 0; i < difficulty; i++) {
        sudoku = removeRandomConstant(sudoku);
    }

    convertToConstantCells(sudoku);

    return sudoku;
}

function convertToConstantCells(sudoku: Sudoku) {
    for (const row of sudoku.data) {
        for (const col of row.data) {
            if (col.type === 'value' || col.type === 'constant') {
                col.type = 'constant';
            }
        }
    }
}

function removeRandomConstant(sudoku: Sudoku): Sudoku {
    const x = Math.floor(9 * Math.random());
    const y = Math.floor(9 * Math.random());

    if (sudoku.data[y].data[x].type === 'constant' || sudoku.data[y].data[x].type === 'value') {
        return updateCell(x, y, makeEmptyCell(), sudoku);
    }

    return removeRandomConstant(sudoku);
}

function sampleDidgit(exclude: number[], include: number[] = [1,2,3,4,5,6,7,8,9]): number {
    for (const opt of shuffle(include)) {
        if (!exclude.includes(opt)) {
            return opt;
        }
    }

    // if ()

    // return sampleDidgit(exclude, include);

    throw new Error('Incompatible requirements');

    // const n = Math.floor(Math.random()*9 + 1);

    // if (include.includes(n) && !exclude.includes(n)) {
    //     return n;
    // }

    // console.log('Rejected', n, exclude, include);
    // return sampleDidgit(exclude, include);
}

export function shuffle<T>(array: T[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }