import { formatFromForm } from './format-from-form'
import { formatTask } from './format-task'
import { getTasks } from './get-tasks'

export function setTasks(data: FormData) {
  const key = formatFromForm(data.get('date').toString())

  const tasks = getTasks(key)
  tasks.push(formatTask(data))

  localStorage.setItem(key, JSON.stringify(tasks))
}
