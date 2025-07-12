import { Client, Databases, ID, Storage } from "appwrite";
import config from "../conf/config";

export class DatabaseService {
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

  async addExpense({
    expense_Id,
    amount,
    category,
    description,
    date,
    payment_method,
    location,
    receipt_image,
    user_Id, // will get this from account.get() method of appwrite authentn service call getCurrentUser() only when the user is logged in
  }) {
    try {
      const expense = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        ID.unique(),
        {
          expense_Id,
          amount,
          category,
          description,
          date,
          payment_method,
          location,
          receipt_image,
          user_Id,
        }
      );
      return expense;
    } catch (error) {
      console.log("Error in creating expense");
      return null;
    }
  }

  async updateExpense(
    Id,
    {
      amount,
      category,
      description,
      date,
      payment_method,
      location,
      receipt_image,
    }
  ) {
    try {
      const expense = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        Id,
        {
          amount,
          category,
          description,
          date,
          payment_method,
          location,
          receipt_image,
        }
      );
      return expense;
    } catch (error) {
      console.log("Error is updating document", error);
      return null;
    }
  }

  // Returns:
  // An empty object {} on success.
  async deleteExpense(Id) {
    try {
      const response = await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        Id
      );
    } catch (error) {
      console.log("Error in deleting expense ", error);
      return null;
    }
  }

  // returns
  // An object with a documents array:
  async getExpenses() {
    try {
      const expenses = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId
      );
      return expenses;
    } catch (error) {
      console.log("Error getting expenses: ", error);
      return null;
    }
  }

  // fileId returned by uploadFile method , pass it to getFilePreview method which will provide you the url of the image stored in storage , use this url in addExpense method in receipt_image prop while adding expense

  async uploadFile(file) {
    try {
      const fileId = await this.storage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
      return fileId;
    } catch (error) {
      console.log("Error uploading file: ", error);
      return false;
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
      console.log("Error deleting file: ", error);
      return false;
    }
  }

  //   Returns:
  // A URL (string) that can be used to preview the file (e.g., receipt image).
  getFilePreview(fileId) {
    try {
      return this.storage.getFilePreview(config.appwriteBucketId, fileId);
    } catch (error) {
      console.log("Error getting file preview: ", error);
      return null;
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;
