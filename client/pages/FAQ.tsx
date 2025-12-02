import { useState, useEffect } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { cn, linkify } from "@/lib/utils.tsx";
import { faqService, FAQItem } from "../services/faqService";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedFaqs, fetchedCategories] = await Promise.all([
          faqService.getFAQs(),
          faqService.getCategories()
        ]);
        setFaqs(fetchedFaqs);
        // Extract names and ensure "All" is at the start
        setCategories(["All", ...fetchedCategories.map(c => c.name)]);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "All" || 
      (faq.category || "General") === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-koja-600 via-koja-500 to-koja-700 text-white py-20 px-4 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="inline-block bg-white bg-opacity-20 rounded-full p-3">
              <HelpCircle className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-koja-100 text-lg mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our services. Browse our comprehensive knowledge base.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-3.5 text-koja-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-lg bg-white bg-opacity-20 text-white placeholder-koja-200 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 transition-all text-lg shadow-lg"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  activeCategory === category
                    ? "bg-white text-koja-600 border-white shadow-md scale-105"
                    : "bg-koja-800/30 text-koja-100 border-transparent hover:bg-koja-800/50 hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            {loading ? (
              <div className="text-slate-600">Loading FAQs...</div>
            ) : (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="bg-slate-200 rounded-full p-4">
                    <HelpCircle className="w-8 h-8 text-slate-600" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-4">
                  {searchQuery ? "No results found" : "No FAQs available yet"}
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms to find what you're looking for"
                    : activeCategory !== "All" 
                      ? `No FAQs found in the "${activeCategory}" category`
                      : "Check back soon for frequently asked questions"}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="group border border-slate-200 rounded-xl overflow-hidden hover:border-koja-300 transition-all duration-200 shadow-sm hover:shadow-lg bg-white"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => toggleOpen(faq.id)}
                  className="w-full px-6 sm:px-8 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-koja-50 text-koja-600 border border-koja-100">
                        {faq.category || "General"}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-koja-600 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-slate-400 transition-all duration-300 flex-shrink-0 group-hover:text-koja-600",
                      openId === faq.id && "rotate-180 text-koja-600"
                    )}
                  />
                </button>

                {openId === faq.id && (
                  <div className="px-6 sm:px-8 py-5 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200 animate-in fade-in duration-200">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {linkify(faq.answer)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
