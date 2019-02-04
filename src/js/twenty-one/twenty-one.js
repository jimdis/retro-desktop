import Game from './Game.js'
import './playing-card.js'
import help from './help.txt'

const template = document.createElement('template')

template.innerHTML = /* html */`
<style>
:host {
    display: block;
    font-size: 15px;
    position: relative;
    width: 100%;
    min-width: 400px;
    height: 100%;
    overflow: hidden;
    margin: 0 auto;
}

#help {
    position: absolute;
    background-color: white;
    opacity: 0.9;
    width: 300px;
    top: 10px;
    left: 50px;
    z-index: 999;
}

#help p.heading {
    margin: 10px;
    text-align: center;
    font-size: 20px;
}

#help p.body {
    margin: 10px;
    white-space: pre-wrap;
}

#background {
    position: relative;
    height: 200px;
    background: url(../image/twenty-one-bg.gif);
    background-repeat: no-repeat;
    background-size: 400px 200px;
}

#play-buttons,
#restart-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
}

button {
    width: 100px;
    font-size: 20px;
    background-color: blue;
    color: white;
    padding: 14px 20px;
    margin: 8px;
    box-shadow: 2px 2px silver;
    cursor: inherit;
}

#restart-button button {
    width: 216px;
}

#card-table {
    height: 160px;
    background: green;
}

#dealer-cards {
    height: 78px;
    border-top: 1px solid grey;
    padding-top: 1px;
}

#player-cards {
    height: 79px;
    border-top: 1px solid grey;
    padding-top: 1px;
}

playing-card {
    display: inline-block;
    margin: 2px;
}

#user-interaction {
    position: relative;
    height: 70px;
    background: silver;
}

#status-div {
    width: 240px;
    margin-left: 10px;
    line-height: 25px;
    float: left;
}

#status::before {
    content: '» ';
    font-size: 20px;
    color: green;
    animation: blink 1s linear infinite;
}

#score-div {
    width: 150px;
    line-height: 25px;
    float: right;
}

#score-div>span {
    display: block;
}

#result {
    width: 100%;
    line-height: 20px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: black;
    color: white;
    text-align: center;
}

.hidden {
    display: none
}

@keyframes blink {
    0% {
        color: transparent;
    }

    100% {
        color: green;
    }
}
</style>
<div id="help" class="hidden">
  <p class="heading"></p>
  <p class="body"></p>
</div>
<div id="background">
<div id="play-buttons">
    <button id="button-draw">Draw!</button><button id="button-stay">Stay...</button>
  </div>
  <div id="restart-button" class="hidden">
    <button id="button-restart">Play Again!</button>
  </div>
</div>
<div id="card-table">
  <div id="dealer-cards"></div>
  <div id="player-cards"></div>
</div>
<div id="user-interaction">
  <div id="status-div">
    <span id="status"></span>
  </div>
  <div id="score-div">
    <span >Player Score: <span id="player-score"></span></span>
    <span>Dealer Score: <span id="dealer-score"></span></span>
  </div>
  <div id="result"></div>
</div> 
`

/**
 * A Twenty One game component
 *
 * @class TwentyOne
 * @extends {window.HTMLElement}
 */

class TwentyOne extends window.HTMLElement {
  /**
   * Creates an instance of Twenty One.
   * @memberof TwentyOne
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$ = (element) => this.shadowRoot.querySelector(element)
    this.table = this.$('#card-table')
    this.dealerThreshold = 15
    this.name = 'Twenty One'
    this.settings = {
      dealerThreshold: {
        name: 'Dealer Style',
        setting: {
          cautious: { name: 'Coward', threshold: 10 },
          normal: { name: 'Mr Average', threshold: 15 },
          aggressive: { name: 'Mr Aggressive', threshold: 17 },
          nightmare: { name: 'Max Testosterone!', threshold: 20 }
        },
        run: (setting) => {
          this.setAttribute('threshold', setting.threshold)
        }
      },
      help: {
        name: 'Help',
        setting: this._showHelp.bind(this, help)
      },
      restart: {
        name: 'Restart Game',
        setting: this.newRound.bind(this)
      }
    }
  }
  /**
   * Watches the attribute "threshold" for changes on the element.
   *
   * @readonly
   * @static
   * @memberof TwentyOne
   */
  static get observedAttributes () {
    return ['threshold']
  }
  /**
   * Called by the browser engine when an attribute changes
   *
   * @param {any} name of the attribute
   * @param {any} oldValue
   * @param {any} newValue
   * @memberof TwentyOne
   */
  attributeChangedCallback (name, oldValue, newValue) {
    this.dealerThreshold = parseInt(newValue)
    this.newRound()
  }

