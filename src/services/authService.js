import config from "../conf/config.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  account;
  client = new Client();

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
  }
  // Creates a new user account in Appwrite and logs in the user if successful.
  // Returns: a session object if login is successful, otherwise undefined.

  //   The session object returned by createAccount (via login) contains information about the user's authentication session. Specifically, it includes:

  // The session ID
  // The user ID
  // The user's device and client info
  // The session creation and expiration times
  // Provider/session type (e.g., email/password)
  // Some security and status fields

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.login({ email, password });
      }
    } catch (error) {
      console.error("Error creating account: ", error);
    }
  }

  // Logs in a user with email and password using Appwrite Auth service.
  // Returns: a session object (with session/user info) if successful, otherwise undefined.
  async login({ email, password }) {
    try {
      //On success: returns a session object (with session/user info).
      const userLogin = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return userLogin;
    } catch (error) {
      console.log("Error logging in: ", error);
    }
  }

  // Gets the currently authenticated user from Appwrite.
  // Returns: the user object if authenticated, otherwise undefined.

  //   The user object returned by the getCurrentUser method (which calls account.get() from Appwrite) typically contains the following fields:

  // $id: The unique user ID
  // $createdAt: Account creation timestamp
  // $updatedAt: Last update timestamp
  // name: The user's name
  // registration: Registration timestamp
  // status: Account status (e.g., "active")
  // passwordUpdate: Last password update timestamp
  // email: The user's email address
  // emailVerification: Whether the email is verified (boolean)
  // phone: The user's phone number (if provided)
  // phoneVerification: Whether the phone is verified (boolean)
  // prefs: User preferences (object, can be empty)
  // labels: Any labels/tags associated with the user (array)
  // accessedAt: Last access timestamp

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      console.log("User is authenticated:", user);
      return user;
    } catch (error) {
      console.error("User is not authenticated:", error);
    }
  }

  // Logs out the current user by deleting all sessions in Appwrite.
  // Returns: the logout response object if successful, otherwise undefined.
  async logout() {
    try {
      const logoutResponse = await this.account.deleteSessions();
      return logoutResponse;
    } catch (error) {
      console.log("Error logging out: ", error);
    }
  }
}

const authService = new AuthService();

export default authService;
