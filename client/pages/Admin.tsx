import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { faqService, FAQItem } from "../services/faqService";

export default function AdminPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchFAQs = async () => {
    try {
      const data = await faqService.getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleAddOrUpdate = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("Please fill in both question and answer");
      return;
    }

    try {
      if (editingId) {
        await faqService.updateFAQ(editingId, {
          question: formData.question,
          answer: formData.answer,
        });
        
        // Update local state directly
        setFaqs(faqs.map(faq => 
          faq.id === editingId 
            ? { ...faq, question: formData.question, answer: formData.answer }
            : faq
        ));
      } else {
        const newFaq = await faqService.addFAQ({
          question: formData.question,
          answer: formData.answer,
        });
        
        // Add to local state directly
        setFaqs([...faqs, newFaq]);
      }
      // Removed await fetchFAQs(); to speed up UI
      resetForm();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert("Failed to save FAQ");
    }
  };

  const handleEdit = (faq: FAQItem) => {
    setFormData({ question: faq.question, answer: faq.answer });
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await faqService.deleteFAQ(id);
        // Update local state directly
        setFaqs(faqs.filter(faq => faq.id !== id));
        setDeleteConfirm(null);
      } catch (error) {
        console.error("Error deleting FAQ:", error);
        alert("Failed to delete FAQ");
      }
    } else {
      setDeleteConfirm(id);
    }
  };

  const resetForm = () => {
    setFormData({ question: "", answer: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-koja-600 via-koja-500 to-koja-700 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">FAQ Management</h1>
            <p className="text-koja-100 text-lg">
              Create, edit, and manage your frequently asked questions
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-koja-100">
            <div className="flex justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {editingId ? "Edit FAQ" : "Add New FAQ"}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {editingId ? "Update the question and answer" : "Create a new FAQ entry"}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="Enter the FAQ question"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-koja-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="Enter the FAQ answer"
                  rows={7}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-koja-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdate}
                  className="px-6 py-2.5 bg-koja-600 text-white font-semibold rounded-lg hover:bg-koja-700 transition-colors shadow-md hover:shadow-lg"
                >
                  {editingId ? "Update FAQ" : "Add FAQ"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <div className="mb-8 sm:mb-12">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-koja-600 text-white font-semibold rounded-lg hover:bg-koja-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Add New FAQ</span>
            </button>
          </div>
        )}

        {/* FAQs List */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Manage FAQs
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Total: <span className="font-semibold text-slate-800">{faqs.length}</span>
            </p>
          </div>

          {faqs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200">
              <div className="mb-4 flex justify-center">
                <div className="bg-slate-100 rounded-full p-3">
                  <Plus className="w-6 h-6 text-slate-400" />
                </div>
              </div>
              <p className="text-slate-600 text-lg font-medium">
                No FAQs yet. Create your first one!
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Click the "Add New FAQ" button above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 group-hover:text-koja-600 transition-colors break-words">
                        {faq.question}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="p-2 text-koja-600 hover:bg-koja-50 rounded-lg transition-colors hover:scale-110 active:scale-95"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(faq.id)}
                        className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                          deleteConfirm === faq.id
                            ? "bg-red-100 text-red-700 font-semibold"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title={
                          deleteConfirm === faq.id
                            ? "Click again to confirm deletion"
                            : "Delete"
                        }
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
