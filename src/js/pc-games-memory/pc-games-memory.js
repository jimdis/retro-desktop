import Timer from './Timer.js'
import populateArray from './array.js'
import titles from './cards.json'
const template = document.createElement('template')

template.innerHTML = /* html */`
<style>
:host {
    display: block;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
    min-width: 400px;
    height: 100%;
    overflow: hidden;
}

button:focus {
    outline: none;
}

button:focus img,
button:hover img,
img.faceUp {
    box-shadow:
        1px 1px silver,
        2px 2px silver,
        3px 3px silver;
    -webkit-transform: translateX(-3px);
    transform: translateX(-3px);
    transition: all 0.3s ease;
}

#board {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 60px;
    padding: 0;
    overflow: scroll;
}

#output {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 55px;
    margin: 10px 0 0;
    border-top: 1px solid black;

    background-color: yellow;
}

button {
    border: none;
    background-color: transparent;
    padding: 0;
    width: 100%;
    height: 100%;
    display: block;
    margin: auto;
    cursor: inherit;
}

img {
    width: 55px;
    border: 1px solid black;
    border-radius: 10px;
    vertical-align: middle;
}

img.faceDown {
    background-color: silver;
}

p.console {
    margin: 0;
}

.card {
    display: inline-block;
    width: 65px;
    height: 75px;
    text-align: center;
    vertical-align: middle;
}

.card.firstColumn {
    float: left;
}

#left-column {
    margin-top: 5px;
    width: 70px;
    float: left;
}

#left-column>span,
#right-column>span {
    display: block
}

#timer,
#counter {
    margin-left: 5px;
}

#timer::before {
    content: '⏱'
}

#counter::before {
    content: '♾'
}

.fiveseconds {
    color: red;
    animation: blink 1s linear infinite;
}

#right-column {
    margin-top: 5px;
    width: 330px;
    float: right;
    text-align: right;
}

#title,
#status {
    margin-right: 5px;

}

@keyframes blink {
    0% {
        opacity: 0;
    }

    50% {
        opacity: .5;
    }

    100% {
        opacity: 1;
    }
}
}
</style>
<div id="board">
</div>
<div id="output">
  <div id="left-column">
    <span id="timer"></span>
    <span id="counter"></span>
  </div>
  <div id="right-column">
    <span id="title"></span>
    <span id="status"></span>
  </div>
</div> 
`

const cardTemplate = document.createElement('template')

cardTemplate.innerHTML = /* html */`
<div class="row"></div>
<div class="card">
<button tabindex="1">
<img class="faceDown" src="./image/0.png">
</button>
</div>
`

/**
 * A PC Games Memory game component
 *
 * @class PCGamesMemory
 * @extends {window.HTMLElement}
 */

