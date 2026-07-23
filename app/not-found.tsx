import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Visual Badge */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold tracking-wide">
          404 Error
        </div>

        {/* Hero Number */}
        <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 select-none">
          404
        </h1>

        {/* Text Content */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Page not found
          </h2>
          <p className="text-slate-400 text-base">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or deleted.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
