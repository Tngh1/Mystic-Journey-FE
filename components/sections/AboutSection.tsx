const ABOUT_CONTENT = {
  title: "About",
  description:
    "Immerse yourself in Chumbi Valley; an enchanting and mystical play-to-earn blockchain game with intriguing and adorable NFT creatures known as Chumbi. Explore the unchartered forest, start a farm, grow crops and craft special items with your Chumbi companions by your side, while earning crypto rewards.",
};

export default function AboutSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12 sm:gap-6">
          <div className="hidden max-w-55 flex-1 items-center gap-2.5 sm:flex">
            <span className="h-px flex-1 bg-linear-to-r from-transparent via-white/45 to-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            <span className="h-3 w-3 rounded-full bg-white" />
          </div>

          <h2 className="text-center text-4xl font-bold leading-none tracking-[0.02em] text-white sm:text-5xl lg:text-6xl">
            {ABOUT_CONTENT.title}
          </h2>

          <div className="hidden max-w-55 flex-1 items-center gap-2.5 sm:flex">
            <span className="h-3 w-3 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            <span className="h-px flex-1 bg-linear-to-l from-transparent via-white/45 to-white/20" />
          </div>
        </div>

        <p className="mx-auto max-w-4xl px-2 text-center text-base leading-[1.9] tracking-wide text-white/92 sm:text-lg md:text-xl">
          {ABOUT_CONTENT.description}
        </p>
      </div>
    </section>
  );
}
