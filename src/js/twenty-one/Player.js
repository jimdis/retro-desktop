/**
 * Module for Player.
 *
 * @module src/Player
 * @author Jim Disenstam
 * @version 1.1
 */

/**
 * Creates a JavaScript Player instance that represents a player.
 *
 * @param {string} name - The name of the player.
 * @param {number} threshold - The threshold score where the player will stop and not draw any more cards.
 * @constructor
 */
export default function Player (name, threshold = 15) {
  /**
  * A string representing the name of the player.
  *
  * @type {string} - The name of the player
  */
  this.name = name

  /**
  * A number representing the threshold score where the player will stop and not draw any more cards.
  *
  * @type {number} - The threshold of the player.
  */
  this.threshold = threshold

  /**
  * An array representing the hand of the player containing Card objects.
  *
  * @type {Array} - The hand of the player.
  */
  this.hand = []

  /**
  * A number representing the score of the player's hand.
  *
  * @type {number} - The score of the player's hand.
  */
  this.score = 0
}

/**
 * Returns a string that represents the hand of the current player.
 *
 * @returns {string} - A string that represents the hand of the current player.
 */
Player.prototype.renderHand = function () {
  let arr = []
  this.hand.forEach(card => arr.push(card.suit + card.rank))
  return arr.join(', ')
}
