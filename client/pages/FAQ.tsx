import { useState, useEffect } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqService, FAQItem } from "../services/faqService";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await faqService.getFAQs();
        setFaqs(data);
      } catch (error) {
        console.error("Failed to fetch FAQs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Frequently Asked Questions Billing
          </h1>
          <p className="text-koja-100 text-lg mb-8 max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan umum seputar billing. Jelajahi basis pengetahuan kami yang lengkap.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3.5 text-koja-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-lg bg-white bg-opacity-20 text-white placeholder-koja-200 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 transition-all text-lg shadow-lg"
            />
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
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-koja-600 transition-colors flex-1">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-slate-400 transition-all duration-300 flex-shrink-0 ml-4 group-hover:text-koja-600",
                      openId === faq.id && "rotate-180 text-koja-600"
                    )}
                  />
                </button>

                {openId === faq.id && (
                  <div className="px-6 sm:px-8 py-5 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200 animate-in fade-in duration-200">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {faq.answer}
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
