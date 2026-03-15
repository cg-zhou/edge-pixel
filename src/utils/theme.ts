export type SiteTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme'
const THEME_COOKIE_KEY = 'site_theme'

const parseTheme = (value: string | null | undefined): SiteTheme | null => {
  return value === 'light' || value === 'dark' ? value : null
}

const getCookieDomain = (): string | null => {
  return window.location.hostname.endsWith('cg-zhou.top') ? '.cg-zhou.top' : null
}

export const readThemeCookie = (): SiteTheme | null => {
  const matched = document.cookie.match(/(?:^|; )site_theme=([^;]+)/)
  const rawValue = matched?.[1] ?? null
  return parseTheme(rawValue ? decodeURIComponent(rawValue) : null)
}

export const resolveTheme = (): SiteTheme => {
  return (
    readThemeCookie() ||
    parseTheme(window.localStorage.getItem(THEME_STORAGE_KEY)) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
}

export const applyTheme = (theme: SiteTheme) => {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export const persistTheme = (theme: SiteTheme) => {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)

  const domain = getCookieDomain()
  const domainPart = domain ? `;domain=${domain}` : ''
  document.cookie = `${THEME_COOKIE_KEY}=${theme};path=/;max-age=31536000;samesite=lax${domainPart}`
}

export const setTheme = (theme: SiteTheme) => {
  applyTheme(theme)
  persistTheme(theme)
}