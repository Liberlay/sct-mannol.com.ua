import axios, { AxiosError } from 'axios'
import { auth } from './auth'

const Axios = axios.create({
  baseURL: `${process.env.HOST ?? '/'}api/v1`,
  credentials: 'include',
})

const REFRESH_ERROR = new AxiosError(
  'Request failed with status code 401',
  AxiosError.ERR_BAD_REQUEST,
  null,
  null,
  { config: {}, data: { code: 1002 }, headers: {}, status: 401 },
)

class Request {
  queue = []
  refreshQueue = []
  async unauthorized(config) {
    return await this.create(config)
  }
  async authorized(config) {
    if (!auth.token) await this.refreshTokens()
    try {
      return await this.create(config, { withToken: true })
    } catch (err) {
      if (err.response?.status === 401 && err.response.data?.code === 1004) {
        this.refreshTokens()
        return this.create(config, { withToken: true })
      }
      throw err
    }
  }
  async refreshTokens() {
    if (auth.isRefreshing)
      return new Promise((res, rej) =>
        this.refreshQueue.push({ res: () => res(undefined), rej: (err) => rej(err) }),
      )
    auth.isRefreshing = true
    if (!auth.isAuthorized) this.onRefreshError(this.getError(REFRESH_ERROR))
    auth.send({ command: 'refreshing' })
    try {
      const result = await this.create(
        { method: 'POST', url: `/auth/refresh` },
        { isRefresh: true },
      )
      auth.setToken(result.token)
      this.queue.forEach((req) => this.makeRequest(req))
      this.refreshQueue.forEach((req) => {
        req.res()
        this.refreshQueue = this.refreshQueue.filter((rq) => rq !== req)
      })
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) auth.logout()
      this.onRefreshError(err)
    } finally {
      auth.isRefreshing = false
    }
  }
  create(config, { withToken = false, isRefresh = false } = {}) {
    return new Promise((res, rej) => {
      const req = { config, res, rej, withToken }
      auth.isRefreshing && !isRefresh ? this.queue.push(req) : this.makeRequest(req)
    })
  }
  async makeRequest(req) {
    const { res, rej, config, withToken } = req
    try {
      const result = await Axios.request({
        ...config,
        headers: withToken
          ? { authorization: `Bearer ${auth.token}`, ...config.headers }
          : config.headers,
      })
      res(result.data)
    } catch (err) {
      rej(this.getError(err))
    }
    this.queue = this.queue.filter((rq) => rq !== req)
  }
  onRefreshError(err) {
    this.queue.forEach((req) => req.rej(err))
    this.refreshQueue.forEach((req) => {
      req.rej(err)
      this.refreshQueue = this.refreshQueue.filter((rq) => rq !== req)
    })
    throw err
  }
  getError(err) {
    return Object.assign(err, {
      code: err.response ? err.response.data.code ?? (err.response.status >= 500 ? 1000 : 0) : 1000,
    })
  }
}

export const request = new Request()
