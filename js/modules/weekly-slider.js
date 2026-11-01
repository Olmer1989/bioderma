/**
 * Слайдер еженедельных призов на узких экранах: карточки листаются пальцем, мышью
 * и стрелками, по кругу — после четвёртой недели снова первая.
 *
 * Круг сделан копиями: перед карточками и после них ставим по набору клонов.
 * Доехали до клона — без анимации прыгаем на такую же настоящую карточку.
 */

const SLIDER_CLASS = 'weekly-cards--slider'
const DRAGGING_CLASS = 'weekly-cards--dragging'
const TRANSITION = 'transform 0.4s ease'
// Какую долю карточки надо протащить, чтобы перелистнуть
const SWIPE_THRESHOLD = 0.15
// Палец сдвинулся меньше — это ещё не свайп, а, может, вертикальная прокрутка
const DRAG_START = 6

export function initWeeklySlider() {
  const root = document.querySelector('[data-weekly-slider]')
  const track = root?.querySelector('[data-weekly-slider-track]')
  if (!track) return

  const slides = [...track.children]
  const count = slides.length
  if (count < 2) return

  // Клоны не нужны ни скринридеру, ни Tab
  const makeClone = (slide) => {
    const clone = slide.cloneNode(true)
    clone.setAttribute('aria-hidden', 'true')
    clone.inert = true
    return clone
  }
  track.prepend(...slides.map(makeClone))
  track.append(...slides.map(makeClone))
  root.classList.add(SLIDER_CLASS)

  // Позиция в ленте с клонами: настоящие карточки — от count до 2 * count - 1
  let index = count
  let step = 0

  // Начинаем с той же недели, что открыта во вкладках (weekly-prizes.js выбрал текущую)
  const activeTab = document.querySelector('.weekly__item--active')
  if (activeTab) index += [...activeTab.parentElement.children].indexOf(activeTab)

  function measure() {
    const first = track.children[0]
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    step = first.getBoundingClientRect().width + gap
  }

  function render(offset = 0, animate = false) {
    track.style.transition = animate ? TRANSITION : 'none'
    track.style.transform = `translateX(${-index * step + offset}px)`
  }

  // Уехали на клон — подменяем его настоящей карточкой, глазом это не видно
  function jumpFromClone() {
    if (index < count) index += count
    else if (index >= 2 * count) index -= count
    render()
  }

  function goTo(newIndex) {
    index = newIndex
    render(0, true)
  }

  track.addEventListener('transitionend', jumpFromClone)

  // Перетаскивание: и палец, и мышь
  let startX = 0
  let startY = 0
  let offset = 0
  let pointerId = null
  let isDragging = false

  track.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return
    // Лента могла застрять посреди анимации — ставим её ровно
    jumpFromClone()
    pointerId = event.pointerId
    startX = event.clientX
    startY = event.clientY
    offset = 0
    isDragging = false
  })

  track.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return
    const dx = event.clientX - startX
    const dy = event.clientY - startY

    if (!isDragging) {
      // Ведут больше вверх-вниз — отдаём жест странице
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > DRAG_START) {
        pointerId = null
        return
      }
      if (Math.abs(dx) < DRAG_START) return
      isDragging = true
      track.setPointerCapture(pointerId)
      root.classList.add(DRAGGING_CLASS)
    }

    offset = dx
    render(offset)
  })

  function endDrag(event) {
    if (event.pointerId !== pointerId) return
    pointerId = null
    if (!isDragging) return
    isDragging = false
    root.classList.remove(DRAGGING_CLASS)

    // Протащили на несколько карточек — столько и листаем, но хотя бы одну
    const passed = Math.abs(offset) / step
    const slidesMoved = passed > SWIPE_THRESHOLD ? Math.max(1, Math.round(passed)) : 0
    goTo(index - Math.sign(offset) * slidesMoved)
  }

  track.addEventListener('pointerup', endDrag)
  track.addEventListener('pointercancel', endDrag)
  // Firefox иначе начинает тащить картинку
  track.addEventListener('dragstart', (event) => event.preventDefault())

  // Стрелки на клавиатуре: Tab попадает на карточку, дальше — влево-вправо
  root.addEventListener('keydown', (event) => {
    const moves = { ArrowLeft: -1, ArrowRight: 1 }
    if (!(event.key in moves)) return
    event.preventDefault()
    jumpFromClone()
    goTo(index + moves[event.key])
  })
  root.tabIndex = 0

  // Повернули телефон — ширина карточки и шаг могли измениться
  new ResizeObserver(() => {
    measure()
    render()
  }).observe(root)

  measure()
  render()
}
