/**
 * Module for Game.
 *
 * @module src/Game
 * @author Jim Disenstam
 * @version 1.1
 */

import createDeck from './deck.js'
import Player from './Player.js'
import * as scoring from './scoring.js'

/**
 * Represents a game of '21'.
 *
 * @class Game
 */
export default class Game {
  /**
   * Creates an instance of Game.
   * @param {number} [dealerThreshold=15] - The threshold score where the dealer will stop and not draw any more cards. Accepts Minimum 1, Maximum 21.
   * @memberof Game
   */
  constructor (dealerThreshold) {
    /**
    * A Player object named 'Player', representing the Player in the Game.
    *
    * @type {object}
    */
    this.player = new Player('Player')

    /**
    * A Player object named 'Dealer', representing the Dealer in the Game.
    *
    * @type {object}
    */
    this.dealer = new Player('Dealer', dealerThreshold)

    /**
    * An array with each element containing a Card object, representing a deck of playing cards.
    *
    * @type {Array}
    */
    this.deck = createDeck()

    /**
    * A string that logs the hands and scores of each individual player vs dealer match.
    *
    * @type {string}
    */
    this.result = ''

    /**
    * A boolean indicating whether the game has ended.
    *
    * @type {boolean}
    */
    this.newRound = false
  }

  /**
   * Dealer draws cards until reaching threshold, after which this.newRound is set to true.
   *
   * @memberof Game
   */
  dealerPlay () {
    let dealer = this.dealer
    do {
      this.drawCard(dealer)
      dealer.score = scoring.calculateScore(dealer.hand)
    } while (dealer.score < dealer.threshold)
    this.result = scoring.toString(this.player, this.dealer)
    this.newRound = true
  }

  /**
   * Pops a card out of the deck array and pushes it to the relevant player's hand array.
   * If player's (not dealer's) hand contains five cards, this.newRound is set to true
   *
   * @param {object} player - The relevant player (or Dealer) drawing the card.
   * @memberof Game
   */
  drawCard (who) {
    let drawer = who
    let card = this.deck.pop()
    drawer.hand.push(card)
    drawer.score = scoring.calculateScore(drawer.hand)
    this.result = scoring.toString(this.player, this.dealer)
    this.newRound = (this.player.hand.length === 5)
  }
}
