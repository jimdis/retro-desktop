import shuffle from './../common/shuffle.js'

/**
 * Module for deck.
 *
 * @module src/deck
 * @author Jim Disenstam
 * @version 1.1
 */

import Card from './Card.js'

/**
 * Returns an array with Card objects representing a deck of 52 playing cards.
 *
 * @returns {Array} - An array with Card objects representing a deck of 52 playing cards.
 */
export default function createDeck () {
  let deck = []
  let suits = ['♥', '♦', '♣', '♠']
  let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']
  for (let i = 0; i < suits.length; i++) {
    for (let y = 0; y < ranks.length; y++) {
      deck.push(new Card(suits[i], ranks[y]))
    }
  }
  deck = shuffle(deck)
  return deck
}
