() => {
  const parseMock = JSON.parse
  const stringifyMock = JSON.stringify

  JSON.parse = function() {
    // eslint-disable-next-line
    const data = parseMock.apply(this, arguments)

    if (data && data.result && data.result.timedtexttracks) {
      window.dispatchEvent(new CustomEvent('elangSubs_data', { detail: data.result }))
    }
    return data
  }
  // eslint-disable-next-line
  JSON.stringify = function(response) {
    // eslint-disable-next-line
    if (!response) return stringifyMock.apply(this, arguments)
    // eslint-disable-next-line
    const data = parseMock(stringifyMock.apply(this, arguments))

    let modified = false
    if (data && data.params && data.params.showAllSubDubTracks != null) {
      data.params.showAllSubDubTracks = true
      modified = true
    }
    if (data && data.params && data.params.profiles) {
      data.params.profiles.push('webvtt-lssdh-ios8')
      modified = true
    }
    // eslint-disable-next-line
    return modified ? stringifyMock(data) : stringifyMock.apply(this, arguments)
  }

  function getPlayer() {
    const videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer
    const sessionId = videoPlayer.getAllPlayerSessionIds()[0]

    return videoPlayer.getVideoPlayerBySessionId(sessionId)
  }

  // eslint-disable-next-line
  function handleSeek(event) {
    getPlayer().seek(event.detail)
  }

  function playNetflixVideo() {
    const videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer
    const sessionId = videoPlayer.getAllPlayerSessionIds()[0]
    videoPlayer.getVideoPlayerBySessionId(sessionId).play()
  }

  function pauseNetflixVideo() {
    const videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer
    const sessionId = videoPlayer.getAllPlayerSessionIds()[0]
    videoPlayer.getVideoPlayerBySessionId(sessionId).pause()
  }

  window.addEventListener('elangSubsSeek', handleSeek)
  window.addEventListener('elangPlayNetflixVideo', playNetflixVideo)
  window.addEventListener('elangPauseNetflixVideo', pauseNetflixVideo)
  let flag = false
  window.setInterval(() => {
    const player = getPlayer()

    if (player && document.querySelector('.watch-video--player-view')) {
      if (!window.isLoaded) {
        window.isLoaded = true
        window.dispatchEvent(new CustomEvent('elangSubsVideoReady'))
      }
      if (!player.getTimedTextTrack().bcp47 && !flag) {
        window.dispatchEvent(new CustomEvent('elangSubsSubtitlesChanged', { detail: 'en' }))
        flag = true
      }
      if (window.currentLanguage !== player.getTimedTextTrack().bcp47) {
        window.currentLanguage = player.getTimedTextTrack().bcp47

        window.dispatchEvent(new CustomEvent('elangSubsSubtitlesChanged', { detail: window.currentLanguage }))
      }
    } else {
      window.isLoaded = false
      window.currentLanguage = null
    }
  }, 500)
}