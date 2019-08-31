// Текст для ввода
const text = `Товарищи! сложившаяся структура организации позволяет выполнять важные задания по разработке направлений прогрессивного развития. Задача организации, в особенности же новая модель организационной деятельности требуют от нас анализа систем массового участия. Значимость этих проблем настолько очевидна, что постоянное информационно-пропагандистское обеспечение нашей деятельности играет важную роль в формировании новых предложений. Товарищи! консультация с широким активом обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же консультация с широким активом требуют определения и уточнения форм развития. Задача организации, в особенности же начало повседневной работы по формированию позиции в значительной степени обуславливает создание форм развития.
Идейные соображения высшего порядка, а также постоянное информационно-пропагандистское обеспечение нашей деятельности влечет за собой процесс внедрения и модернизации соответствующий условий активизации. Значимость этих проблем настолько очевидна, что постоянный количественный рост и сфера нашей активности позволяет выполнять важные задания по разработке новых предложений. С другой стороны дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач.
Задача организации, в особенности же начало повседневной работы по формированию позиции обеспечивает широкому кругу (специалистов) участие в формировании модели развития. Значимость этих проблем настолько очевидна, что укрепление и развитие структуры требуют от нас анализа соответствующий условий активизации. Задача организации, в особенности же укрепление и развитие структуры позволяет оценить значение существенных финансовых и административных условий. Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности представляет собой интересный эксперимент проверки дальнейших направлений развития.`

// Поле для ввода текста
const inputElement = document.querySelector('#input')
// Какой текст нужно вводить
const textExampleElement = document.querySelector('#textExample')
// Строки, которые будем выводить для набора - режутся из исходного текста
const lines = getLines(text)

// в этой переменной будет храниться актуальный символ, т.е. который мы ожидаем, что пользователь нажмет
let letterId = 1 //ожидаем 1-ый символ

let startMoment = null //количество миллисекунд с момента старта печатания
let started = false //флаг - начали печатать или нет

let letterCounter = 0 //сколько всего было нажатий на клавиши
let letterCounter_error = 0 //сколько всего было неправильных нажатий на клавиши

init()

function init () {
	update()

	inputElement.focus()

	inputElement.addEventListener('keydown', function(event) {
		const currentLineNumber = getCurrentLineNumber()
		//найти элемент, у которого значение атрибута data-key равно значению атрибута key события event
		const element = document.querySelector('[data-key="' + event.key.toLowerCase() + '"]')
		const currentLetter = getCurrentLetter()

		// нажатие shift не считать за ввод символа и не увеличивать счетчик
		if ( event.key !== 'Shift' ) {
			letterCounter = letterCounter + 1 //считаем сколько символов введено
		}

		if ( !started ) {
			started = true
			startMoment = Date.now() //фиксируем время начала набора текста
		}
		
		// Если нажата функциональная клавиша, событие обрабатывать не будем
		if ( event.key.startsWith('F') && event.key.length > 1 ) {
			return
		}

		if ( element ) {
			element.classList.add('hint') //подсвечиваем клавишу, соответствующую нажатой на клавиатуре
		}

		const isKey = event.key === currentLetter.original
		const isEnter = event.key === 'Enter' && currentLetter.original === '\n'

		if ( isKey || isEnter ) {
			letterId = letterId + 1
			update()
		} else { //если ошиблись при вводе символа
			event.preventDefault() //если вводят неправильный символ - не отображать его в поле ввода

			// при нажатии shift не считать его за ошибочный символ
			if ( event.key !== 'Shift' ) {
				letterCounter_error = letterCounter_error + 1

				// подсветить все буквы, в которых ошибся
				for ( const line of lines ) {
					for ( const letter of line ) {
						if ( letter.original === currentLetter.original ) {
							letter.success = false
						}
					}
				}

				update()
			}
		}

		// Если перешли ко вводу следующей строки, очистить input
		if ( currentLineNumber !== getCurrentLineNumber() ) {
			inputElement.value = ''
			event.preventDefault()

			started = false
			const time = Date.now() - startMoment
			// вывод сколько символов в минуту напечатано
			document.querySelector('#wordsSpeed').textContent = Math.round(60000 * letterCounter / time)
			//вывод процента ошибок символов
			document.querySelector('#errorProcent').textContent = Math.floor(10000 * letterCounter_error / letterCounter) / 100 + '%'

			letterCounter = 0
			letterCounter_error = 0
		}
	})

	inputElement.addEventListener('keyup', function (event) {
		console.log(event)
		const element = document.querySelector('[data-key="' + event.key.toLowerCase() + '"]')

		if ( element ) {
			element.classList.remove('hint') //убираем подсветку с клавиши при отпускании клавиши на клавиатуре
		}
	})
}

