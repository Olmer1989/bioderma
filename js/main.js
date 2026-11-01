/**
 * Точка входа: подключаем модули и запускаем их.
 * js/modules — наше, js/promo-kit — окна, формы и вкладки из проекта President.
 */

import { initBurger } from './modules/burger.js'
import { initWeeklyPrizes } from './modules/weekly-prizes.js'
import { initWeeklySlider } from './modules/weekly-slider.js'
import { initBackgroundVideos } from './modules/background-videos.js'
import { initFeedbackForm } from './modules/feedback-form.js'
import { initChequeUpload } from './modules/cheque-upload.js'
import { initCopyCode } from './modules/copy-code.js'
import { initWinners } from './modules/winners.js'

// forms.js навешивает свои обработчики сам при подключении, поэтому импорт без имён
import { popup } from './promo-kit/popup.js'
import { initTabs } from './promo-kit/tabs.js'
import './promo-kit/forms.js'

// window.popup дёргают встроенные обработчики в HTML — так заведено в шаблоне,
// и так же к окнам будет обращаться бэкенд. Страницы без окон пропускаем
if (document.querySelector('[data-backdrop]')) {
  popup.init()
  window.popup = popup
}
initTabs()

initBurger()
initWeeklyPrizes()
// После вкладок: слайдер начинает с той недели, которую они выбрали
initWeeklySlider()
initBackgroundVideos()
initFeedbackForm()
initChequeUpload()
initCopyCode()
initWinners()