class PCGamesMemory extends window.HTMLElement {
  /**
   * Creates an instance of PC Games Memory.
   * @memberof PCGamesMemory
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.board = this.shadowRoot.querySelector('#board')
    this.imageCount = 18
    this.rows = 6
    this.columns = 6
    this.timer = new Timer(this.shadowRoot.querySelector('#timer'), 10)
    // this._populateArray = populateArray

    this.name = 'PC Games Memory'
    this.cardTitles = titles
    this.settings = {
      boardSize: {
        name: 'Board size',
        setting: {
          twoByFour: { name: '2x4', rows: 2, cols: 4 },
          threeByFour: { name: '3x4', rows: 3, cols: 4 },
          fourByFour: { name: '4x4', rows: 4, cols: 4 },
          fourByFive: { name: '4x5', rows: 4, cols: 5 },
          fourBySix: { name: '4x6', rows: 4, cols: 6 },
          fiveBySix: { name: '5x6', rows: 5, cols: 6 },
          sixBySix: { name: '6x6', rows: 6, cols: 6 }
        },
        run: (setting) => {
          this.setAttribute('rows', setting.rows)
          this.setAttribute('columns', setting.cols)
        }
      },
      timer: {
        name: 'Time limit',
        setting: {
          fiveSeconds: { name: '5 seconds', value: 5 },
          tenSeconds: { name: '10 seconds', value: 10 },
          fifteenSeconds: { name: '15 seconds', value: 15 },
          twentySeconds: { name: '20 seconds', value: 20 }
        },
        run: (setting) => {
          this.setAttribute('timer', setting.value)
        }
      },
      restart: {
        name: 'Restart Game',
        setting: this.newRound.bind(this)
      }
    }
  }
  /**
   * Watches the attributes "rows", "columns", "images" and "timer" for changes on the element.
   *
   * @readonly
   * @static
   * @memberof PCGamesMemory
   */
  static get observedAttributes () {
    return ['rows', 'columns', 'images', 'timer']
  }
  /**
   * Called by the browser engine when an attribute changes
   *
   * @param {any} name of the attribute
   * @param {any} oldValue
   * @param {any} newValue
   * @memberof PCGamesMemory
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'rows') {
      this.rows = newValue
      this.newRound()
    }
    if (name === 'columns') {
      this.columns = newValue
      this.newRound()
    }
    if (name === 'images') {
      this.imageCount = parseInt(newValue)
    }
    if (name === 'timer') {
      this.timer.timeLimit = parseInt(newValue)
    }
  }

  /**
   * Called when connected to the DOM
   *
   * @memberof PCGamesMemory
   */
  connectedCallback () {
    if (this.imageCount <= 3) {
      console.error('You need at least four images for the game to work')
      this.board.textContent = 'You need at least four images for the game to work'
      return
    }
    if (this.imageCount * 2 < this.rows * this.columns) {
      console.error('Sorry, you need more images for this board, size. Defaulting to maximum board size')
      this._optimizeSize(this.imageCount)
    }
    let array = populateArray(this.rows * this.columns / 2, this.imageCount)
    this._populateBoard(this.board, this.rows, this.columns, array)
    this._clickNum = 0
    this._roundNum = 1
    this._activeCards = []
    this._match = false
    this._newRound = false
    this._clickAnywhere = false
    // save reference so the event listener can be removed
    this._boundClicked = this._clicked.bind(this)
    this.board.addEventListener('click', this._boundClicked)
    this._renderOutput()
  }

