useEffect(() => {
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

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [direction]);

useEffect(() => {
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

  if (!gameOver) {
    gameLoop.current = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop.current);
  }
}, [snake, speed, gameOver, direction, food, boardSize]);
