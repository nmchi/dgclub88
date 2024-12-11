import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

import type { ListVideoBlock as ListBlockProps, Video } from '@/payload-types';
import VideoList from '@/components/VideoList';

export const ListVideoBlock: React.FC<ListBlockProps & {}> = async (props) => {
    const { categories, isPublic } = props;

    const flattenedCategories = categories?.map((category) => {
        if (typeof category === 'object') return category.id
        else return category
    })

    let videos: Video[] = [];

    const payload = await getPayload({ config: configPromise });

    const fetchVideos = await payload.find({
        collection: 'videos',
        depth: 1,
        limit: 50,
        where: {
            category: {
                in: flattenedCategories,
            },
            isPublic: {
                equals: isPublic,
            },
        },
    });

    videos = fetchVideos.docs;

    return (
        <div className="my-16">
            <VideoList videos={videos} />
        </div>
    );
};
