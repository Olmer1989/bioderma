/**
 * Кнопка «Скопировать» у промокода в личном кабинете.
 * Берёт текст из соседнего [data-copy-source].
 */

const COPIED_TEXT = 'Скопировано'
const RESET_DELAY = 2000

export function initCopyCode() {
  // Слушаем весь документ: окна с промокодами появляются уже после загрузки
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-copy-button]')
    if (!button) return

    const source = button.parentElement.querySelector('[data-copy-source]')
    if (!source) return

    try {
      // Буфер обмена доступен только по https (и на localhost)
      await navigator.clipboard.writeText(source.textContent.trim())
    } catch {
      // Не дали скопировать — хотя бы выделим код, пусть скопируют руками
      window.getSelection().selectAllChildren(source)
      return
    }

    // На пару секунд меняем надпись на «Скопировано»
    const originalText = button.dataset.originalText || button.textContent
    button.dataset.originalText = originalText
    button.textContent = COPIED_TEXT
    clearTimeout(button.resetTimer)
    button.resetTimer = setTimeout(() => {
      button.textContent = originalText
    }, RESET_DELAY)
  })
}
