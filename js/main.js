import { getRandomColorPairs } from "./colorHelper.js";

(function () {
  const GAME_STATE = {
    PENDING: 'pending',
    PLAYING: 'playing',
    BLOCKING: 'blocking',
    FINISHED: 'finished'
  }

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

  const init = () => { }

  init();
})();
