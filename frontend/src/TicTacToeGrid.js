import React, { useState, useEffect } from 'react';
import './TicTacToeGrid.css';

const SmallBoard = ({ board, onClick }) => {
  return (
    <div className="small-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`cell ${cell === 1 ? 'x' : cell === 2 ? 'o' : 'yellow'}`}
              onClick={() => onClick(rowIndex, colIndex)}
            >
              {cell === 1 ? 'X' : cell === 2 ? 'O' : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const TicTacToeGrid = () => {
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/game')
      .then(response => response.json())
      .then(data => setGrid(data.data.board))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleClick = (boardIndex, rowIndex, colIndex) => {
    const position = {
      col: colIndex,
      row: rowIndex,
      board: boardIndex
    };
  
    fetch('http://localhost:8000/play/' + position.col + '/' + position.row + '/' + position.board, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setGrid(data.message.board); // Update grid state with the new game data after the move
      })
      .catch(error => console.error('Error:', error));
  };
  
  if (grid === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tictactoe-grid">
      {grid.map((board, boardIndex) => (
        <div key={boardIndex} className="board">
          <SmallBoard
            board={board}
            onClick={(rowIndex, colIndex) => handleClick(boardIndex, rowIndex, colIndex)}
          />
        </div>
      ))}
    </div>
  );
};

export default TicTacToeGrid;
