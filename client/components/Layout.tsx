import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { HelpCircle, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div>
              <img src="/logo-koja.png" alt="TPK Koja Logo" className="h-10 w-auto" />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/")
                  ? "bg-koja-50 text-koja-500"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              FAQs
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive("/admin")
                  ? "bg-koja-50 text-koja-500"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                About FAQ Hub
              </h3>
              <p className="text-sm leading-relaxed">
                Your central hub for frequently asked questions. Find quick answers to common inquiries and get the information you need.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Browse FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="hover:text-white transition-colors"
                  >
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Information</h3>
              <p className="text-sm leading-relaxed">
                © 2024 FAQ Hub. All rights reserved. Built with modern technologies.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>
              Designed for easy knowledge sharing and information discovery
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
