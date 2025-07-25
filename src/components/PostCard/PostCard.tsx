import React from "react";
import { Link } from "react-router-dom";
import service from "../../appwrite/conf/conf";

type PostCardProps = {
  $id: string;
  title: string;
  featuredImage: string;
};

function PostCard({ $id, title, featuredImage }: Readonly<PostCardProps>) {
  return (
    <Link to={`/post/${$id}`} className="post-card">
      <div className="w-full bg-gray-100 rounded-xl p-4 ">
        <div className="w-full justify-center mb-4">
          <img
            src={service.getFilePreview(featuredImage)}
            alt=""
            className="rounded-xl "
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
