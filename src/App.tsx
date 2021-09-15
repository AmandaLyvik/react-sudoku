import React, { useState } from 'react';
import './App.scss';
import { makeEmptyCell, makeValueCell, readSudoku, updateCell, validString} from './lib/sudoku';
import { sudoku1 } from './data/sudoku1';
import { solve } from './lib/solver';

const startSudoku = readSudoku(sudoku1); 

function App() {
  
  const [sudoku, setSudoku] = useState(startSudoku);

  return (
    <div className="content">
      <div className="sudoku-grid">
        {sudoku.data.map((row, y) => <div className="row">
          {row.data.map((cell, x) => {
            if (cell.type === 'value') {
              return ValueCell(x, y, cell.value, handleInput);
            } else if (cell.type === 'empty') {
              return EmptyCell(x, y, handleInput);
            } else if (cell.type === 'constant') {
              return ConstantCell(cell.value, x, y);
            }
          }
            )}
        </div>)}
      </div>

      <button onClick={() => setSudoku(startSudoku)}>reset</button>
      <button onClick={() => solveSudoku()}>solve</button>
    </div>
    );

  function handleInput(evt: React.FormEvent<HTMLInputElement>, x: number, y: number) {
    const value = evt.currentTarget.value;

    if (validString(value)) {
      let cell;
      if (value === '') {
        cell = makeEmptyCell();
      } else {
        cell = makeValueCell(Number(value));
      }
      const newSudoku = updateCell(x, y, cell, sudoku);
      setSudoku(newSudoku);
    }
  }

  function solveSudoku() {
    const result = solve(sudoku);

    if (result !== false) {
      setSudoku(result);
    } else {
      console.warn('solver failed');
    }
  }
    
}

function ValueCell(x: number, y: number, value: number, handleInput: (evt: any, x: number, y: number) => void) {
  return (
    <input
      value={value}
      onChange={evt => handleInput(evt, x, y)}
      className={cellClass(x, y)}>
    </input>
  );
}

function EmptyCell(x: number, y: number, handleInput: (evt: any, x: number, y: number) => void) {
  return (
    <input
      value=""
      onChange={evt => handleInput(evt, x, y)}
      className={cellClass(x, y)}>
    </input>
  );
}

function ConstantCell(cellValue: number, x: number, y: number) {
  const classes = cellClass(x, y) + ' constant';
  return (
    <div
      className={classes}
      >
      {cellValue}
    </div>
  )
}


function cellClass(x: number, y: number): string {
  const qx = Math.floor(x/3);
  const qy = Math.floor(y/3);
  const sum = qx + qy;
  return sum % 2 === 0 ? 'cell dark' : 'cell';
}

export default App;
