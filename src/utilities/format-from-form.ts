export function formatFromForm(value: string) {
  const [year, month, day] = value.split('-')
  return `${year}-${month}-${day}`
}
