const template = document.createElement('template')

template.innerHTML = /* html */`
<style>
  
:host {
  display: block;
  margin: 0;
  padding: 0;
  font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
  font-size: 15px;
  text-align: center;
}

#card {
  background-color: white;  
  width: 40px;
  height: 70px;
  border: 1px solid grey;
}

div.suit {
  margin: 2px;
  width: 16px;
  line-height: 16px;
}

#rank {
  clear: both;
  margin: 0 5px;
  font-size: 25px;
  width: 28px;
  line-height: 28px;
  
}

div.left {
  float: left
}

div.right {
  float: right
}

div.red {
  color: red;
}

div.black {
  color: black
}

#rank.black {
  border: 1px solid black;
}

#rank.red {
  border: 1px solid red;
}
</style>

<div id="card">
  <div class="suit top left">♥</div>
  <div class="suit top right">♥</div>
  <div id="rank">A</div>
  <div class="suit bottom left">♥</div>
  <div class="suit bottom right">♥</div>
</div>
`
/**
 * A Playing Card component
 *
 * @class PlayingCard
 * @extends {window.HTMLElement}
 */

window.customElements.define('playing-card', class PlayingCard extends window.HTMLElement {
  /**
   * Creates an instance of a Playing Card.
   * @memberof PlayingCard
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
  /**
   * Watches the attributes "suit" and "rank" for changes on the element.
   *
   * @readonly
   * @static
   * @memberof PlayingCard
   */
  static get observedAttributes () {
    return ['suit', 'rank']
  }
  /**
   * Called by the browser engine when an attribute changes
   *
   * @param {any} name of the attribute
   * @param {any} oldValue
   * @param {any} newValue
   * @memberof PlayingCard
   */
  attributeChangedCallback (name, oldValue, newValue) {
    this._updateStyle()
  }
  /**
   * Called when connected to the DOM
   *
   * @memberof PlayingCard
   */
  connectedCallback () {
    this._updateStyle()
  }
  /**
 * Updates the face of the playing card given its attributes for suit and rank.
 *
 */
  _updateStyle () {
    let suit = this.getAttribute('suit')
    let rank = this.getAttribute('rank')
    let color = ['♠', '♣'].includes(suit) ? 'black' : 'red'
    this.shadowRoot.querySelectorAll('div.suit').forEach(div => {
      div.textContent = suit
      div.classList.add(color)
    })
    this.shadowRoot.querySelector('#rank').textContent = rank
    this.shadowRoot.querySelector('#rank').classList.add(color)
  }
}
)
