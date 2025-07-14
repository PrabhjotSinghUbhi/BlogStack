import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import AppWriteBackendApi, { type ContentStructure } from '../../../appwrite/conf/conf'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store/store'
import Button from '../../Button/Button'
import Input from '../../Input/Input'
import Rte from '../../RTE/RTE'
import Select from 'react-select'

function PostForm({ post }: Readonly<{ post: ContentStructure }>) {

    const { register, handleSubmit, control, setValue, getValues, watch } = useForm({
        defaultValues: {
            title: post?.title || '',
            content: post?.content || '',
            featuredImg: post?.featuredImg || '',
            slug: post?.slug || '',
            userId: post?.userId || '',
            status: post?.status || 'active'
        }
    })

    const navigate = useNavigate()
    const userData = useSelector((state: RootState) => state)

    const submit = async (data: ContentStructure) => {
        // is post is present and you want to upload the image, and because there was image present you nee to delete the previous image..
        if (post) {
            if (data.image[0]) {
                const file = await AppWriteBackendApi.uploadFile(data.image[0])

                //need to delete that file.
                if (file) {
                    await AppWriteBackendApi.deleteFile(post.featuredImg)
                }

                //need to update the whole post.
                const newPost = await AppWriteBackendApi.updatePost(post.slug, {
                    ...data,
                    featuredImg: file ? file.$id : undefined,
                })

                if (newPost) {
                    navigate(`post/${newPost.$id}`)
                }
            } else {
                const file = await AppWriteBackendApi.uploadFile(data.image[0])

                if (file) {
                    const fileId = file.$id
                    const newPost = AppWriteBackendApi.createPost({
                        ...data,
                        userId: userData.$id
                    })
                }

                if (newPost) {
                    navigate(`/post/${newPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((value: string) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);


    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title ?? ""), { shouldValidate: true })
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [watch, setValue,])

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
    ]

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    type={''}
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })} />
                <Input
                    type={''}
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
                    }} />
                <Rte label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={AppWriteBackendApi.getFilePreview(post.featuredImg)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Controller
                    name="status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            options={statusOptions}
                            className="mb-4"
                            value={statusOptions.find(option => option.value === field.value)}
                            onChange={option => field.onChange(option?.value)}
                        />
                    )}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm
