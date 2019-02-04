const template = document.createElement('template')

template.innerHTML =/* html */`
<div class="icon">
<a href="#" class="icon"><img class="icon"><span></span></a>
</div>
`
/**
 * An Icon module.
 *
 * @export Icon
 * @class Icon
 */
export default class Icon {
  /**
   * Creates an instance of Icon.
   * @param {string} img URL to the icon image.
   * @param {string} element The HTML element that the icon will place inside the Window it opens.
   * @param {string} text The text to display below icon image.
   * @param {number} x Offset position for the icon from left.
   * @param {number} y Offset position for the icon from top.
   * @memberof Icon
   */
  constructor (img, element, text, x, y) {
    this.container = template.content.cloneNode(true).querySelector('div')
    this.container.style.transform = `translate3d(${x}px, ${y}px, 0px)`
    let title = document.createTextNode(text)
    this.container.querySelector('img').src = img
    this.container.querySelector('span').appendChild(title)
    // Sends custom event containing details on app to open
    this.container.addEventListener('dblclick', (e) => {
      let event = new window.CustomEvent('openapp', {
        detail: {
          content: element,
          icon: img
        }
      })
      window.dispatchEvent(event)
    })
    // Prevents links from activating
    this.container.addEventListener('click', (e) => e.preventDefault())
  }
}
