/**
 * Мобильное меню: бургер в шапке открывает [data-burger-menu] на весь экран.
 * Пока меню открыто, остальная страница inert и не листается.
 */

// Ширина, с которой меню снова стоит в шапке, — как media(laptop) в стилях
const DESKTOP_QUERY = '(width >= 1280px)'

export function initBurger() {
  const header = document.querySelector('[data-header]')
  const button = header?.querySelector('[data-burger]')
  const menu = header?.querySelector('[data-burger-menu]')
  if (!button || !menu) return

  const desktop = window.matchMedia(DESKTOP_QUERY)

  function setOpen(isOpen) {
    header.classList.toggle('header--menu-open', isOpen)
    document.documentElement.classList.toggle('is-menu-open', isOpen)
    button.setAttribute('aria-expanded', String(isOpen))
    button.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню')

    // Всё, кроме шапки, выключаем — Tab ходит только по меню
    document.querySelectorAll('body > *:not([data-header]):not(script)').forEach((el) => {
      el.inert = isOpen
    })
  }

  const isOpen = () => header.classList.contains('header--menu-open')

  button.addEventListener('click', () => setOpen(!isOpen()))

  // По ссылке или «Личному кабинету» меню закрываем, дальше всё как обычно
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) setOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return
    setOpen(false)
    button.focus()
  })

  // Повернули планшет или растянули окно — на десктопе меню снова в шапке
  desktop.addEventListener('change', () => {
    if (desktop.matches && isOpen()) setOpen(false)
  })
}
