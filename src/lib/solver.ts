import { getBox, getCol, getRow, indexToCoordinate, makeConstantCell, makeValueCell, Sudoku, updateCell } from "./sudoku";

export function legalOptions(sudoku: Sudoku, x: number, y: number): number[] {
    const numbers: number[] = [];

    const row = getRow(sudoku, x, y);
    const col = getCol(sudoku, x, y);
    const box = getBox(sudoku, x, y);

    for (let i = 1; i < 10; i++) {
        if (!row.includes(i) && !col.includes(i) && !box.includes(i)) {
            numbers.push(i);
        }
    }

    return numbers;
}

export function solve(sudoku: Sudoku): Sudoku | false {
    const simplified = simplifySudoku(sudoku);
    if (simplified === false) {
        return false;
    }
    
    const [simplifiedSudoku, options] = simplified;

    if (options.length === 0) {
        return simplifiedSudoku;
    }

    const result = branchOptions(simplifiedSudoku, options);

    return result;
}

type CellOption = [number, number, number[]];

function branchOptions(sudoku: Sudoku, options: CellOption[]): Sudoku | false {
    console.log('all', options);

    let shortest = options[0];
    options.forEach(([x, y, opts]) => {
        if (shortest[2].length > opts.length) {
            shortest = [x, y, opts];
        }
    });

    for (const opt of shortest[2]) {
        console.log('solving for', opt, 'position',shortest[0],shortest[1]);
        const result = solve(updateCell(shortest[0], shortest[1], makeValueCell(opt), sudoku));

        if (result !== false) {
            return result;
        }
    }

    return false;
}

function simplifySudoku(sudoku: Sudoku): [Sudoku, CellOption[]] | false {
    let updated = false;
    let options: CellOption[] = [];

    let pass = 0;

    //Sets all single choice cells
    do {
        updated = false;
        pass++;
        console.log('singles pass', pass);
        options = [];
        
        for (let i = 0; i < 9*9; i++) {
            const [x, y] = indexToCoordinate(i);

            if (sudoku.data[y].data[x].type === 'empty') {
                const opts = legalOptions(sudoku, x, y);

                if (opts.length === 0) {
                    console.log(x,y,opts);
                    return false;
                }

                if (opts.length === 1) {
                    //console.info('value', opts[0], 'position', x, y)
                    sudoku = updateCell(x, y, makeValueCell(opts[0]), sudoku);
                    updated = true;
                }

                if (opts.length > 1) {
                    options.push([x, y, opts]);
                }
            }
        }
    } while (pass > 100 && updated)  

    return [sudoku, options];
}