  /**
   * Called when connected to the DOM
   *
   * @memberof TwentyOne
   */
  connectedCallback () {
    // save reference so the event listener can be removed
    this.game = new Game(this.dealerThreshold)
    this._boundClick = this._click.bind(this)
    this.$('#play-buttons').addEventListener('click', this._boundClick)
    this._promptPlayer()
    this.$('#button-draw').focus()
  }

  /**
   * Called when removed from the DOM.
   *
   * @memberof TwentyOne
   */
  disconnectedCallback () {
    this.$('#play-buttons').removeEventListener('click', this._boundClick)
    this.$('#player-cards').innerHTML = null
    this.$('#dealer-cards').innerHTML = null
    this.$('#result').textContent = null
    this.$('#player-score').textContent = null
    this.$('#dealer-score').textContent = null
    this.$('#restart-button').classList.add('hidden')
    this.$('#play-buttons').classList.remove('hidden')
    this.game.result = null
    this.game.player.score = null
    this.game.dealer.score = null
    this.game = null
  }
  /**
 * Checks which button user clicks and proceeds with game logic.
 *
 * @param {any} e
 * @memberof TwentyOne
 */
  _click (e) {
    if (e.target.id === 'button-draw') {
      this.game.drawCard(this.game.player)
      this._renderPlayerCard(this.game.player.hand)
    }
    if (e.target.id === 'button-stay') {
      this.game.dealerPlay()
      this._renderDealerHand(this.game.dealer.hand)
      this._renderResult()
    }
    this._renderScore()
    this._promptPlayer(this.game.newRound)
  }
  /**
 * Prompts player to draw, stay or play new game, depending on game state.
 *
 * @param {boolean} end True if game has ended, false if ongoing.
 * @memberof TwentyOne
 */
  _promptPlayer (end) {
    let prompt
    if (end || this.game.player.score >= 21) {
      this._renderResult()
      prompt = 'Play again?'
    } else { prompt = 'Draw or Stay?' }
    this.$('#status').textContent = prompt
  }
  /**
 * Renders scores in relevant element.
 *
 * @memberof TwentyOne
 */
  _renderScore () {
    this.$('#player-score').textContent = this.game.player.score || ''
    this.$('#dealer-score').textContent = this.game.dealer.score || ''
  }
  /**
 * Creates a 'playing-card' custom element with attributes for suit and rank and returns the element.
 *
 * @param {Object} face Object containing properties 'suit' and 'rank'
 * @returns {element} Playing-card custom element
 * @memberof TwentyOne
 */
  _renderCard (face) {
    let card = document.createElement('playing-card')
    card.setAttribute('suit', face.suit)
    card.setAttribute('rank', face.rank)
    return card
  }
  /**
 * Takes the player's latest card and inserts into DOM.
 *
 * @param {Array} hand The player's hand containing cards.
 * @memberof TwentyOne
 */
  _renderPlayerCard (hand) {
    let face = hand.slice(-1)[0]
    let card = this._renderCard(face)
    this.$('#player-cards').appendChild(card)
  }

  /**
   * Takes the dealer's hand of cards and inserts each card into the DOM.
   *
   * @param {Array} hand The dealer's hand containing cards.
   * @memberof TwentyOne
   */
  _renderDealerHand (hand) {
    hand.forEach(face => {
      let card = this._renderCard(face)
      this.$('#dealer-cards').appendChild(card)
    })
  }
  /**
 * Reads the result of the Game and displays it.
 * Adds event listener for starting new game.
 *
 * @memberof TwentyOne
 */
  _renderResult () {
    this.$('#result').textContent = this.game.result || ''
    this.$('#play-buttons').classList.add('hidden')
    this.$('#restart-button').classList.remove('hidden')
    this.$('#button-restart').focus()
    this.$('#restart-button').addEventListener('click', () => this.newRound(), { once: true })
  }
  /**
 * Starts a new round of the game.
 *
 * @memberof TwentyOne
 */
  newRound () {
    this.disconnectedCallback()
    this.connectedCallback()
  }
  /**
 * Reads a text file and displays it's contents in the relevant element.
 *
 * @param {URL} helpFile URL of text file.
 * @memberof TwentyOne
 */
  async _showHelp (helpFile) {
    let response = await window.fetch(helpFile)
    let text = await response.text()
    let heading = text.slice(text.indexOf('#') + 1, text.indexOf('\n'))
    let body = text.slice(text.indexOf('\n') + 2)
    this.$('#help p.heading').textContent = heading
    this.$('#help p.body').textContent = body
    this.$('#help').classList.remove('hidden')
    this.addEventListener('click', () => this.$('#help').classList.add('hidden'), { once: true })
  }
}
// Registers the custom event
window.customElements.define('twenty-one', TwentyOne)
