import Menu from './Menu.js'

const template = document.createElement('template')
template.innerHTML = /* html */`
<div class="window">
  <div class="navbar">
    <a href="#" class="navbar-icon menu-heading"><img class="navbar-icon menu-heading"></a>
    <ul class="navbar-menu">
    <li data-action="restoreWindow"><a href="#" class="menu-item" data-action="restoreWindow">Restore Window</a></li>  
    <li data-action="closeWindow"><a href="#" class="menu-item" data-action="closeWindow">Close Window</a></li>
      </ul>
    <div class="navbar-buttons">
      <a href="#" class="navbar-button minimize"><img class="navbar-button minimize" src="image/button-min.png"></a>
      <a href="#" class="navbar-button maximize"><img class="navbar-button maximize" src="image/button-max.png"></a>
    </div>
  </div>
  <div class ="menu">
    
  </div>
  <div class="content">
  </div>
</div>
`
/**
 * A Window module.
 *
 * @export Window
 * @class Window
 */
export default class Window {
  /**
   * Creates an instance of Window.
   * @param {string} content A HTML element inserted into the window content.
   * @param {string} icon URL to icon image to display in window title bar.
   * @param {number} x Offset position for window from left.
   * @param {number} y Offset position for window from top.
   * @memberof Window
   */
  constructor (content, icon, x, y) {
    this.container = template.content.cloneNode(true).querySelector('div.window')
    this.container.style.transform = `translate3d(${x}px, ${y}px, 0px)`
    this.content = this.container.querySelector('div.content')
    this.container.querySelector('div.navbar img').src = icon
    this.content.appendChild(document.createElement(content))
    let title = document.createTextNode(this.container.querySelector(content).name)
    this.container.querySelector('.navbar').appendChild(title)
    this.settings = this.container.querySelector(content).settings
    this.menu = new Menu(this.settings || {})
    this.container.querySelector('div.menu').appendChild(this.menu.container)
    let boundClick = this._click.bind(this)
    this.container.addEventListener('click', boundClick)
    // Resizes window depending on state
    this.container.querySelector('div.navbar').addEventListener('dblclick', (e) => {
      this.content.style.height ? this.restoreWindow() : this.maximize()
    })
  }
  /**
 * Handles navbar menu, buttons and file menu clicks.
 *
 * @param {any} e
 * @memberof Window
 */
  _click (e) {
    if (e.target !== this.content.firstElementChild) e.preventDefault()
    if (e.target.classList.contains('navbar-icon')) {
      this.container.querySelector('.navbar-menu').classList.toggle('display-menu')
    } else if (e.target.getAttribute('data-action')) {
      let action = e.target.getAttribute('data-action')
      this.container.querySelector('.navbar-menu').classList.toggle('display-menu')
      this[action]()
    } else if (e.target.classList.contains('maximize')) {
      this.maximize()
    } else if (e.target.classList.contains('minimize')) {
      this.minimize()
    }
  }
  /**
 * Dispatches 'closewindow' event.
 *
 * @memberof Window
 */
  closeWindow () {
    this.container.dispatchEvent(new window.Event('close'))
  }
  /**
 * Restores window size to original.
 *
 * @memberof Window
 */
  restoreWindow () {
    this.container.style.transform = `translate3d(${10}px, ${10}px, 0px)`
    this.container.style.width = null
    this.content.style.width = null
    this.content.style.height = null
  }
  /**
 * Maximizes window size.
 *
 * @memberof Window
 */
  maximize () {
    this.container.style.transform = `translate3d(${5}px, ${5}px, 0px)`
    let w = window.innerWidth
    let h = window.innerHeight
    this.container.style.width = null
    this.content.style.width = w - 10 + 'px'
    this.content.style.height = h - 80 + 'px'
  }
  /**
 * Minimizes window size.
 *
 * @memberof Window
 */
  minimize () {
    let w = window.innerWidth
    let h = window.innerHeight
    let x = Math.floor(Math.random() * (w - 100))
    this.container.style.transform = `translate3d(${x}px, ${h - 60}px, 0px)`
    this.container.style.width = '200px'
    this.content.style.height = '0px'
  }
}
