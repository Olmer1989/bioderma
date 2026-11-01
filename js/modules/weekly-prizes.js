/**
 * Переключатель «Еженедельные бьюти-гаджеты»: неделя справа, её фото слева.
 * Работает и мышью, и стрелками. При загрузке открыта текущая неделя акции.
 */

const ACTIVE_ITEM = 'weekly__item--active'
const ACTIVE_PANEL = 'weekly__panel--active'

// Собираем дату по местному времени — new Date('2026-11-09') посчитал бы её в UTC
// и сдвинул границу суток на три часа
function parseLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Какую неделю показать сегодня (today вынесен в параметр — так проще проверять на любой дате)
function findCurrentWeekIndex(tabs, today) {
  const index = tabs.findIndex((tab) => {
    const start = parseLocalDate(tab.dataset.start)
    const end = parseLocalDate(tab.dataset.end)
    // Последний день недели тоже засчитываем
    end.setDate(end.getDate() + 1)
    return today >= start && today < end
  })

  if (index !== -1) return index

  // Мимо всех недель: акция ещё впереди или уже позади
  const firstStart = parseLocalDate(tabs[0].dataset.start)
  return today < firstStart ? 0 : tabs.length - 1
}

export function initWeeklyPrizes() {
  const root = document.querySelector('[data-weekly]')
  if (!root) return

  const tabs = [...root.querySelectorAll('[role="tab"]')]
  if (tabs.length === 0) return

  function selectTab(index, moveFocus = false) {
    tabs.forEach((tab, i) => {
      const isActive = i === index
      const panel = document.getElementById(tab.getAttribute('aria-controls'))

      tab.classList.toggle(ACTIVE_ITEM, isActive)
      tab.setAttribute('aria-selected', String(isActive))
      // Tab попадает только в выбранную неделю, по остальным ходим стрелками
      tab.tabIndex = isActive ? 0 : -1
      panel?.classList.toggle(ACTIVE_PANEL, isActive)
    })

    if (moveFocus) tabs[index].focus()
  }

  // Ловим клик на всём списке, closest выручает, если попали по тексту внутри кнопки
  root.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]')
    if (tab) selectTab(tabs.indexOf(tab))
  })

  root.addEventListener('keydown', (event) => {
    const current = tabs.indexOf(document.activeElement)
    if (current === -1) return

    const last = tabs.length - 1
    // Остаток от деления закольцовывает список: после последней недели — снова первая
    const targets = {
      ArrowDown: (current + 1) % tabs.length,
      ArrowRight: (current + 1) % tabs.length,
      ArrowUp: (current - 1 + tabs.length) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: last,
    }

    if (!(event.key in targets)) return
    // Иначе стрелки заодно прокручивали бы страницу
    event.preventDefault()
    selectTab(targets[event.key], true)
  })

  selectTab(findCurrentWeekIndex(tabs, new Date()))
}
