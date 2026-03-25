import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black border-4 border-[#0ff] shadow-[8px_8px_0_#f0f]">
      <div className="flex justify-between w-full items-center px-2">
        <div className="text-xl font-display text-[#f0f] tracking-tighter">
          SCORE: <span className="text-[#0ff]">{score}</span>
        </div>
        <button 
          onClick={() => setIsPaused(p => !p)}
          className="px-4 py-1 border-2 border-[#0ff] text-[#0ff] font-display text-[10px] uppercase hover:bg-[#0ff] hover:text-black transition-all"
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      <div 
        className="relative bg-black border-4 border-[#0ff] overflow-hidden"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#0ff]" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute ${i === 0 ? 'bg-[#0ff] shadow-[0_0_10px_#0ff]' : 'bg-[#0ff]/60'}`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-[#f0f] shadow-[0_0_15px_#f0f] animate-noise"
          style={{
            width: 20,
            height: 20,
            left: food.x * 20,
            top: food.y * 20,
          }}
        />

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-display text-[#f0f] mb-6 glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-[#0ff] text-black font-display text-sm font-bold hover:bg-[#f0f] transition-all shadow-[4px_4px_0_#fff]"
            >
              REBOOT_SESSION
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {isPaused && !isGameOver && score === 0 && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <p className="text-[#0ff] mb-8 text-center px-4 font-display text-[10px] leading-relaxed">
              [ ARROW_KEYS ] = VECTOR_CONTROL<br />
              [ SPACE ] = EXECUTE
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-10 py-4 border-4 border-[#f0f] text-[#f0f] font-display text-xs font-bold hover:bg-[#f0f] hover:text-black transition-all shadow-[4px_4px_0_#0ff]"
            >
              INIT_GAME
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
