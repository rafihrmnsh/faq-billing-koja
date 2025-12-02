import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, X, LogOut, Settings, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { faqService, FAQItem, CategoryItem } from "../services/faqService";

export default function AdminPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  
  // View States
  const [showForm, setShowForm] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  
  // FAQ Form Data
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "", category: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Category Form Data
  const [newCategoryName, setNewCategoryName] = useState("");
  const [catDeleteConfirm, setCatDeleteConfirm] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [fetchedFaqs, fetchedCategories] = await Promise.all([
        faqService.getFAQs(),
        faqService.getCategories()
      ]);
      setFaqs(fetchedFaqs);
      setCategories(fetchedCategories);
      
      // Set default category for form if categories exist
      if (fetchedCategories.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: fetchedCategories[0].name }));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  // --- FAQ Handlers ---

  const handleAddOrUpdate = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("Please fill in both question and answer");
      return;
    }

    const categoryToUse = formData.category || (categories.length > 0 ? categories[0].name : "General");

    try {
      if (editingId) {
        await faqService.updateFAQ(editingId, {
          question: formData.question,
          answer: formData.answer,
          category: categoryToUse,
        });
        
        setFaqs(faqs.map(faq => 
          faq.id === editingId 
            ? { ...faq, question: formData.question, answer: formData.answer, category: categoryToUse }
            : faq
        ));
      } else {
        const newFaq = await faqService.addFAQ({
          question: formData.question,
          answer: formData.answer,
          category: categoryToUse,
        });
        setFaqs([...faqs, newFaq]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert("Failed to save FAQ");
    }
  };

  const handleEdit = (faq: FAQItem) => {
    setFormData({ 
      question: faq.question, 
      answer: faq.answer,
      category: faq.category || (categories[0]?.name || "General")
    });
    setEditingId(faq.id);
    setShowForm(true);
    setIsManagingCategories(false);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await faqService.deleteFAQ(id);
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
    setFormData({ question: "", answer: "", category: categories[0]?.name || "General" });
    setEditingId(null);
    setShowForm(false);
  };

  // --- Category Handlers ---

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const newCat = await faqService.addCategory(newCategoryName.trim());
      setCategories([...categories, newCat]);
      setNewCategoryName("");
    } catch (error) {
      alert("Failed to add category. It might already exist.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (catDeleteConfirm === id) {
      try {
        await faqService.deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        setCatDeleteConfirm(null);
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    } else {
      setCatDeleteConfirm(id);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-koja-600 via-koja-500 to-koja-700 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">FAQ Management</h1>
            <p className="text-koja-100 text-lg">
              Create, edit, and manage your FAQs and Categories
            </p>
          </div>
          <div className="flex gap-3">
             <button
              onClick={() => {
                setIsManagingCategories(!isManagingCategories);
                setShowForm(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-white/10 ${
                isManagingCategories ? "bg-white text-koja-600 font-semibold" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{isManagingCategories ? "Manage FAQs" : "Manage Categories"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* --- Category Management View --- */}
        {isManagingCategories ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-koja-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FolderPlus className="w-6 h-6 text-koja-600" />
                Manage Categories
              </h2>
              
              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name (e.g. 'Shipping')"
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-koja-500"
                />
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="px-6 py-2.5 bg-koja-600 text-white font-semibold rounded-lg hover:bg-koja-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Category
                </button>
              </form>

              {/* Category List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 group hover:border-koja-300 transition-colors">
                    <span className="font-medium text-slate-700">{cat.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className={`p-2 rounded-md transition-all ${
                        catDeleteConfirm === cat.id
                          ? "bg-red-100 text-red-600"
                          : "text-slate-400 hover:bg-red-50 hover:text-red-600"
                      }`}
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
             </div>
          </div>
        ) : (
          // --- FAQ Management View ---
          <>
            {/* Add/Edit Form */}
            {showForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-koja-100 animate-in fade-in slide-in-from-top-4 duration-300">
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
                      Category
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-koja-500 focus:border-transparent transition-all bg-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={() => { setIsManagingCategories(true); setShowForm(false); }}
                        className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 whitespace-nowrap text-sm font-medium"
                        title="Manage Categories"
                      >
                        + Edit
                      </button>
                    </div>
                  </div>

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
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-koja-50 text-koja-600 border border-koja-100">
                              {faq.category || "General"}
                            </span>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-koja-600 transition-colors break-words">
                              {faq.question}
                            </h3>
                          </div>
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
          </>
        )}
      </div>
    </div>
  );
}
