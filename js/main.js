import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getActiveColorList,
  getColorElementList,
  getColorListElement,
  getPlayAgainButton,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hidePlayagainButton,
  setBackgroundColor,
  setTimerText,
  showPlayAgainButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME, //GAME_TIME ,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
  let fullSeconds = `0${second}`.slice(-2)
  setTimerText(fullSeconds)
}
function handleTimerFinish() {
  //endgame
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('GAME OVER 😭😭😭')
  showPlayAgainButton()
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColor() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  // random color
  // binding

  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElements = liElement.querySelector('.overlay')
    if (overlayElements) overlayElements.style.backgroundColor = colorList[index]
  })
}

function attachEventForColorList() {
  const uList = getColorListElement()
  if (!uList) return
  uList.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    handleColorClick(event.target)
  })
}
function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || shouldBlockClick || isClicked) return
  liElement.classList.add('active')

  selections.push(liElement)
  if (selections.length < 2) return

  //check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    //check win
    setBackgroundColor(firstColor)

    const isWin = getActiveColorList().length === 0
    if (isWin) {
      showPlayAgainButton()
      //show u win
      setTimerText('YOU WIN  🥳  🥳  🥳 ')
      timer.clear()
      gameStatus = GAME_STATUS.FINISHED
    }

    selections = []
    return
  }
  //  in case of not match
  // remove active class for 2 li elements
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []

    //race-condicon, check with handleTimer Finish
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return
  playAgainButton.addEventListener('click', resetGame)
}
function resetGame() {
  //reser gloabal vars
  gameStatus = GAME_STATUS.PLAYING
  selections = []
  // reset Dom

  //remove active class from li
  // hide replay buttn
  //clear timer text, U WIN text
  const colorElementList = getColorElementList()
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active')
  }
  hidePlayagainButton()
  setTimerText('')
  //re-generate newcolor
  initColor()

  // start for new game
  startTimer()
}

function startTimer() {
  timer.start()
}

;(() => {
  initColor()

  attachEventForColorList()

  attachEventForPlayAgainButton()
  startTimer()
})()
