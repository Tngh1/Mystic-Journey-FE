import { Download, Monitor, Check } from "lucide-react";
import DownloadButton from "@/components/ui/DownloadButton";

const DOWNLOAD = {
  platform: "Windows (PC)",
  icon: Monitor,
  version: "v2.4.1",
  size: "4.8 GB",
  releaseDate: "Jun 15, 2026",
  href: "/downloads/MysticJourney-Setup-2.4.1.exe",
  requirements: ["Windows 10 (64-bit) or later", "8 GB RAM minimum", "20 GB available space"],
};

const SYSTEM_REQUIREMENTS = {
  minimum: [
    { label: "OS", value: "Windows 10 (64-bit)" },
    { label: "Processor", value: "Intel i5-6600 / AMD Ryzen 5 1500X" },
    { label: "Memory", value: "8 GB RAM" },
    { label: "Graphics", value: "NVIDIA GTX 960 / AMD Radeon RX 460" },
    { label: "Storage", value: "20 GB available space" },
    { label: "DirectX", value: "Version 11" },
  ],
  recommended: [
    { label: "OS", value: "Windows 11 (64-bit)" },
    { label: "Processor", value: "Intel i7-9700K / AMD Ryzen 5 3600X" },
    { label: "Memory", value: "16 GB RAM" },
    { label: "Graphics", value: "NVIDIA RTX 2060 / AMD Radeon RX 5700" },
    { label: "Storage", value: "SSD with 20 GB available space" },
    { label: "DirectX", value: "Version 12" },
  ],
};

export default function DownloadPage() {
  const Icon = DOWNLOAD.icon;
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#ffc032]/20 flex items-center justify-center text-[#ffc032]">
              <Download className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Download Mystic Journey</h1>
              <p className="text-white/60">Available for Windows PC &middot; Released {DOWNLOAD.releaseDate}</p>
            </div>
          </div>

          <div className="space-y-12 text-white/80">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-[#ffc032]">1.</span> Download Client
              </h2>
              <div className="relative bg-white/5 p-6 rounded-2xl border border-[#ffc032]/40 shadow-[0_0_30px_rgba(255,192,50,0.15)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ffc032]/20 flex items-center justify-center text-[#ffc032]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{DOWNLOAD.platform}</h3>
                    <p className="text-xs text-white/50">{DOWNLOAD.version} &middot; {DOWNLOAD.size}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {DOWNLOAD.requirements.map((req) => (
                    <li key={req} className="flex gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-[#ffc032] shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-center">
                  <DownloadButton
                    href={DOWNLOAD.href}
                    idleLabel="Download"
                    doneLabel="Open"
                    download
                  />
                </div>
                <p className="text-center text-xs text-white/40 mt-3">Released {DOWNLOAD.releaseDate}</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
