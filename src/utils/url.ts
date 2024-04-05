import Netflix from '../pages/content/services/netflix'

const netflix = new Netflix()

export const getVideoId = (courseraVideoId?: string): string | null => {

  if (getService() === 'netflix') {
    const id = netflix.getMoveId()
    return id
  }

  if (getService() === 'youtube') {
    const regExpression = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = window.location.href.match(regExpression)
    if (match && match[2].length === 11) {
      return match[2]
    }
  }

  if (getService() === 'coursera') {
    if (courseraVideoId) {
      return courseraVideoId
    }
  }

  return null
}

export const getService = (): 'youtube' | 'netflix' | 'coursera' | null => {
  const url = window.location.href
  if (url.includes('youtube.com')) return 'youtube'
  if (url.includes('netflix.com')) return 'netflix'
  if (url.includes('coursera.org')) return 'coursera'

  return null
}