// Принимает длинную строку, возвращает массив строк со служебной информацией
function getLines(text) {
	const lines = []

	let line = []
	let idCounter = 0

	for (const originalLetter of text) { //для каждого символа текста выполнить определенную логику
		idCounter = idCounter + 1

		let letter = originalLetter

		// вместо пробелов отобразим в тексте символы градуса
		if ( letter === ' ' ) {
			letter = '°'
		}

		// переносы строки отобразим в тексте символами конца абзаца
		if ( letter === '\n' ) {
			letter = '¶\n'
		}

		line.push({
			id: idCounter, //номер символа, который хотим отобразить
			label: letter, //символ, который будет отображаться в тексте для ввода
			original: originalLetter, //символ в исходном тексте
			success: true //совершена или нет ошибка в этом символе. true - без ошибок
		})

		//Если длина строки больше 70 символов или встретился символ перевода на новую строку
		if ( line.length >= 70 || letter === '¶\n' ) {
			lines.push(line)
			line = []
		}
	}

	if ( line.length > 0 ) {
		lines.push(line)
	}

	return lines
}

// Принимает строку с объектами со служебной информацией и возвращает html-структуру
//составить HTML-версию линии текста, которую затем вставим в index.html
function lineToHtml(line) {
	// <div class="line">
	// 	<span class="done"> На переднем плане, прямо перед</span> 
	// 	<span class="hint">н</span>ами, расположен был дворик, где стоял
	// </div>

	const divElement = document.createElement('div') //в divElement теперь будет храниться тег div. Элемент создан, но на страницу ещё не добавлен - виртуальный элемент
	divElement.classList.add('line')

	for ( const letter of line ) { //перебираем все элементы массива
		//создаем новый элемент span и сохраняем его внутрь элемента DOM - spanElement
		const spanElement = document.createElement('span')
		spanElement.textContent = letter.label //вкладываем содержимое тега в тег span

		divElement.append(spanElement) //добавляем в самый конец div-элемента элемент span

		if ( letterId > letter.id ) {
			spanElement.classList.add('done') //добавляем span-элементу класс done, если символ успешно введен
		} else if ( !letter.success ) { //если ошибся символом, помечаем те символы, в котором ошибся
			spanElement.classList.add('hint')
		}

	}
	// console.log(divElement)
	return divElement 
}

// Возвращает актуальный номер строки, т.е. номер строки, над которой сейчас работает пользователь
function getCurrentLineNumber() { //возвратит номер актуальной строки
	for ( let i = 0; i < lines.length; i++ ) {
		for ( const letter of lines[i] ) {
			if ( letter.id === letterId) {
				return i
			}
		}
	}
}

// Функция обновления 3-х отображаемых актуальных строк #textExample
function update() { //удалит содержимое тега с текстом для ввода и вставит строки заново
	const currentLineNumber = getCurrentLineNumber() //здесь будет номер той строки, которую хотим отобразить
	textExampleElement.innerHTML = ''

	// for ( const line of lines ) {
	// 	const html = lineToHtml(line) //вызовем функцию lineToHtml для каждой линии
	// 	textExampleElement.append(html)
	// }

	for (let i = 0; i < lines.length; i++) {
		const html = lineToHtml(lines[i]) //вызовем функцию lineToHtml для каждой линии
		textExampleElement.append(html)

		if ( i < currentLineNumber || i > currentLineNumber + 2 ) {
			html.classList.add('hidden')
		}
	}
}

// Возвращает объект символа ожидаемый программой
function getCurrentLetter() {
	for ( const line of lines ) {
		for ( const letter of line ) {
			if ( letterId === letter.id ) {
				return letter
			}
		}
	}
}