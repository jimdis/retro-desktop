import shuffle from './../common/shuffle.js'

/**
 * Populates an array with numbers in duplicates and in shuffled order.
 * Accepts a second argument for randomizing numbers in the array.
 *
 * @export populateArray
 * @param {number} elements Number of elements to duplicate
 * @param {number} maxNumber The maximum number of random numbers to included (i.e 100 -> 1-100).
 * @returns A shuffled array of duplicate numbers.
 */
export default function populateArray (elements, maxNumber = elements) {
  let arr = []
  let number = elements < maxNumber ? maxNumber : elements
  for (let i = 1; i <= number; i++) {
    arr.push(i)
  }
  arr = shuffle(arr).slice(maxNumber - elements)
  arr = shuffle(arr.concat(arr))
  return arr
}
