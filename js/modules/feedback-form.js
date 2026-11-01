/**
 * Форма обратной связи в блоке «Помощь».
 * Валидацию целиком доверяем браузеру, правила уже прописаны в разметке.
 * Раз пока бэкенда нет, отправку только имитируем: показываем окно «Спасибо» и чистим поля.
 */

import { popup } from '../promo-kit/popup.js'

const SUCCESS_MESSAGE = 'Спасибо! Сообщение отправлено — мы ответим на указанный email.'
const SUCCESS_POPUP_ID = 'feedback-success'
const ERROR_MESSAGE = 'Не удалось отправить сообщение. Попробуйте ещё раз позже.'

// Заглушка вместо сервера. Отдаёт Promise, так что настоящий fetch встанет сюда без переделок:
// return fetch(form.action, { method: 'POST', body: new FormData(form) })
function sendForm(form) {
  const data = Object.fromEntries(new FormData(form))
  console.info('Форма обратной связи (демо, без отправки):', data)

  // Небольшая пауза для правдоподобия
  return new Promise((resolve) => setTimeout(resolve, 600))
}

export function initFeedbackForm() {
  const form = document.querySelector('[data-feedback-form]')
  if (!form) return

  const status = form.querySelector('[data-feedback-status]')
  const submitButton = form.querySelector('[type="submit"]')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    status.textContent = ''

    // Если что-то не так — браузер сам подсветит поле и переведёт на него фокус
    if (!form.reportValidity()) return

    // Гасим кнопку, чтобы особо нетерпеливые не отправили письмо дважды
    submitButton.disabled = true

    try {
      await sendForm(form)
      form.reset()
      // Если окна на странице нет, обходимся строчкой под кнопкой
      if (document.getElementById(SUCCESS_POPUP_ID)) {
        popup.open(SUCCESS_POPUP_ID)
      } else {
        status.textContent = SUCCESS_MESSAGE
      }
    } catch {
      status.textContent = ERROR_MESSAGE
    } finally {
      submitButton.disabled = false
    }
  })
}
