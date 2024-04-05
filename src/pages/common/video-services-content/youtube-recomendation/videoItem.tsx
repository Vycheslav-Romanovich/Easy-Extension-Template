import React from 'react'

type videoItemType = {
  urlVideo: string,
  img: string,
  title: string,
  channel: string
}

const VideoItem: React.FC<videoItemType> = ({ urlVideo, img, title, channel }) => {
  return (
    <a href={urlVideo} target='_blank'>
      <div>
       <div>
        <img src={img} alt={title} />
       </div>
        <div>
          <span>{title}</span>
        </div>
        <div>
          <span>{channel}</span>
        </div>
      </div>
    </a>
  )
}

export default VideoItem