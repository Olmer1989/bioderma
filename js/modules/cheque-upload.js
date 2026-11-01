/**
 * Зона загрузки фото чека в личном кабинете (Dropzone, как в проекте President).
 * Файл принимается один: новый вытесняет старый. На сервер пока ничего не уходит —
 * отправку бэкенд повесит на кнопку «Далее» (onChequeLoadFormSubmit в lk.html).
 */

// В President было 3 МБ, но для PDF-чеков берём с запасом
const MAX_FILE_SIZE_MB = 10

export function initChequeUpload() {
  const form = document.querySelector('[data-cheque-dropzone]')
  if (!form || !window.Dropzone) return

  const { Dropzone } = window

  // Без этого Dropzone сам оживит все формы .dropzone со своими настройками
  Dropzone.autoDiscover = false

  const dropzone = new Dropzone(form, {
    url: '#', // TODO (бэкенд): адрес приёма файла
    autoProcessQueue: false,
    uploadMultiple: false,
    maxFiles: 1,
    maxFilesize: MAX_FILE_SIZE_MB,
    thumbnailWidth: 315,
    thumbnailHeight: 200,
    addRemoveLinks: true,
    // Фото или электронный чек в PDF.
    // TODO: уточнить у Заказчика, принимают ли PDF
    acceptedFiles: 'image/*,application/pdf',
    dictDefaultMessage: 'Перетащите фото чека или нажмите для выбора',
    dictRemoveFile: 'Удалить',
    dictInvalidFileType: 'Подойдёт фото (JPG, PNG) или PDF',
    dictFileTooBig: `Файл больше ${MAX_FILE_SIZE_MB} МБ`,
    dictMaxFilesExceeded: 'Можно загрузить только один файл',
  })

  // Второй файл вытесняет первый
  dropzone.on('maxfilesexceeded', function (file) {
    this.removeAllFiles()
    this.addFile(file)
  })

  // Как в макете: пока файла нет, кнопка «Далее», с файлом — «Загрузить чек»
  const submitText = document.querySelector('[data-cheque-submit] .button__text')
  const updateSubmitText = () => {
    if (submitText) submitText.textContent = dropzone.files.length ? 'Загрузить чек' : 'Далее'
  }

  dropzone.on('addedfile', () => {
    const hint = document.querySelector('[data-cheque-hint]')
    if (hint) hint.textContent = ''
    updateSubmitText()
  })
  dropzone.on('removedfile', updateSubmitText)

  // Нужен встроенному обработчику кнопки «Далее»
  window.chequeDropzone = dropzone
}
