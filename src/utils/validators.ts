export const isEmailValid = (email: string): boolean => {
  const regex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i).test(email)
  return regex
}

export const isTextareaValid = (value: string): boolean => value.length > 5