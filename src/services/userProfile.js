import { Client, Databases, ID, Storage, Query } from "appwrite";
import config from "../conf/config";

export class UserProfileDatabaseService {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async addProfileData(
    user_Id,
    {
      username,
      email,
      profile_pic_url,
      total_expenses,
      num_transactions,
      highest_expense_amount,
      most_used_category,
      monthly_budget,
      profile_pic_url_id,
    }
  ) {
    try {
      const uniqueProfileId = ID.unique();
      const profile = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProfileCollectionId,
        user_Id,
        {
          user_Id: user_Id,
          username,
          email,
          profile_pic_url,
          total_expenses,
          num_transactions,
          highest_expense_amount,
          most_used_category,
          monthly_budget,
          profile_pic_url_id,
        }
      );
      return profile;
    } catch (error) {
      console.log("Error in creating profile", error);
      console.log("Error message:", error.message);
      console.log("Error response:", error.response);
      return null;
    }
  }

  async updateProfile(
    user_Id,
    {
      username,
      email,
      profile_pic_url,
      total_expenses,
      num_transactions,
      highest_expense_amount,
      most_used_category,
      monthly_budget,
      profile_pic_url_id,
    }
  ) {
    try {
      const profile = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProfileCollectionId,
        user_Id,
        {
          username,
          email,
          profile_pic_url,
          total_expenses,
          num_transactions,
          highest_expense_amount,
          most_used_category,
          monthly_budget,
          profile_pic_url_id,
        }
      );
      return profile;
    } catch (error) {
      console.log("Error is updating profile", error);
      return null;
    }
  }

  // file object returned by uploadFile method , pass it to getFilePreview method which will provide you the url of the image stored in storage , use this url in addExpense method in receipt_image prop while adding expense

  async uploadProfilePicture(file) {
    try {
      const fileObj = await this.storage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
      console.log(fileObj);
      return fileObj;
    } catch (error) {
      console.log("Error uploading file: ", error);
      return null;
    }
  }

  async getProfile(user_Id) {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteUserProfileCollectionId,
        [Query.equal("user_Id", user_Id)]
      );

      // If the user profile exists, return the first document
      if (response.total > 0) {
        // console.log("getProfile: ", response.documents[0]);
        return response.documents[0];
      } else {
        console.log("Profile not found for user:", user_Id);
        return null;
      }
    } catch (error) {
      console.log("Error fetching user profile:", error);
      return null;
    }
  }

  // Returns:
  // true if the file is successfully deleted.
  // false if an error occurs.
  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Error deleting profile picture: ", error);
      return false;
    }
  }

  //   Returns:
  // A URL (string) that can be used to preview the file (e.g., receipt image).
  getProfilePicture(fileId) {
    try {
      return this.storage.getFileView(config.appwriteBucketId, fileId);
    } catch (error) {
      console.log("Error getting file preview: ", error);
      return null;
    }
  }
}

const userProfileDatabaseService = new UserProfileDatabaseService();

export default userProfileDatabaseService;
