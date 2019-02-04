const template = document.createElement('template')
template.innerHTML = /* html */`
<ul>
      <li class="menu-heading file-menu"><a class="menu-heading file-menu" href="#" tabindex="-1">File</a>
        <ul class="sub-menu">
        <li class="menu-item" data-action="closeWindow"><a href="#" class="menu-item" data-action="closeWindow" tabindex="-1">Quit</a></li>
        </ul>
      </li>
      <li class="menu-heading settings-menu"><a class="menu-heading settings-menu" href="#" tabindex="-1">Settings</a>
        <ul class="sub-menu">
        </ul>
      </li>
    </ul>`

const menuTemplate = document.createElement('template')
menuTemplate.innerHTML = /* html */`
  <li class="menu-item"><a href="#" class="menu-item" tabindex="-1"></a></li>
  <ul class="sub-menu-items"></ul>
`
/**
 * A Menu module.
 *
 * @export Menu
 * @class Menu
 */
export default class Menu {
  /**
   * Creates an instance of Menu.
   * @param {Object} settings An object containing settings using specific keys:
   * 'name': The name of the setting to be displayed,
   * 'setting': A function to run or object containing additional 'name, setting' pairs,
   * 'run': the function to run for any 'setting' that is not an object.
   * @memberof Menu
   */
  constructor (settings) {
    this.settings = settings
    this.activeMenu = {
      focus: null,
      hasParent: null,
      hasChild: null,
      isSubMenu: null,
      isNotFirst: null,
      isNotLast: null
    }
    this.keyboardMenu = false
    this.container = template.content.cloneNode(true).querySelector('ul')
    this._renderMenu()
    let boundClick = this._click.bind(this)
    this.container.addEventListener('click', boundClick)
  }
  /**
 * Activates menu for mouse navigation and acts on menu items.
 *
 * @param {any} e
 * @memberof Menu
 */
  _click (e) {
  // Activates menu so it is displayed
    if (e.target.classList.contains('menu-heading')) {
      this.container.classList.toggle('menu-active')
      document.activeElement.blur() // Fix webkit bug removing hover
    }
    // Executes the relevant setting when clicked
    if (e.target.classList.contains('menu-item')) {
      if (e.target.getAttribute('data-parent')) {
        let key = e.target.getAttribute('data-parent')
        let setting = e.target.getAttribute('data-setting')
        this.settings[key].run(this.settings[key].setting[setting])
      } else if (e.target.getAttribute('data-setting')) {
        let key = e.target.getAttribute('data-setting')
        this.settings[key].setting()
      }
      this.container.classList.toggle('menu-active')
    }
  }
  /**
 * Closes all open menus.
 *
 * @memberof Menu
 */
  closeAll () {
    this.container.querySelectorAll('ul.focused-menu').forEach(ul => ul.classList.remove('focused-menu'))
  }
  /**
 * Keyboard navigation for the menu.
 *
 * @param {any} e
 * @memberof Menu
 */
  useKeys (e) {
    const menu = this.container
    const open = (ul) => ul.classList.add('focused-menu')
    const close = (ul) => ul.classList.remove('focused-menu')
    const closeAll = this.closeAll.bind(this)
    let focus = this.activeMenu.focus

    // So mouse takes over if moved over menu
    menu.addEventListener('mouseover', () => {
      closeAll()
      document.activeElement.blur()
      this.keyboardMenu = false
    }, { once: true })

    // Keyboard mappings
    if (e.code === 'KeyF') {
      closeAll()
      focus = menu.querySelector('a.file-menu')
      open(focus.nextElementSibling)
    }
    if (e.code === 'KeyS') {
      closeAll()
      focus = menu.querySelector('a.settings-menu')
      open(focus.nextElementSibling)
    }
    if (e.code === 'ArrowDown') {
      if (!this.activeMenu.isSubMenu) {
        focus = this.activeMenu.hasChild.querySelector('a')
      } else {
        focus = this.activeMenu.isNotLast || focus.closest('ul')
        focus = focus.querySelector('a')
      }
    }
    if (e.code === 'ArrowUp') {
      if (this.activeMenu.isSubMenu) {
        focus = this.activeMenu.isNotFirst || focus.closest('ul').lastElementChild
        focus = focus.querySelector('a')
      }
    }
    if (e.code === 'ArrowRight') {
      if (this.activeMenu.hasChild && this.activeMenu.isSubMenu) {
        open(this.activeMenu.hasChild)
        focus = this.activeMenu.hasChild.querySelector('a')
      } else if (!this.activeMenu.isSubMenu) {
        close(focus.nextElementSibling)
        focus = this.activeMenu.isNotLast || this.activeMenu.isNotFirst
        focus = focus.querySelector('a')
        open(focus.nextElementSibling)
      } else {
        let parent = focus.closest('li.menu-heading')
        closeAll()
        // this.activeMenu.hasParent.classList.remove('focused-menu')
        focus = parent.nextElementSibling || parent.closest('ul')
        open(focus.querySelector('ul'))
        focus = focus.querySelector('a')
      }
    }
    if (e.code === 'ArrowLeft') {
      if (this.activeMenu.hasParent && this.activeMenu.isSubMenu) {
        close(this.activeMenu.hasParent)
        focus = this.activeMenu.hasParent.parentElement.querySelector('a')
      } else if (!this.activeMenu.isSubMenu) {
        closeAll()
        focus = this.activeMenu.isNotFirst || this.activeMenu.isNotLast
        open(focus.querySelector('ul'))
        focus = focus.querySelector('a')
      } else {
        let parent = focus.closest('li.menu-heading')
        closeAll()
        focus = parent.previousElementSibling || parent.closest('ul').lastElementChild
        open(focus.querySelector('ul'))
        focus = focus.querySelector('a')
      }
    }
    if (e.code === 'Enter') {
      if (this.activeMenu.hasChild && this.activeMenu.isSubMenu) {
        open(this.activeMenu.hasChild)
        focus = this.activeMenu.hasChild.querySelector('a')
      } else {
        menu.classList.remove('menu-active')
        closeAll()
        this.keyboardMenu = false
      }
    }
    if (e.code === 'Escape') {
      menu.classList.remove('menu-active')
      closeAll()
      this.keyboardMenu = false
    }
    // The menu up for next keyboard input
    focus.focus()
    this.activeMenu.focus = focus
    this.activeMenu.hasChild = focus.nextElementSibling
    this.activeMenu.hasParent = focus.closest('ul.sub-menu-items')
    this.activeMenu.isSubMenu = focus.classList.contains('menu-item')
    this.activeMenu.isNotFirst = focus.parentElement.previousElementSibling
    this.activeMenu.isNotLast = focus.parentElement.nextElementSibling
  }
  /**
 * Creates elements with relevant attributes given settings and inserts them into DOM.
 *
 * @memberof Menu
 */
  _renderMenu () {
    Object.keys(this.settings).forEach(key => {
      let menu = menuTemplate.content.querySelector('li.menu-item').cloneNode(true)
      menu.querySelector('a').textContent = this.settings[key].name
      // Checks if menu item contains sub-items and populates accordingly
      if (typeof this.settings[key].setting !== 'object') {
        menu.setAttribute('data-setting', key)
        menu.querySelector('a').setAttribute('data-setting', key)
      } else {
        let ul = menuTemplate.content.querySelector('ul').cloneNode(true)
        let settings = this.settings[key].setting
        menu.classList.add('menu-arrow')
        Object.keys(settings).forEach(setting => {
          let li = menuTemplate.content.querySelector('li.menu-item').cloneNode(true)
          li.querySelector('a').textContent = settings[setting].name
          li.setAttribute('data-parent', key)
          li.setAttribute('data-setting', setting)
          li.querySelector('a').setAttribute('data-parent', key)
          li.querySelector('a').setAttribute('data-setting', setting)
          ul.appendChild(li)
          menu.appendChild(ul)
        })
      }
      this.container.querySelector('.settings-menu ul').appendChild(menu)
    })
  }
}
