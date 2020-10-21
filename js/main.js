import { getRandomColorPairs } from './colorHelper.js';

(function () {
  const GAME_STATE = {
    PENDING: 'pending',
    PLAYING: 'playing',
    BLOCKING: 'blocking',
    FINISHED: 'finished',
  };

  // Game state
  const PAIRS_COUNT = 8;
  const GAME_TIME = 30;

  let selection = [];
  let gameState = GAME_STATE.PENDING;
  let timer = GAME_TIME; // seconds
  let matchCount = 0;
  let countdownInterval = null;
  let randomColorList = [];

  // Query elements
  const colorItemList = document.querySelectorAll('#colorList > li');
  const timerElement = document.querySelector('.game .game__timer');
  const playAgainButton = document.querySelector('.game .game__button');
  const colorBackground = document.querySelector('.color-background');

  const startCountdown = () => {
    countdownInterval = setInterval(() => {
      // show timer
      timerElement.textContent = `${timer}s`;

      // check stop point
      if (timer <= 0) {
        gameState = GAME_STATE.FINISHED;
        timerElement.textContent = 'Game over! 😭';
        playAgainButton.style.display = 'block';

        clearInterval(countdownInterval);
      }

      // decrease 1
      timer -= 1;
    }, 1000);
  };

  const reset = () => {
    // Reset game state
    selection = [];
    gameState = GAME_STATE.PENDING;
    matchCount = 0;

    // Hide play again button
    playAgainButton.style.display = 'none';

    // Re-generate color list
    // Bind colors to overlay
    randomColorList = getRandomColorPairs(PAIRS_COUNT);
    colorItemList.forEach((liElement, idx) => {
      liElement.classList.remove('active');

      const color = randomColorList[idx];

      const overlayElement = liElement.querySelector('.overlay');
      if (overlayElement) {
        overlayElement.style.backgroundColor = color;
      }
    });

    // Reset timer
    timerElement.textContent = '';
    timer = GAME_TIME;
    startCountdown();
  };

  const handleItemClick = (liElement, idx) => {
    // Prevent item click
    if (
      gameState === GAME_STATE.BLOCKING ||
      gameState === GAME_STATE.FINISHED ||
      liElement.classList.contains('active')
    ) {
      return;
    }

    // Show overlay color
    liElement.classList.add('active');

    // Wait until user select two colors
    selection.push(idx);
    if (selection.length < 2) return;

    // Compare selected colors
    const firstColor = randomColorList[selection[0]];
    const secondColor = randomColorList[selection[1]];
    const isMatch = firstColor === secondColor;

    if (!isMatch) {
      gameState = GAME_STATE.BLOCKING;

      setTimeout(() => {
        // remove active class from selected liElement
        colorItemList[selection[0]].classList.remove('active');
        colorItemList[selection[1]].classList.remove('active');

        // reset selection
        selection = [];

        gameState = GAME_STATE.PLAYING;
      }, 500);

      return;
    }

    // Handle match
    matchCount += 1;
    selection = [];
    colorBackground.style.backgroundColor = firstColor;

    // Check win
    if (matchCount === PAIRS_COUNT) {
      timerElement.textContent = 'You win!!! 🎉';
      playAgainButton.style.display = 'block';

      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    }
  };

  const init = () => {
    // Random colors
    randomColorList = getRandomColorPairs(PAIRS_COUNT);

    // Bind colors to overlay
    colorItemList.forEach((liElement, idx) => {
      const color = randomColorList[idx];

      // Query overlay element and set background color
      const overlayElement = liElement.querySelector('.overlay');
      if (overlayElement) {
        overlayElement.style.backgroundColor = color;
      }

      liElement.addEventListener('click', () => handleItemClick(liElement, idx));
    });

    // Bind event click for play again button
    playAgainButton.addEventListener('click', reset);

    // Start countdown
    startCountdown(GAME_TIME);
  };

  init();
})();
