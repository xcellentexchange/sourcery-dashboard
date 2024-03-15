const apiBaseUrl = import.meta.env.VITE_API_URL

const buildCanonicalString = (params = {}) =>
  Object.entries(params)
    .map(([key, param]) => `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(param))}`)
    .sort()
    .join('&')

const buildUrlString = ({ section, action, query }) => `${apiBaseUrl}/${section}/${action}?${query}`

export function useApiQuery() {
  const runQuery = async ({ section, action, params, method = 'GET' }) => {
    const url = buildUrlString({ section, action, query: buildCanonicalString(params) })

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_API_CLIENT_KEY,
      },
    }
    try {
      let response = await fetch(url, options)
      response = await response.json()
      if (response.success) return response.data
      else throw new Error(response)
    } catch (e) {
      console.log(JSON.stringify(e.message, null, 2))
      return []
    }
  }

  return {
    runQuery,
  }
}
