import { formatFromForm } from './format-from-form'
import { TaskItem } from '../interfaces/task-item'

export function getTasks(date: string): TaskItem[] {
  const key = formatFromForm(date)
  const tasks = localStorage.getItem(key)

  return tasks ? JSON.parse(tasks) : []
}
