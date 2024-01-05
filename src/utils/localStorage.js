export const loadState = (key) => {
  try {
    const serializedState = localStorage.getItem(key)
    return serializedState == null ? null : JSON.parse(serializedState)
  } catch (err) {
    localStorage.removeItem(key)
  }
}

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(key, serializedState)
  } catch {
    localStorage.removeItem(key)
  }
}
