import config from "../../config/config";
import { ID, Client, Account } from "appwrite";

export interface AccountCredentials {
  email: string;
  password: string;
}

export class AuthService {
  client = new Client();
  account: Account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async authCreateAccount({ email, password }: AccountCredentials) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password
      );

      if (userAccount) {
        return userAccount;
      }
    } catch (error) {
      console.error("Account creation failed:", error);
      throw error; // or handle error as needed
    }
  }

  async authLogin({ email, password }: AccountCredentials) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (err) {
      console.log("Error in Login", err);
    }
  }

  async authGetCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log(`error in getCurrentUser`, error);
    }
  }

  async authLogOut() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log(`Appwrite :: deleteSession ::logout error`, error);
    }
  }
}

const authService = new AuthService();
export default authService;
