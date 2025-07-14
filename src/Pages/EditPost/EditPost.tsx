import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import AppWriteBackendApi from '../../appwrite/conf/conf';
import { Container, PostForm } from '../../components';

import type { ContentStructure } from '../../appwrite/conf/conf';

function EditPost() {
    const [posts, setPosts] = useState<ContentStructure | null>(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            AppWriteBackendApi.getPost(slug).then((post) => {
                if (post) {
                    const mappedPost: ContentStructure = {
                        title: post.title,
                        content: post.content,
                        featuredImg: post.featuredImg,
                        status: post.status,
                        slug: post.slug,
                        userId: post.userId,
                        // add other required fields if needed
                    };
                    setPosts(mappedPost);
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
    return posts ? (
        <div className='py-8'>
            <Container>
                <PostForm post={posts} />
            </Container>
        </div>
    ) : null
}

export default EditPost