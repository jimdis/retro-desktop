/**
 * Module for scoring.
 *
 * @module src/scoring
 * @author Jim Disenstam
 * @version 1.1
 */

/**
 * Returns a the score of the relevant hand using the game's rules.
 *
 * @param {Array} hand - The relevant hand to be scored.
 * @returns {number} - Thr score of the relevant hand.
 */
function calculateScore (hand) {
  let arr = []
  let score = 0
  // 1: Calculate score excluding Aces:
  hand.forEach(card => arr.push(scoreRank(card.rank)))
  score = arr.reduce((a, b) => a + b)
  // 2: Calculate score including Aces:
  let aces = hand.filter(card => card.rank === 'A')
  if (aces.length === 0) {
    return score
  } else return scoreAces(aces, score)
}

/**
 * Returns the score of a Card given the Card's rank. Excludes Aces.
 *
 * @param {number || string} rank - The value of the rank property of the Card.
 * @returns {number} - The score given the Card's rank.
 */
function scoreRank (rank) {
  if (typeof rank === 'number') {
    return rank
  } else if (rank === 'J') {
    return 11
  } else if (rank === 'Q') {
    return 12
  } else if (rank === 'K') {
    return 13
  } else return 0
}

/**
 * Returns the score of the Aces given the score excluding Aces.
 *
 * @param {Array} aces - An array containing the Aces in a player's hand.
 * @param {number} score - The score of the player's hand excluding Aces.
 * @returns {number} - Returns the score of the Aces.
 */
function scoreAces (aces, score) {
  for (let i = 0; i < aces.length; i++) {
    if (score + 14 + aces.length - i <= 21) {
      score += 14
    } else score += 1
  }
  return score
}

/**
 * Returns a string that logs the hands and scores of each individual player vs dealer match.
 *
 * @param {Object} player - The relevant player.
 * @param {Object} dealer - The relevant dealer.
 * @returns {string} - A string that logs the hands and scores of each individual player vs dealer match.
 */
function toString (player, dealer) {
  let result
  if (player.score > 21) {
    result = `Player is Bust, Dealer Wins!`
  } else if (player.score === 21) {
    result = `Player Wins with 21!`
  } else if (player.hand.length === 5) {
    result = `Player Wins with 5 cards < 21!`
  } else if (player.score > dealer.score) {
    result = `Player Wins with ${player.score} vs dealer's ${dealer.score}.`
  } else if (dealer.score > 21) {
    result = `Dealer is Bust, Player Wins!`
  } else if (dealer.score === 21) {
    result = `Dealer Wins with 21!`
  } else if (dealer.hand.length === 5) {
    result = `Dealer Wins with 5 cards < 21!`
  } else if (dealer.score >= player.score) {
    result = `Dealer Wins with ${dealer.score} vs player's ${player.score}`
  }
  return result
}

export { calculateScore, toString }
