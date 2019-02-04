/**
 * A Timer component
 * Adapted from https://www.sitepoint.com/creating-accurate-timers-in-javascript/
 * @export Timer
 * @class Timer
 */
export default class Timer {
  /**
   * Creates an instance of Timer.
   *@param {string} element - The DOM element where Timer will output 'elapsed'.
  * @param {number} timeLimit - The time limit (in seconds) that the Timer counts down from.
   * @memberof PCGamesMemory
   */
  constructor (element, timeLimit) {
    this.element = element
    this.timeLimit = timeLimit
    this.timer = 0
    this.startTime = 0
    this.timerID = null
    this.elapsed = 0
    this.timeOut = new window.Event('timeout')
  }
  /**
   * Starts the timer.
   *
   * @memberof Timer
   */
  start () {
    this.timer = 0
    this.startTime = new Date().getTime()
    this.elapsed = this.timeLimit
    this.element.classList.remove('fiveseconds') // Class that can be configured to change appearance
    this.timerCycle()
  }
  /**
   * One cycle of the timer that executes every 100ms until time has run out.
   *
   * @memberof Timer
   */
  timerCycle () {
    this.timer += 100
    this.elapsed = Math.floor((this.timeLimit + 0.1) * 10 - (this.timer / 100)) / 10
    if (Math.round(this.elapsed) === this.elapsed) { this.elapsed += '.0' }
    let diff = (new Date().getTime() - this.startTime) - this.timer
    this.element.textContent = this.elapsed // Updates the element with current cycle output
    if (this.elapsed === '5.0') {
      this.element.classList.add('fiveseconds') // Class that can be configured to change appearance
    }
    if (this.elapsed === '0.0') {
      this.element.dispatchEvent(this.timeOut)
      this.stop()
    } else {
      this.timerID = setTimeout(this.timerCycle.bind(this), (100 - diff))
    }
  }
  /**
   * Stops the timer
   *
   * @memberof Timer
   */
  stop () {
    clearTimeout(this.timerID)
    this.element.classList.remove('fiveseconds')
  }
}
