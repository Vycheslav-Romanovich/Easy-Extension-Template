import React, { useEffect, useState } from 'react'
import getVideos from '../../../background/api/ytApi'
import VideoItem from './videoItem'

const RecomendedVideo: React.FC =  () => {

  const [recomendations, setRecomendation] = useState([])

  useEffect(() => {
    if(recomendations.length === 0) {
      const video = getVideos().then(response => response.json())
        .then(data => setRecomendation(data.data.items))
    }
  }, [])
  // const video = getVideos()
  return (
    <div className='h-6 flex bg-green-400' style={{width: '400px'}}>
      {
        recomendations.map(recomendation =>  {
          return  (
            <VideoItem
              key={''}
              urlVideo={''}
              img={''}
              channel={''}
              title={''}
            />
          )
        })
      }
    </div>
  )
}

export default RecomendedVideo