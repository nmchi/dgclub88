'use client'

import { Video } from '@/payload-types'
import { cn } from '@/utilities/cn';
import React, { useState } from 'react'
import VideoButton from './Button';

type VideoPlayerProps = {
    videos: Video[];
}

const VideoList: React.FC<VideoPlayerProps> = ({ videos }) => {
    const [currentVideo, setCurrentVideo] = useState<Video>(videos[0]);

    const handleClick = (video: Video) => {
        setCurrentVideo(video);
    };

    return (
        <div className={cn('container flex-none md:flex')}>
            <div className='flex-none md:flex-[2]'>
                {videos.length > 0 ? (
                    <video key={currentVideo?.id} controls>
                        <source src={currentVideo?.videoUrl} type="video/mp4" />
                    </video>
                ) : (
                    <></>
                )}
                
            </div>

            <div className='md:flex-1 flex-none w-auto grid grid-cols-5 gap-3 p-2' style={{ gridAutoRows: 'min-content' }}>
                {videos.length > 0 ? (
                    videos.map((video, index) => (
                        <VideoButton
                            key={video.id}
                            index={index}
                            onClick={() => handleClick(video)}
                        />
                    ))
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}

export default VideoList