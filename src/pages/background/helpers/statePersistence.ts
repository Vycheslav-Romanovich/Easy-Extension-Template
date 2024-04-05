export function saveState(state: any, key: string): void {
  localStorage.setItem(key, JSON.stringify(state))
}

export function loadState(key: string) {
  const storageString = localStorage.getItem(key)
  if (storageString) {
    return JSON.parse(storageString)
  }
}

export function resetState(key: string): void {
  localStorage.removeItem(key)
}
