// Сборка стилей: sass/main.sass → css/main.css с автопрефиксами для браузеров из списка "defaults".
// Запуск: npm run build:css (один раз) или npm run watch:css (пересборка при каждом сохранении .sass)

const fs = require('fs')
const path = require('path')
const sass = require('sass')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

const root = path.resolve(__dirname, '..')
const input = path.join(root, 'sass', 'main.sass')
const output = path.join(root, 'css', 'main.css')

async function build() {
  const { css } = sass.compile(input, { style: 'expanded' })
  const result = await postcss([autoprefixer({ overrideBrowserslist: ['defaults'] })]).process(css, {
    from: undefined,
  })
  fs.writeFileSync(output, result.css)
  console.log(`css/main.css собран (${new Date().toLocaleTimeString()})`)
}

function run() {
  build().catch((error) => console.error(error.message))
}

run()

if (process.argv.includes('--watch')) {
  let timer
  fs.watch(path.join(root, 'sass'), { recursive: true }, () => {
    // Редактор сохраняет файл в несколько приёмов — собираем один раз
    clearTimeout(timer)
    timer = setTimeout(run, 100)
  })
  console.log('Слежу за sass/ — Ctrl+C, чтобы остановить')
}
