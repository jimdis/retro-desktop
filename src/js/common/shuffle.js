/**
 * Takes an array as an argument and returns a shuffled copy of that array.
 * Fisher-Yates shuffling algorithm, adapted from https://www.kirupa.com/html5/shuffling_array_js.htm
 *
 * @export shuffle
 * @param {Array} arr - The array that needs shuffling.
 * @returns {Array} - A shuffled copy of the array passed as an argument.
 */
export default function shuffle (arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1))
    let itemAtIndex = arr[randomIndex]

    arr[randomIndex] = arr[i]
    arr[i] = itemAtIndex
  }
  return arr
}
