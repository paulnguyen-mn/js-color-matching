import { getColorBackground, getPlayAgainButton, getTimerElement } from './selectors.js'

function suffer(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr
  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })
    colorList.push(color)
  }
  const fullColorList = [...colorList, ...colorList]
  suffer(fullColorList)
  return fullColorList
}
export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.add('show')
}
export function hidePlayagainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.remove('show')
}
export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null
  function start() {
    let currentSecond = seconds
    clear()
    intervalId = setInterval(() => {
      if (onChange) onChange(currentSecond)
      currentSecond--
      if (currentSecond < 0) {
        clear()
        onFinish?.()

      }
    }, 1000)
  }
  function clear() {
    clearInterval(intervalId)
  }

  return {
    start,
    clear,
  }
}
export function setBackgroundColor(color) {
  const backgroundElement = getColorBackground()
  if (backgroundElement) backgroundElement.style.backgroundColor = color
}