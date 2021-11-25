export interface DayDataSet extends DOMStringMap {
  date: string;
  month: string;
  year: string
  monthName: string
}

interface DayCell extends HTMLTableCellElement {
  dataset: DayDataSet
}

type DayFnMapper = <T extends DayCell>(cell: T) => void

export class CalendarElement extends HTMLElement {
  today = new Date()
  currentMonth = this.today.getMonth()
  currentYear = this.today.getFullYear()

  monthAndYear: HTMLHeadingElement

  buttonPrevious: HTMLButtonElement
  buttonNext: HTMLButtonElement

  selectYear: HTMLSelectElement
  selectMonth: HTMLSelectElement

  calendar: HTMLTableElement
  lang: string

  selectableDays: NodeListOf<DayCell>

  currentDayData: DayDataSet

  dayFnMapper: DayFnMapper

  months: string[] = []
  days: string[] = []

  monthDefault = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]
  dayDefault = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    template.innerHTML = `<link rel="stylesheet" href="styles/button.css" />
    <link rel="stylesheet" href="styles/calendar.css" />
    
    
    <div class="button-container-calendar">
      <button id="previous">&#8249;</button>
      <h3 id="month-and-year"></h3>
      <button id="next">&#8250;</button>
    </div>
  
    <table class="table-calendar" id="calendar" data-lang="pt-br">
      <thead id="thead-month"></thead>
      <tbody id="calendar-body"></tbody>
    </table>
  
    <div class="footer-container-calendar">
      <label for="month">Ir para: </label>
      <select id="month"></select>
      <select id="year"></select>
    </div>`
    
    shadow.appendChild(template.content.cloneNode(true))

    this.monthAndYear = this.shadowRoot.querySelector('#month-and-year')

    this.buttonPrevious = this.shadowRoot.querySelector('#previous')
    this.buttonNext = this.shadowRoot.querySelector('#next')

    this.selectYear = this.shadowRoot.querySelector('#year')
    this.selectMonth = this.shadowRoot.querySelector('#month')

    this.calendar = this.shadowRoot.querySelector('#calendar')
    this.lang = this.calendar.dataset.lang

    this.monthDefault.forEach((m, i) => {
      this.selectMonth.add(new Option(m, `${i}`))
    })
    this.generateYearRange(1970, 2030)

    this.buttonPrevious.onclick = this.previous()
    this.buttonNext.onclick = this.next()

    this.selectMonth.onchange = this.jump()
    this.selectYear.onchange = this.jump()

    if (this.lang === 'pt-br') {
      this.months = this.monthDefault
      this.days = this.dayDefault
    }

    const thead = this.calendar.createTHead()
    const theadRow = thead.insertRow()

    this.days.forEach((value, index) => {
      const th = theadRow.insertCell()
      th.dataset.days = index.toString()
      th.textContent = value
    })

    this.showCalendar(this.currentMonth, this.currentYear)

    this.dayFnMapper = (day) => {
      const detail = day.dataset
      const event = new CustomEvent('selected', { detail })
      this.dispatchEvent(event)
    }
  }

  previous() {
    return () => {
      this.currentYear =
        this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear
      this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1

      this.showCalendar(this.currentMonth, this.currentYear)
    }
  }

  next() {
    return () => {
      this.currentYear =
        this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear
      this.currentMonth = (this.currentMonth + 1) % 12

      this.showCalendar(this.currentMonth, this.currentYear)
    }
  }

  jump() {
    return () => {
      this.currentYear = +this.selectYear.value
      this.currentMonth = +this.selectMonth.value

      this.showCalendar(this.currentMonth, this.currentYear)
    }
  }

  private attachListeners() {
    const tbody = this.calendar.querySelector('tbody')
    this.selectableDays = tbody.querySelectorAll('td.date-picker')
    this.selectableDays.forEach((day) => {
      day.addEventListener('click', () => this.dayFnMapper(day))
    })
  }

  private detachListeners() {
    if (this.selectableDays) {
      this.selectableDays.forEach(day => {
        day.removeEventListener('click', () => this.dayFnMapper(day))
      })
    }
  }

  private showCalendar(month: number, year: number) {
    const firstDay = new Date(year, month).getDay()

    this.detachListeners()

    const tbody = this.calendar.querySelector('tbody')
    tbody.innerHTML = ''

    this.monthAndYear.textContent = `${this.months[month]} ${year}`
    this.selectYear.value = `${year}`
    this.selectMonth.value = `${month}`

    let date = 1
    for (let calendarRow = 0; calendarRow < 6; calendarRow++) {
      const row = tbody.insertRow()

      for (let calendarCol = 0; calendarCol < 7; calendarCol++) {
        if (calendarRow === 0 && calendarCol < firstDay) {
          row.insertCell()
        } else if (date > this.daysInMonth(month, year)) {
          break
        } else {
          const cell = row.insertCell()

          cell.dataset.date = `${date}`
          cell.dataset.month = `${month + 1}`
          cell.dataset.year = `${year}`
          cell.dataset.monthName = `${this.months[month]}`
          cell.textContent = `${date}`

          cell.classList.add('date-picker')

          if (
            date === this.today.getDate() &&
            year === this.today.getFullYear() &&
            month === this.today.getMonth()
          ) {
            cell.classList.add('date-picker', 'selected')
          }

          date++
        }
      }
    }

    this.attachListeners()
  }

  private daysInMonth(iMonth: number, iYear: number) {
    return 32 - new Date(iYear, iMonth, 32).getDate()
  }

  private generateYearRange(start: number, end: number) {
    for (let year = start; year <= end; year++) {
      this.selectYear.add(new Option(`${year}`, `${year}`))
    }
  }
}

customElements.define('boot-calendar', CalendarElement)
