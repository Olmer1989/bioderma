/**
 * Блок «Победители».
 * Пока розыгрышей не было, висит заглушка из макета. Когда бэкенд выставит
 * data-published="true", появляются таблица и поиск по номеру телефона.
 */

// Оставляем одни цифры и срезаем код страны: «+7 916…», «8 916…» и «916…» — один и тот же номер
function phoneDigits(text) {
  const digits = text.replace(/\D/g, '')
  return /^[78]/.test(digits) ? digits.slice(1) : digits
}

export function initWinners() {
  const root = document.querySelector('[data-winners]')
  if (!root) return

  const empty = root.querySelector('[data-winners-empty]')
  const results = root.querySelector('[data-winners-results]')
  const filterForm = root.querySelector('[data-winners-filter]')
  const isPublished = root.dataset.published === 'true'

  empty.hidden = isPublished
  results.hidden = !isPublished
  filterForm.hidden = !isPublished
  if (!isPublished) return

  const search = root.querySelector('[data-winners-search]')
  const nothing = root.querySelector('[data-winners-nothing]')
  const count = root.querySelector('[data-winners-count]')
  const rows = [...root.querySelectorAll('[data-winner-row]')].map((row) => ({
    row,
    phone: phoneDigits(row.dataset.phone),
  }))

  function applyFilter() {
    const query = phoneDigits(search.value)

    let visible = 0
    rows.forEach(({ row, phone }) => {
      // В таблице номер открыт не целиком: подходит и начало номера, и полный номер,
      // который начинается с открытых цифр
      const isVisible = query === '' || phone.startsWith(query) || query.startsWith(phone)

      row.hidden = !isVisible
      if (isVisible) visible += 1
    })

    nothing.hidden = visible > 0
    count.textContent = `Найдено победителей: ${visible}`
  }

  filterForm.addEventListener('submit', (event) => {
    event.preventDefault()
    applyFilter()
  })

  // Стёрли запрос — сразу показываем всех, без повторного «Найти»
  search.addEventListener('input', () => {
    if (search.value.trim() === '') applyFilter()
  })
}
