import React, { useEffect, useState } from 'react'
import { PostCard, Container } from '../../components'
import AppWriteBackendApi from '../../appwrite/conf/conf'
import type { Models } from 'appwrite'


function AllPost() {
    const [posts, setPosts] = useState<Models.Document[] | undefined>(undefined)
    useEffect(() => {
        AppWriteBackendApi.getActivePosts([])
            .then((posts) => {
                if (posts) {
                    setPosts(posts?.documents)
                }
            })
    }, [])
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts?.map((post) => (
                        <div key={post?.$id} className='p-2 w-1/4'>
                            <PostCard title={''} featuredImage={''} {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPost
