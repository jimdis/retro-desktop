import 'normalize.css'
import './styles/style.scss'

// import './sw'
import Desktop from './js/Desktop'
import './js/pc-games-memory/pc-games-memory'
import './js/twenty-one/twenty-one'

let desktop = new Desktop()
document.body.querySelector('main').appendChild(desktop.container)

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./sw.js').then((reg) => {
//     console.log('Registration succeeded. Scope is ' + reg.scope)
//   }).catch((error) => {
//     console.log('Registration failed with ' + error)
//   })
// }
