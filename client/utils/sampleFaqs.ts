export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const SAMPLE_FAQS: FAQItem[] = [
  {
    id: "1",
    question: "What is FAQ Hub?",
    answer:
      "FAQ Hub is a modern, user-friendly platform for managing frequently asked questions. It provides a clean interface for both users to browse answers and administrators to manage content.",
  },
  {
    id: "2",
    question: "How do I add a new FAQ?",
    answer:
      "To add a new FAQ, navigate to the Admin panel by clicking the 'Admin' button in the navigation bar. Click the 'Add New FAQ' button, fill in the question and answer fields, and click 'Add FAQ' to save it.",
  },
  {
    id: "3",
    question: "Can I edit existing FAQs?",
    answer:
      "Yes! In the Admin panel, you can click the edit icon (pencil) next to any FAQ to modify both the question and answer. After making changes, click 'Update FAQ' to save your updates.",
  },
  {
    id: "4",
    question: "How do I delete an FAQ?",
    answer:
      "To delete an FAQ, go to the Admin panel and click the delete icon (trash) next to the FAQ you want to remove. You'll need to click it again to confirm the deletion as a safety measure.",
  },
  {
    id: "5",
    question: "Is my data saved securely?",
    answer:
      "Your FAQ data is stored locally in your browser's storage, which means it persists between sessions but remains private on your device. For production use, consider integrating with a backend database.",
  },
  {
    id: "6",
    question: "Can users search for FAQs?",
    answer:
      "Yes! Users can use the search bar on the main FAQ page to search through all questions and answers. The search updates in real-time as they type.",
  },
];

export function initializeSampleFAQs(): void {
  const existing = localStorage.getItem("faqs");
  if (!existing) {
    localStorage.setItem("faqs", JSON.stringify(SAMPLE_FAQS));
  }
}
