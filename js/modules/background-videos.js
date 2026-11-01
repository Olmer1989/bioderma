/**
 * Карточки с видео стартуют, только когда показались на экране, и засыпают, когда ушли из виду, —
 * нефиг гонять анимацию впустую. При «Уменьшить движение» в системе всё замирает на постерах.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

// Браузер может отказать в автозапуске , тогда тупо оставляем постер
function playVideo(video) {
  video.play().catch(() => {})
}

function observeLazyVideos(videos) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting && !reducedMotion.matches) {
          playVideo(target)
        } else {
          target.pause()
        }
      })
    },
    // Подгружаем с небольшим запасом, до того как карточка въедет в экран
    { rootMargin: '200px 0px' },
  )

  videos.forEach((video) => observer.observe(video))
}

// Уважим системную настройку «Уменьшить движение»: всё на паузу, а при её отключении
// снова запускаем автоплэй. Ленивую загрузку подхватит observer при прокрутке
function applyMotionPreference(videos) {
  videos.forEach((video) => {
    if (reducedMotion.matches) {
      video.pause()
    } else if (video.autoplay) {
      playVideo(video)
    }
  })
}

export function initBackgroundVideos() {
  const allVideos = [...document.querySelectorAll('video')]
  if (allVideos.length === 0) return

  observeLazyVideos(allVideos.filter((video) => 'lazyVideo' in video.dataset))

  applyMotionPreference(allVideos)
  // Настройку могут переключить на лету, без перезагрузки
  reducedMotion.addEventListener('change', () => applyMotionPreference(allVideos))
}
