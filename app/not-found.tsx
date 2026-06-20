import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative">
          <div className="text-[120px] font-bold leading-none select-none text-yellow-500/10 font-['PatrickHandSC']">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-500 flex items-center justify-center">
              <span className="text-5xl font-bold text-yellow-500 font-['PatrickHandSC']">?</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white font-['PatrickHandSC']">
            Page not found
          </h1>
          <p className="text-white/60 text-sm font-['NotoSans']">
            This page seems to have vanished into the void. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors font-['NotoSans']"
          >
            Back to Home
          </Link>
          <Link
            href="/wiki"
            className="px-6 py-3 border border-white/20 hover:border-white/40 text-white rounded-lg transition-colors font-['NotoSans']"
          >
            Explore Wiki
          </Link>
        </div>
      </div>
    </div>
  );
}
