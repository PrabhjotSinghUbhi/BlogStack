import config from "../../config/config";
import { Databases, Storage, Client, Query, ID } from "appwrite";

export interface ContentStructure {
  title: string;
  content: string;
  featuredImg: string;
  status: string;
  slug: string;
  userId: string;
}

export class AppwriteService {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteProjectId)
      .setProject(config.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImg,
    status,
    userId,
  }: ContentStructure) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImg,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("Error :: Create Post :: ", error);
    }
  }

  async updatePost(
    slug: string,
    { title, content, featuredImg, status, userId }: ContentStructure
  ) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImg,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("ERROR : Update Post :: ", error);
    }
  }

  async deletePost(slug: string) {
    try {
      return await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("ERROR :: DeletePost :: ", error);
    }
  }

  async getPost(slug: string) {
    try {
      return await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("ERROR :: GetPost :: ", error);
    }
  }

  async getActivePosts() {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        [Query.equal("status", "active")]
      );
    } catch (err) {
      console.log(`Error :: GetActivePost :: `, err);
    }
  }

  async uploadFile(file: File) {
    try {
      return await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (err) {
      console.log(`Error :: upload File`, err);
    }
  }

  async deleteFile(fileId: string) {
    try {
      return await this.bucket.deleteFile(config.appwriteBucketId, fileId);
    } catch (err) {
      console.log(`Error :: Delete File`, err);
    }
  }

  getFilePreview(fileId: string) {
    return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
  }
}

const AppWriteBackendApi = new AppwriteService();
export default AppWriteBackendApi;
