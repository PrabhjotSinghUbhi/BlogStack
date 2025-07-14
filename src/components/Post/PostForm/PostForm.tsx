import React, { useCallback, useEffect } from "react";
import { Button, Input, Rte } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store"; // Assuming you have a root reducer
import { useForm, type SubmitHandler } from "react-hook-form";
import AppWriteBackendApi from "../../../appwrite/conf/conf";

// Define post prop type RTE
interface Post {
    $id: string;
    title: string;
    content: string;
    featuredImage: string;
    status: "active" | "inactive";
}

// Define form data type
interface PostFormData {
    title: string;
    slug: string;
    content: string;
    status: "active" | "inactive";
    image: FileList;
    featuredImg?: string;
}

// Props for the component
interface PostFormProps {
    post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        getValues,
    } = useForm<PostFormData>({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state: RootState) => state.auth.userData);

    const submit: SubmitHandler<PostFormData> = async (data) => {
        if (post) {
            const file = data.image?.[0]
                ? await AppWriteBackendApi.uploadFile(data.image[0])
                : null;

            if (file) {
                await AppWriteBackendApi.deleteFile(post.featuredImage);
            }

            const dbPost = await AppWriteBackendApi.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await AppWriteBackendApi.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImg = fileId;
                const dbPost = await AppWriteBackendApi.createPost({
                    ...data,
                    userId: userData.$id,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value: string) => {
        return value
            ?.trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-") || "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value?.title), {
                    shouldValidate: true,
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    type={""} label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })} />
                <Input
                    type={""} label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        setValue(
                            "slug",
                            slugTransform(e.currentTarget.value),
                            { shouldValidate: true }
                        );
                    }} />
                <Rte
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />
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
                            src={AppWriteBackendApi.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                {/* <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                /> */}
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
