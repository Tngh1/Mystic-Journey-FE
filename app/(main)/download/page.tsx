import type { ReactNode } from "react";
import { Monitor, Check, Cpu, Sprout } from "lucide-react";
import DownloadButton from "@/components/ui/DownloadButton";
import Panel from "@/components/ui/Panel";

/* Download, as one tree standing on the page.

   The page used to be an iron strongbox with two slates under it — three
   separate surfaces stacked down a scroll. Now the whole page is a single
   object: a canopy carrying the title, a trunk running down the middle and into
   the footer's turf, and every piece of download information hung off the
   branches as a wooden sign. The installer itself is the fruit — one big gold
   thing in the middle of the trunk, which is also the page's only gold, so
   there is no question what you are meant to press.

   Same idiom as NoticeBoard and ChapterFrame: stacked hard-edged courses in
   existing tokens, lit on one edge, darker toward the bottom, tiling detail from
   `repeating-linear-gradient` so a course works at any width. Every part of the
   tree is decoration and `aria-hidden`; the signs are ordinary sections.

   The download button and its animation are untouched — it is dropped into the
   fruit's dark core, where its white-on-dark copy still reads. */

const DOWNLOAD = {
  platform: "Windows (PC)",
  icon: Monitor,
  version: "v1.0",
  size: "ZIP Archive",
  releaseDate: "Aug 3, 2026",
  href: "https://drive.google.com/uc?export=download&id=1acBCh4BpaVLNbgYc7ajVeX1aIKjnWEtd",
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

const OUTLINE = "border-black/60";
/** Bark seen along a branch: grain bands tiled across it. */
const BARK = "bg-[repeating-linear-gradient(90deg,rgb(0_0_0_/_0.18)_0_2px,transparent_2px_20px)]";
/** Foliage: hatched leaf clumps, tiled so one course works at any width. */
const LEAVES =
  "bg-[repeating-linear-gradient(45deg,rgb(0_0_0_/_0.18)_0_3px,transparent_3px_14px)]";

/** One foliage course. Narrow ones step the crown in toward the top. */
function Leaf({ w, h, fill }: { w: string; h: string; fill: string }) {
  return <span className={`block border-2 ${OUTLINE} ${w} ${h} ${fill} ${LEAVES}`} />;
}

/**
 * A sign hung off the trunk: a branch reaching out over it, two ropes, and the
 * plank itself. Below `md` the branches would have nowhere to reach, so the
 * signs stack down the trunk and only the ropes remain.
 */
function BranchSign({
  side,
  labelledBy,
  children,
}: {
  side: "left" | "right";
  labelledBy: string;
  children: ReactNode;
}) {
  const isLeft = side === "left";
  return (
    <div
      className={`relative w-full md:w-[54%] ${isLeft ? "md:mr-auto md:pr-6" : "md:ml-auto md:pl-6"}`}
    >
      {/* The bough. It spans the sign's full width so both ropes below hang
          from it — an inset branch left the outer rope attached to nothing —
          and runs past the container edge nearest the trunk so it reads as
          growing out of it. */}
      <span
        className={`pointer-events-none absolute top-0 hidden h-3 border-y-2 ${OUTLINE} bg-wood ${BARK} shadow-[inset_0_2px_0_var(--color-wood-light),inset_0_-2px_0_var(--color-wood-dark)] md:block ${
          isLeft ? "left-0 -right-4" : "-left-4 right-0"
        }`}
        aria-hidden="true"
      />

      <div className="relative min-w-0 pt-8">
        <span
          className={`pointer-events-none absolute left-[20%] top-0 h-8 w-1.5 border-x ${OUTLINE} bg-wood-dark`}
          aria-hidden="true"
        />
        <span
          className={`pointer-events-none absolute right-[20%] top-0 h-8 w-1.5 border-x ${OUTLINE} bg-wood-dark`}
          aria-hidden="true"
        />

        <Panel
          material="wood"
          as="section"
          rivets
          aria-labelledby={labelledBy}
          className="min-w-0 shadow-lg"
        >
          {children}
        </Panel>
      </div>
    </div>
  );
}

/* One spec sign. The recommended one is marked by a gold header rule *and* the
   word "Recommended", never by tint alone. */
function RequirementSign({
  id,
  title,
  featured,
  specs,
  side,
}: {
  id: string;
  title: string;
  featured?: boolean;
  specs: { label: string; value: string }[];
  side: "left" | "right";
}) {
  return (
    <BranchSign side={side} labelledBy={id}>
      <div
        className={`flex items-center gap-2 border-b-2 bg-wood-dark px-4 py-2.5 ${
          featured ? "border-accent" : OUTLINE
        }`}
      >
        <Cpu
          className={`h-4 w-4 shrink-0 ${featured ? "text-accent" : "text-parchment-dim"}`}
          aria-hidden="true"
        />
        <h3
          id={id}
          className={`text-sm font-black uppercase tracking-[0.2em] ${
            featured ? "text-accent" : "text-parchment"
          }`}
        >
          {title}
        </h3>
      </div>
      {/* Scratched rows rather than a boxed table: every other line sunk one
          step, so the eye tracks across without a grid of borders. */}
      <dl>
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex min-w-0 flex-col gap-0.5 border-b-2 border-black/35 px-4 py-2.5 last:border-b-0 odd:bg-black/25 sm:flex-row sm:items-baseline sm:gap-3"
          >
            <dt className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-parchment-dim sm:w-20">
              {spec.label}
            </dt>
            <dd className="min-w-0 break-words text-sm text-parchment">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </BranchSign>
  );
}

export default function DownloadPage() {
  const Icon = DOWNLOAD.icon;

  return (
    /* No bottom padding: the trunk runs to the end of the page so its base meets
       the footer's turf strip, which overhangs the seam by 16px. */
    <div className="min-h-dvh pt-[88px] md:pt-[112px]">
      {/* The crown. Foliage courses stepping out to a wide slab that carries the
          title plate, then stepping back in — the canopy is the page header, so
          there is no separate banner above the tree. */}
      <header className="px-4 pt-6 md:pt-10">
        <div className="mx-auto flex w-full max-w-[64rem] flex-col items-center">
          <div className="flex w-full flex-col items-center" aria-hidden="true">
            <Leaf w="w-[22%]" h="h-4" fill="bg-grass-lit" />
            <Leaf w="w-[46%]" h="h-4" fill="bg-grass" />
            <Leaf w="w-[72%]" h="h-5" fill="bg-grass" />
          </div>

          {/* The widest course, with the plate nailed into it. */}
          <div
            className={`flex w-full justify-center border-2 ${OUTLINE} bg-heraldry-pine ${LEAVES} px-4 py-6 shadow-lg md:py-8`}
          >
            <div className="parchment inline-block max-w-full border-2 border-wood-dark px-5 py-3 text-center text-on-parchment shadow-[inset_0_0_0_2px_rgb(0_0_0_/_0.12)] md:px-8 md:py-4">
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em]">
                <Sprout className="h-3 w-3" aria-hidden="true" />
                Get the Game
              </p>

              <h1 className="text-lg font-bold leading-tight sm:text-xl md:text-2xl">
                Download Mystic Journey
              </h1>

              <p className="mx-auto max-w-[46ch] text-[11px] leading-snug text-on-parchment/85 sm:text-xs">
                Windows PC · {DOWNLOAD.version} · released {DOWNLOAD.releaseDate}.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center" aria-hidden="true">
            <Leaf w="w-[78%]" h="h-5" fill="bg-heraldry-pine" />
            <Leaf w="w-[52%]" h="h-4" fill="bg-heraldry-pine" />
            <Leaf w="w-[28%]" h="h-4" fill="bg-heraldry-pine" />
          </div>
        </div>
      </header>

      {/* Trunk and everything hung on it. The trunk is one absolute course down
          the centre, so the rows below can sit on either side of it without
          knowing it is there. */}
      <div className="relative mx-auto w-full max-w-[1000px] px-4 pt-6 md:px-6 md:pt-10">
        <span
          className={`pointer-events-none absolute inset-y-0 left-1/2 -ml-5 w-10 border-x-2 ${OUTLINE} bg-wood ${BARK} shadow-[inset_3px_0_0_var(--color-wood-light),inset_-3px_0_0_var(--color-wood-dark)] md:-ml-7 md:w-14`}
          aria-hidden="true"
        />

        <div className="relative space-y-10 md:space-y-14">
          <BranchSign side="right" labelledBy="client">
            <div className="flex items-center gap-3 border-b-2 border-black/60 bg-wood-dark px-4 py-2.5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center border-2 ${OUTLINE} bg-wood-light text-parchment shadow-[inset_2px_2px_0_rgb(255_255_255_/_0.12)]`}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2
                  id="client"
                  className="text-sm font-black uppercase tracking-[0.2em] text-parchment"
                >
                  {DOWNLOAD.platform}
                </h2>
                <p className="text-xs text-parchment-dim">
                  {DOWNLOAD.version} · {DOWNLOAD.size} · {DOWNLOAD.releaseDate}
                </p>
              </div>
            </div>

            <ul className="space-y-1.5 p-4">
              {DOWNLOAD.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-parchment-dim">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-grass-lit" aria-hidden="true" />
                  {req}
                </li>
              ))}
            </ul>
          </BranchSign>

          {/* The fruit: the installer, growing off the trunk in the middle of the
              page. Stepped courses give it a round-enough silhouette without a
              single curve, and its core is dark so the button's own white copy
              still reads on it. The one gold thing on the page. */}
          <div className="relative flex justify-center">
            <div className="flex w-full max-w-[20rem] flex-col items-center">
              {/* Stalk and leaf, joining it to the trunk above. */}
              <span
                className={`h-7 w-2.5 border-x-2 ${OUTLINE} bg-wood-dark`}
                aria-hidden="true"
              />
              <span className="-mt-4 mb-1 self-center pl-10" aria-hidden="true">
                <Sprout className="h-5 w-5 text-grass-lit" />
              </span>

              <span
                className={`h-3 w-[38%] border-x-2 border-t-2 ${OUTLINE} bg-accent-deep`}
                aria-hidden="true"
              />
              <span
                className={`h-3 w-[72%] border-x-2 border-t-2 ${OUTLINE} bg-accent-deep`}
                aria-hidden="true"
              />

              <div
                className={`w-full border-2 ${OUTLINE} bg-accent px-4 py-5 shadow-[inset_3px_3px_0_rgb(255_255_255_/_0.22),inset_-3px_-3px_0_rgb(0_0_0_/_0.20)]`}
              >
                <p className="mb-3 text-center text-[11px] font-black uppercase tracking-[0.25em] text-on-accent">
                  Pick the fruit
                </p>
                <div
                  className={`flex justify-center border-2 ${OUTLINE} bg-stone px-3 py-4 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.45)]`}
                >
                  <DownloadButton
                    href={DOWNLOAD.href}
                    idleLabel="Download"
                    doneLabel="Open"
                    download
                  />
                </div>
              </div>

              <span
                className={`h-3 w-[72%] border-x-2 border-b-2 ${OUTLINE} bg-accent-deep`}
                aria-hidden="true"
              />
              <span
                className={`h-3 w-[38%] border-x-2 border-b-2 ${OUTLINE} bg-accent-deep`}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* A plaque nailed to the trunk, so the two spec signs below it read as
              one pair rather than two more unrelated boards. */}
          <div className="relative flex justify-center">
            <h2
              id="sysreq"
              className={`parchment border-2 border-wood-dark px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.2em] text-on-parchment shadow-[inset_0_0_0_2px_rgb(0_0_0_/_0.12)]`}
            >
              System Requirements
            </h2>
          </div>

          <RequirementSign
            side="left"
            id="req-min"
            title="Minimum"
            specs={SYSTEM_REQUIREMENTS.minimum}
          />
          <RequirementSign
            side="right"
            id="req-rec"
            title="Recommended"
            featured
            specs={SYSTEM_REQUIREMENTS.recommended}
          />
        </div>

        {/* The base flaring out into roots. The footer's turf strip overhangs the
            last course, so the tree stands in the ground rather than stopping
            above it. */}
        <div className="flex flex-col items-center pt-12 md:pt-16" aria-hidden="true">
          <span
            className={`h-4 w-16 border-x-2 ${OUTLINE} bg-wood shadow-[inset_3px_0_0_var(--color-wood-light),inset_-3px_0_0_var(--color-wood-dark)]`}
          />
          <span
            className={`h-4 w-36 border-x-2 border-t-2 ${OUTLINE} bg-wood ${BARK} shadow-[inset_3px_0_0_var(--color-wood-light)]`}
          />
          <span className={`h-5 w-64 border-x-2 border-t-2 ${OUTLINE} bg-wood-dark ${BARK}`} />
        </div>
      </div>
    </div>
  );
}
