import Window from './Window.js'
import Icon from './Icon.js'

const template = document.createElement('template')

template.innerHTML =/* html */`
<div class="desktop">
<div id="icons">

</div>
</div>
`
/**
 * A Desktop module.
 *
 * @export Desktop
 * @class Desktop
 */
export default class Desktop {
  /**
   * Creates an instance of Desktop.
   * @memberof Desktop
   */
  constructor () {
    this.container = template.content.cloneNode(true).querySelector('div.desktop')
    // Lists applications on the desktop for populating icons
    this.applications = [
      {
        name: 'PC Games Memory',
        element: 'pc-games-memory',
        image: 'image/memory-icon.png'
      },
      {
        name: 'Twenty One',
        element: 'twenty-one',
        image: 'image/twenty-one-icon.png'
      }
    ]
    this.activeWindow = null
    this.activeIcon = null
    this.moveElement = null
    this.mousePosition = 0
    this.newWindowPosition = { x: 10, y: 10 }
    this.createIcons(this.applications)
    let boundKeyDown = this._keyDown.bind(this)
    window.addEventListener('keydown', boundKeyDown)
    window.addEventListener('mousedown', (e) => this._blurWindow())
    window.addEventListener('openapp', (e) => {
      this.createWindow(e.detail.content, e.detail.icon, this.newWindowPosition.x, this.newWindowPosition.y)
    })
  }
  /**
 * Creates Icon instances and inserts contents into DOM.
 *
 * @param {Object} apps Object containing properties:
 * 'name': The name to display below icon image,
 * 'element': The HTML element that the icon will place inside the Window it opens,
 * 'image': URL to the icon image.
 * @memberof Desktop
 */
  createIcons (apps) {
    let offsetX = 20
    let offsetY = 120
    apps.forEach(app => {
      let icon = new Icon(app.image, app.element, app.name, offsetX, offsetY)
      offsetX += 100
      this.container.querySelector('#icons').appendChild(icon.container)
      // Activates icon for movement
      icon.container.addEventListener('mousedown', (e) => {
        if (this.activeWindow) this.activeWindow.container.classList.remove('active')
        if (this.activeIcon) this.activeIcon.container.classList.remove('active')
        this.activeIcon = icon
        icon.container.classList.add('active')
        this.moveElement = icon
        this._moveElement(e)
        e.stopPropagation()
      })
    })
  }
  /**
 * Creates a new Window instance and inserts it into the DOM.
 *
 * @param {string} content A HTML element inserted into the window content.
 * @param {string} icon URL to icon image to display in window title bar.
 * @param {number} x Offset position for window from left.
 * @param {number} y Offset position for window from top.
 * @memberof Desktop
 */
  createWindow (content, icon, x, y) {
    let newWindow = new Window(content, icon, x, y)
    this.container.appendChild(newWindow.container)
    this.activeWindow = newWindow
    this.activeWindow.container.classList.add('active')
    // Listens to 'close' event and removes window from DOM
    newWindow.container.addEventListener('close', (e) => {
      this.container.removeChild(e.target)
      this.keyboardMenu = false
      this.newWindowPosition.x = 10
      this.newWindowPosition.y = 10
    }, { once: true })
    // Deactivates currently active window and activates clicked window
    newWindow.container.addEventListener('mousedown', (e) => {
      if (this.activeWindow !== newWindow) this._blurWindow()
      this.activeWindow = newWindow
      this.moveElement = newWindow
      this.activeWindow.container.classList.add('active')
      if (e.target.classList.contains('navbar')) this._moveElement(e)
      e.stopPropagation()
    })
    // Increments offset so new windows are stacked
    if (this.newWindowPosition.y > window.innerHeight - 200) {
      this.newWindowPosition.x -= 50
      this.newWindowPosition.y = 10
    } else {
      this.newWindowPosition.x += 10
      this.newWindowPosition.y += 10
    }
  }
  /**
 * Acts on keydown event listener: Activates keyboard menu of active window.
 *
 * @param {any} e
 * @memberof Desktop
 */
  _keyDown (e) {
    if (this.activeWindow) {
      if (e.altKey) {
        if (e.code === 'KeyF' || e.code === 'KeyS') {
          this.activeWindow.menu.keyboardMenu = true
          this.activeWindow.container.querySelector('div.menu ul').classList.add('menu-active')
        }
        if (e.code === 'KeyQ') {
          this.container.removeChild(this.activeWindow.container)
          this.keyboardMenu = false
        }
      }
      if (this.activeWindow.menu.keyboardMenu) this.activeWindow.menu.useKeys(e)
    }
  }
  /**
 * Deactivates currently active window, including any open menus and keyboard navigation.
 *
 * @memberof Desktop
 */
  _blurWindow () {
    if (this.activeWindow) {
      this.activeWindow.container.classList.remove('active')
      this.activeWindow.container.querySelector('div.menu ul').classList.remove('menu-active')
      this.activeWindow.container.querySelector('.navbar-menu').classList.remove('display-menu')
      this.activeWindow.menu.closeAll()
      this.activeWindow.menu.keyboardMenu = false
      this.activeWindow = null
    }
  }
  /**
 * Sets up the selected element to be moved with mouse.
 *
 * @param {any} e
 * @memberof Desktop
 */
  _moveElement (e) {
    e.preventDefault()
    // Sets initial mouse position in relation to element at mousedown
    this.mousePosition = {
      x: e.offsetX,
      y: e.offsetY
    }
    // Sets initial position of element at mousedown
    this.startMove = {
      x: e.clientX - this.mousePosition.x,
      y: e.clientY - this.mousePosition.y
    }
    let boundMouseMove = this._mouseMove.bind(this)
    // Adds event listener for mousemove and removes it once mouseup
    window.addEventListener('mousemove', boundMouseMove)
    window.addEventListener('mouseup', (e) => {
      window.removeEventListener('mousemove', boundMouseMove)
      // If element is moved out of view, it is bounced back
      let moveBack = (e.clientY <= 0) || (e.clientY > window.innerHeight)
      if (moveBack) {
        this.moveElement.container.style.transform =
          `translate3d(${this.startMove.x}px, ${this.startMove.y}px, 0px)`
      }
      // If window is moved, new windows are opened in top left corner
      if (this.moveElement === this.activeWindow) {
        this.newWindowPosition.x = 10
        this.newWindowPosition.y = 10
      }
    }, { once: true })
  }
  /**
 * Moves the selected element around the window with the mouse.
 * Uses translate3d to involve GPU and optimize rendering.
 *
 * @param {any} e
 * @memberof Desktop
 */
  _mouseMove (e) {
    let x = e.clientX - this.mousePosition.x
    let y = e.clientY - this.mousePosition.y
    this.moveElement.container.style.transform = `translate3d(${x}px, ${y}px, 0px)`
  }
}
