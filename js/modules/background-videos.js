/**
 * Карточки с видео стартуют, только когда показались на экране, и засыпают, когда ушли из виду, —
 * нефиг гонять анимацию впустую.
 */

// Браузер может отказать в автозапуске , тогда тупо оставляем постер
function playVideo(video) {
  video.play().catch(() => {})
}

function observeLazyVideos(videos) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
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

export function initBackgroundVideos() {
  const allVideos = [...document.querySelectorAll('video')]
  if (allVideos.length === 0) return

  observeLazyVideos(allVideos.filter((video) => 'lazyVideo' in video.dataset))

  allVideos.filter((video) => video.autoplay && !('lazyVideo' in video.dataset)).forEach(playVideo)
}
