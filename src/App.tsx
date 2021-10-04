import React, { useEffect, useState } from 'react';
import './App.scss';
import { makeEmptyCell, makeEmptySudoku, makeValueCell, readSudoku, SudokuCellValue, updateCell, validString} from './lib/sudoku';
import { sudoku1 } from './data/sudoku1';
import { solve } from './lib/solver';
import { generateSudoku } from './lib/generate';

const startSudoku = makeEmptySudoku();

const difficulties: number[] = [];
for (let i = 1; i < 81-17; i++) {
  difficulties.push(i);
}

enum State {Normal, Help};

function App() {
  
  const [sudoku, setSudoku] = useState(startSudoku);
  const [resetSudoku, setResetSudoku] = useState(sudoku);
  const [solving, setSolving] = useState(false);
  const [difficulty, setDifficulty] = useState(20);
  const [state, setState] = useState(State.Normal);

  useEffect(() => {sudokuGenerate(); return;}, []);

  return (
    <div className={`content ${state === State.Help ? 'help' : ''}`}>
      
      <div className="leftcol"></div>
      <div className="centercol">
        <div className="sudoku-grid shadow">
          {sudoku.data.map((row, y) => <div className="row">
            {row.data.map((cell, x) => {
              if (state === State.Help) {
                if (cell.type === 'value') {
                  return ValueInfoCell(x, y, cell.value, handleInfo);
                } else if (cell.type === 'empty') {
                  return EmptyInfoCell(x, y, handleInfo);
                } else if (cell.type === 'constant') {
                  return ConstantCell(cell.value, x, y);
                }
              } else if (cell.type === 'value') {
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
      </div>
      <div className="rightcol">
        
        <div className="info">
          {state === State.Help ? <div className="popup shadow">
            <div className="padding">
            Select a square to recieve a hint!
            </div>
          </div> : null}
        </div>

        <div className="functions shadow">
          <button onClick={() => setSudoku(resetSudoku)}>reset</button>
          <button disabled={solving} onClick={() => solveSudoku()}>solve</button>
          <button onClick={() => setState(state === State.Normal ? State.Help : State.Normal)}>
            {state === State.Normal ? 'help' : 'normal'}
          </button>

          <div className="difficulty">
            <label htmlFor="difficulty">difficulty: </label>
            <select id="difficulty" onChange={x => setDifficulty(Number(x.target.value))}>
              {difficulties.map(x => <option selected={x === difficulty} value={x}>{x}</option>)}
            </select>
          </div>

          <button onClick={() => sudokuGenerate()}>Generate</button>
        </div>
      </div>
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

  function handleInfo(x: number, y: number) {
    setSolving(true);
    const solved = solve(resetSudoku);
    if (solved) {
      const value = (solved.data[y].data[x] as SudokuCellValue).value;
      setSudoku(updateCell(x, y, makeValueCell(value), sudoku));
    }
    setSolving(false);
  }

  function sudokuGenerate() {
    setSolving(true);
    const sudoku = generateSudoku(difficulty);
    if (sudoku) {
      setSudoku(sudoku);
      setResetSudoku(sudoku);
    } else {
      console.warn('Generation error');
    }
    setSolving(false);
  }

  function solveSudoku() {
    setSolving(true);
    const result = solve(sudoku);

    if (result !== false) {
      setSudoku(result);
    } else {
      console.warn('solver failed');
    }

    setSolving(false);
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

function ValueInfoCell(x: number, y: number, value: number, handleInfo: (x: number, y:number) => void) {
  const classes = cellClass(x, y) + ' help';
  return (
    <div
      className={classes}
      onClick={() => handleInfo(x, y)}
      >
      {value}
    </div>
  )
}

function EmptyInfoCell(x: number, y: number, handleInfo: (x: number, y:number) => void) {
  const classes = cellClass(x, y) + ' help';
  return (
    <div
      className={classes}
      onClick={() => handleInfo(x, y)}
      >
    </div>
  )
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
