export function handleFormButton(form: HTMLFormElement) {
  const button = form.querySelector('button')
  if (button) button.disabled = true

  form.onchange = () => {
    const valid = !form.checkValidity()
    if (button) button.disabled = valid
  }
}