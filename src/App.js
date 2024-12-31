import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);
  const [gameOver, setGameOver] = useState(false);
  const boardSize = 20;

  const gameLoop = useRef();

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  const moveSnake = () => {
    let newSnake = [...snake];
    let head = newSnake[newSnake.length - 1];

    switch (direction) {
      case 'UP':
        head = [head[0], head[1] - 1];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 1];
        break;
      case 'LEFT':
        head = [head[0] - 1, head[1]];
        break;
      case 'RIGHT':
        head = [head[0] + 1, head[1]];
        break;
      default:
        break;
    }

    newSnake.push(head);
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood([
        Math.floor(Math.random() * boardSize),
        Math.floor(Math.random() * boardSize),
      ]);
      setSpeed((prev) => Math.max(prev - 10, 50));
    } else {
      newSnake.shift();
    }

    if (
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= boardSize ||
      head[1] >= boardSize ||
      newSnake.slice(0, -1).some((segment) => segment[0] === head[0] && segment[1] === head[1])
    ) {
      setGameOver(true);
      clearInterval(gameLoop.current);
      return;
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver) {
      gameLoop.current = setInterval(moveSnake, speed);
      return () => clearInterval(gameLoop.current);
    }
  }, [snake, speed, gameOver]);

  return (
    <div className="container">
      <header className="header">
        <h1>Snake Game</h1>
      </header>
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      ) : (
        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
        >
          {Array.from({ length: boardSize * boardSize }, (_, i) => {
            const x = i % boardSize;
            const y = Math.floor(i / boardSize);
            const isSnake = snake.some((segment) => segment[0] === x && segment[1] === y);
            const isFood = food[0] === x && food[1] === y;
            return (
              <div
                key={i}
                className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
