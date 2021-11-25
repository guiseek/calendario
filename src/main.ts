import { DayDataSet, CalendarElement } from './elements/calendar'
import { handleFormButton } from './utilities/handle-form-button'
import { formatFromCalendar } from './utilities'
import { setTasks } from './utilities/set-tasks'
import { getTasks } from './utilities/get-tasks'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form')

  /**
   * Form
   */
  if (form) {
    handleFormButton(form)

    form.onsubmit = (ev) => {
      ev.preventDefault()

      // Salva tarefa cadastrada
      setTasks(new FormData(form))
    }
  }

  /**
   * Calendar
   */
  const calendar = document.querySelector('boot-calendar')
  calendar.addEventListener(
    'selected',
    ({ detail }: CustomEvent<DayDataSet>) => {
      const inputDate = form.querySelector<HTMLInputElement>('#date')

      // Verifica se tem tarefas pra este dia
      // e retorna uma lista, mesmo que vazia
      const tasks = getTasks(formatFromCalendar(detail))

      console.log(tasks)

      // Preenche o campo de data do form
      inputDate.value = formatFromCalendar(detail)
    }
  )
})

customElements.whenDefined('boot-calendar').then(() => {})

export { CalendarElement }
