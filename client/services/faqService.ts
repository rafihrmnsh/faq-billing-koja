import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  limit
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CategoryItem {
  id: string;
  name: string;
}

const COLLECTION_NAME = "faqs";
const CATEGORIES_COLLECTION = "categories";

const DEFAULT_CATEGORIES = ["General", "Billing", "Payments", "Account", "Technical"];

export const faqService = {
  // --- FAQ Operations ---

  // Get all FAQs
  async getFAQs(): Promise<FAQItem[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME)); // You can add orderBy here if needed
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FAQItem));
    } catch (error) {
      console.error("Error getting FAQs:", error);
      throw error;
    }
  },

  // Add a new FAQ
  async addFAQ(faq: Omit<FAQItem, "id">): Promise<FAQItem> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), faq);
      return {
        id: docRef.id,
        ...faq
      };
    } catch (error) {
      console.error("Error adding FAQ:", error);
      throw error;
    }
  },

  // Update an FAQ
  async updateFAQ(id: string, faq: Partial<Omit<FAQItem, "id">>): Promise<void> {
    try {
      const faqRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(faqRef, faq);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      throw error;
    }
  },

  // Delete an FAQ
  async deleteFAQ(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      throw error;
    }
  },

  // --- Category Operations ---

  // Get all Categories
  async getCategories(): Promise<CategoryItem[]> {
    try {
      const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("name"));
      const querySnapshot = await getDocs(q);
      
      // If no categories exist, initialize defaults
      if (querySnapshot.empty) {
        await this.initializeCategories();
        return this.getCategories(); // Recursive call to get the newly created ones
      }

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CategoryItem));
    } catch (error) {
      console.error("Error getting categories:", error);
      return DEFAULT_CATEGORIES.map(name => ({ id: name, name })); // Fallback
    }
  },

  async addCategory(name: string): Promise<CategoryItem> {
    try {
      // Check if exists first to prevent duplicates
      const q = query(collection(db, CATEGORIES_COLLECTION), where("name", "==", name), limit(1));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        throw new Error("Category already exists");
      }

      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), { name });
      return { id: docRef.id, name };
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  async initializeCategories(): Promise<void> {
    const promises = DEFAULT_CATEGORIES.map(name => 
      addDoc(collection(db, CATEGORIES_COLLECTION), { name })
    );
    await Promise.all(promises);
  }
};
