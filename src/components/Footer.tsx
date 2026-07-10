import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
        <p>
          Built with React, TypeScript &amp; the Stellar SDK. Runs on the Stellar{" "}
          <span className="font-medium">Testnet</span> only — no real funds are ever used.
        </p>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <Github size={14} />
          Source on GitHub
        </a>
      </div>
    </footer>
  );
}
