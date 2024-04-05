  window.setInterval(() => {
      const player = document.getElementById('movie_player')
      const subsToggleElement = document.querySelector('.ytp-subtitles-button')

      if (player) {
        if (!window.isLoaded) {
          window.isLoaded = true

          window.dispatchEvent(new CustomEvent('eLangSubsVideoReady'))
          window.dispatchEvent(new CustomEvent('eLangSubsRenderSettings'))

          if (subsToggleElement && subsToggleElement.getAttribute('aria-pressed') === 'false') {
            player.toggleSubtitles()

          } else {
            window.dispatchEvent(new CustomEvent('eLangSubsChanged', { detail: '' }))
          }
        }
      } else {
        window.isLoaded = false
      }
    }, 500)
    ;((open) => {
      XMLHttpRequest.prototype.open = function (method, url) {
        if (url.match(/^http/g) !== null) {
          const urlObject = new URL(url)
          if (urlObject.pathname === '/api/timedtext') {
            window.subtitlesEnabled = true
            const lang = urlObject.searchParams.get('lang') || urlObject.searchParams.get('tlang')
            window.dispatchEvent(new CustomEvent('eLang_data', { detail: urlObject.href }))
            window.dispatchEvent(new CustomEvent('eLangSubsChanged', { detail: lang }))
          }
        }
        open.call(this, method, url, true)
      }
    })(XMLHttpRequest.prototype.open)