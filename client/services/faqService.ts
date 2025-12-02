import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const COLLECTION_NAME = "faqs";

export const faqService = {
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
  }
};
