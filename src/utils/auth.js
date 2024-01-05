import { store } from 'store/store'
import { login, logout } from 'store/slices/authSlice'
import { loadState, saveState } from 'utils/localStorage'

class Auth {
  bc = null
  token = null
  isAuthorized = typeof window !== 'undefined' && !!loadState('auth')
  isRefreshing = false
  constructor() {
    this.bc = new BroadcastChannel('main')
    this.bc.onmessage = ({ data: event }) => {
      if (!event) return
      if (event.command === 'update_token') this.setToken(event.data, true)
      else if (event.command === 'login') this.login(event.data, true)
      else if (event.command === 'logout') this.logout(true)
      else if (event.command === 'refreshing') this.isRefreshing = true
    }
  }
  send(msg) {
    this.bc?.postMessage(msg)
  }
  login(data, isEvent) {
    this.token = data.token
    this.isAuthorized = true
    this.isRefreshing = false
    store.dispatch(login(data.user))
    if (!isEvent) {
      saveState('auth', data.user)
      this.send({ command: 'login', data })
    }
  }
  setToken(t, isEvent) {
    this.token = t
    this.isRefreshing = false
    !isEvent && this.send({ command: 'update_token', data: t })
  }
  setUser(data) {
    store.dispatch(login(data))
  }
  logout(isEvent) {
    this.token = null
    this.isAuthorized = false
    this.isRefreshing = false
    store.dispatch(logout())
    if (!isEvent) {
      saveState('auth', null)
      this.send({ command: 'logout' })
    }
  }
}

export const auth = new Auth()
