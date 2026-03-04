import React from "react";
import { Link } from "react-router-dom";
import { Code2, Shield, BarChart3, ChevronRight } from "lucide-react";

const CODE_LINES = [
  "const solve = (n) => n * 2;",
  "function binarySearch(arr, x) {",
  "return response.json();",
  "import { useState } from 'react';",
];

const BG = "#0a0e17";

export default function LandingPage() {
  return (
    <div
      className="h-[calc(100vh-7rem)] min-h-[400px] w-full text-white overflow-hidden relative flex flex-col"
      style={{ backgroundColor: BG }}
    >
      <div
        className="absolute inset-0 opacity-[0.05] select-none pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 flex flex-col gap-4 p-6 font-mono text-xs text-blue-300/80 overflow-hidden">
          {CODE_LINES.map((line, i) => (
            <div key={i} style={{ transform: `translateX(${(i % 3) * 3}rem)` }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col min-h-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Hero - composed block, centered */}
        <section className="flex-shrink-0 pt-4 sm:pt-8 flex flex-col items-center">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              CodeForge
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-medium leading-relaxed">
              Run code. Solve problems. Get interview-ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2">
              <Link
                to="/signup"
                className="px-7 py-3.5 rounded-xl font-bold text-white text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all inline-flex items-center gap-2"
              >
                Get started
                <ChevronRight className="w-5 h-5" />
              </Link>
              <span className="text-sm text-white/50 font-medium">
                No sign-up required. Run code securely.
              </span>
            </div>
          </div>
        </section>

        {/* Features - bold titles, short lines */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12 flex-shrink-0">
          {[
            { icon: Code2, title: "Multi-Language", description: "JavaScript, Python, Java, TypeScript." },
            { icon: Shield, title: "Secure Execution", description: "Isolated run. Practice safely." },
            { icon: BarChart3, title: "Track Progress", description: "Submissions and solved problems." },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <div className="w-11 h-11 rounded-xl bg-blue-500/25 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
              <p className="text-white/60 text-sm font-medium">{description}</p>
            </div>
          ))}
        </section>

        {/* Bottom - credit + login */}
        <section className="mt-10 sm:mt-12 pt-6 flex-shrink-0 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-white/60 text-sm font-medium">
            Built by <span className="text-white font-semibold">Yashasvi Shukla</span>
          </p>
          <Link
            to="/login"
            className="text-white/70 hover:text-white font-semibold text-sm transition-colors"
          >
            Already have an account? <span className="text-blue-400">Log in</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