  /**
   * Called when removed from the DOM.
   *
   * @memberof PCGamesMemory
   */
  disconnectedCallback () {
    this.timer.stop()
    this.board.removeEventListener('click', this._boundClicked)
    this.board.innerHTML = null
  }
  /**
   * Called from click event listener when user clicks on board.
   *
   * @param {any} e Event
   * @memberof PCGamesMemory
   */
  _clicked (e) {
    // If user switches from keyboard to mouse
    if (e.clientX !== 0) document.activeElement.blur()
    if (this._newRound) {
      this.newRound()
      return
    }
    let card
    // Selects image as the correct element
    if (e.target.tagName === 'IMG') {
      card = e.target
    } else if (e.target.tagName === 'BUTTON') {
      card = e.target.firstElementChild
    } else if (!this._clickAnywhere) {
      return
    }
    this._clickNum++
    this._clickAnywhere = false
    this._updateGame(card)
  }
  /**
   * Game logic - updates game to next state depending on current state (clickNum)
   *
   * @param {string} card URL of the image file currently selected
   * @memberof PCGamesMemory
   */
  async _updateGame (card) {
    let number = (element) => element.getAttribute('data-number')
    let title
    // End of round
    if (this._clickNum === 3) {
      let activeCards = this.board.querySelectorAll('img.faceUp')
      this._roundNum++
      if (this._match) {
        activeCards.forEach((card) => card.parentElement.remove())
      } else {
        activeCards.forEach((card) => { card.src = this._changeImage(card) })
      }
      this._clickNum = 0
    }
    // After two cards have been selected
    if (this._clickNum === 2) {
      card.src = this._changeImage(card)
      title = await this.cardTitles[number(card)]
      // So user isn't able to click turned-up card.
      if (card === this._previousCard) {
        card.src = this._changeImage(card)
        this._clickNum--
        return
      }
      this.timer.stop()
      // Checks if selected cards match
      this._match = (number(card) === number(this._previousCard))
      if (this._match) this._newRound = (this.board.querySelectorAll('img').length === 2)
      this._clickAnywhere = true
    }
    // After one card has been selected
    if (this._clickNum === 1) {
      card.src = this._changeImage(card)
      title = await this.cardTitles[number(card)]
      this.timer.start()
      this._previousCard = card
      this.shadowRoot.querySelector('#timer').addEventListener('timeout', () => {
        this._newRound = true
        this._renderOutput()
      }, { once: true })
    }
    this._renderOutput(title)
  }
  /**
 * Changes the image URL of selected card and sets class to face up or face down
 *
 * @param {string} card URL of the image file currently selected
 * @returns {string} URL of the new image
 * @memberof PCGamesMemory
 */
  _changeImage (card) {
    let number = card.getAttribute('data-number')
    card.classList.toggle('faceDown')
    card.classList.toggle('faceUp')
    let baseURL = card.src.slice(0, card.src.lastIndexOf('/') + 1)
    if (card.className === 'faceUp') {
      return baseURL + number.toString() + card.src.slice(-4)
    } else return baseURL + '0' + card.src.slice(-4)
  }
  /**
 * Calculates the optimal size (as square as possible) of the board based on the number if image files.
 *
 * @param {number} imageCount Number of image files.
 * @memberof PCGamesMemory
 */
  _optimizeSize (imageCount) {
  // Possible sizes that yield an even number of cards
    let sizes = this.settings.boardSize.setting
    let result
    Object.keys(sizes).forEach(key => {
      let rows = sizes[key].rows
      let cols = sizes[key].cols
      let images = rows * cols / 2
      if (imageCount >= images) {
        result = {
          images: images,
          rows: rows,
          columns: cols
        }
      }
    })
    this.images = result.images
    this.rows = result.rows
    this.columns = result.columns
  }
  /**
 * Initiates a new round.
 *
 * @memberof PCGamesMemory
 */
  newRound () {
    this.disconnectedCallback()
    this.connectedCallback()
  }
  /**
 * Renders output depending on game state.
 *
 * @param {string} [name=':)'] Title of currently selected card. Defaults to happy face if no title exists.
 * @memberof PCGamesMemory
 */
  _renderOutput (name = ':)') {
    let title = this.shadowRoot.querySelector('#title')
    let status = this.shadowRoot.querySelector('#status')
    let counter = this.shadowRoot.querySelector('#counter')
    let timer = this.shadowRoot.querySelector('#timer')

    if (this._clickNum === 1) {
      if (this._newRound) {
        timer.textContent = '☠'
        status.textContent = 'Time is out! Click anywhere to play again'
      } else {
        title.textContent = name
        status.textContent = 'Now try to find a match!'
      }
    }
    if (this._clickNum === 2) {
      title.textContent = name
      status.textContent = this._match ? 'Nice!' : 'Try again!'
      status.textContent += ' Click anywhere to '
      status.textContent += this._newRound ? 'play a new game.' : 'continue.'
    }
    if (this._clickNum === 0) {
      title.textContent = ''
      timer.textContent = ''
      status.textContent = 'Pick a card!'
      counter.textContent = this._roundNum
    }
  }
  /**
 * Populates board with cards.
 *
 * @param {string} parent The parent element containing the cards (the "board").
 * @param {number} rows Number of rows.
 * @param {number} columns Number of columns.
 * @param {array} array Array of numbers representing card/image number.
 * @memberof PCGamesMemory
 */
  _populateBoard (parent, rows, columns, array) {
    let index = 0
    for (let i = 0; i < rows; i++) {
      let row = cardTemplate.content.cloneNode(true).querySelector('.row')

      for (let j = 0; j < columns; j++) {
        let div = cardTemplate.content.cloneNode(true).querySelector('.card')
        let img = div.querySelector('img')
        img.setAttribute('data-number', array[index])
        index++
        row.appendChild(div)
        parent.appendChild(row)
      }
    }
  }
}
// Registers the custom event
window.customElements.define('pc-games-memory', PCGamesMemory)
