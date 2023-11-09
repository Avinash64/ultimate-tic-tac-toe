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
              {cell === 1 ? 'x' : cell === 2 ? 'o' : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};


const TicTacToeGrid = () => {
    const [grid, setGrid] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState('x'); 
    const [selectedPlayer, setSelectedPlayer] = useState('x'); // Track selected player
    
    const handlePlayerSelection = (selectedPlayer) => {
        setSelectedPlayer(selectedPlayer);
      };

  useEffect(() => {
    fetch('http://localhost:8000/game')
      .then(response => response.json())
      .then(data => {setGrid(data.data.board); setCurrentPlayer(data.data.x_turn ? 'x' : 'o'); })
      .catch(error => console.error('Error:', error));
  }, []);
  const handlePlayerChange = (e) => {
    setSelectedPlayer(e.target.value);
  };
  const handleClick = (boardIndex, rowIndex, colIndex) => {
    const position = {
      col: colIndex,
      row: rowIndex,
      board: boardIndex
    };
  
    fetch(`http://localhost:8000/play/${position.col}/${position.row}/${position.board}/${selectedPlayer}`, {
        method: 'POST',
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setGrid(data.message.board);
        
        setCurrentPlayer(data.message.x_turn ? 'x' : 'o');  // Update grid state with the new game data after the move
      })
      .catch(error => console.error('Error:', error));
  };
  
  if (grid === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>

    <h1>Current Player: {currentPlayer}</h1> {/* Display the current player's turn */}
    <div>
        <label>
          Select Player:
          <input
            type="radio"
            value="x"
            checked={selectedPlayer === 'x'}
            onChange={handlePlayerChange}
          />
          x
        </label>
        <label>
          <input
            type="radio"
            value="o"
            checked={selectedPlayer === 'o'}
            onChange={handlePlayerChange}
          />
          o
        </label>
        <button onClick={() => handlePlayerSelection(selectedPlayer)}>
          Start Playing
        </button>
      </div>
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
            </div>
  );
};

export default TicTacToeGrid;
