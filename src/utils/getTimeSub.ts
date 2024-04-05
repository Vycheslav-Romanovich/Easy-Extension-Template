export   const formatSubsTime = (times: number) => {
  const time = Math.round(times / 1000)
  const hours = Math.floor(time / 60 / 60)
  const minutes = Math.floor(time / 60) - hours * 60
  const seconds = time % 60
  const formatted = [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')]

  formatted[0] === '00' && formatted.shift()

  return formatted.join(':')
}
