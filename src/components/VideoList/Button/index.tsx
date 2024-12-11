import { Button } from '@payloadcms/ui';
import React from 'react'

type VideoButtonProps = {
    index: number;
    onClick: () => void;
}

const VideoButton: React.FC<VideoButtonProps> = ({ index, onClick }) => {

    return (
        <Button
            onClick={onClick}
            className='rounded-full border-transparent text-center transition-all 
                bg-slate-500 border-slate-300 text-white
                hover:bg-slate-800 hover:text-white focus:text-white focus:bg-slate-800
                dark:bg-slate-800 border dark:border-slate-800 p-1
                dark:hover:bg-slate-50 dark:hover:text-black dark:focus:text-black dark:focus:bg-slate-50'>
            Trận {index + 1}
        </Button>
    )
}

export default VideoButton