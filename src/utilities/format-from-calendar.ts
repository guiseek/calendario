import { DayDataSet } from '../elements/calendar'

export function formatFromCalendar(value: DayDataSet) {
  const { year, month, date } = value

  const d = date.length === 1 ? `0${date}` : date
  const m = month.length === 1 ? `0${month}` : month

  return `${year}-${m}-${d}`
}
