export function HeaderComponent({
  heading = "KoinSight",
  description = "Ready to check your crypto portfolio's health? Sign up now to get started.",
  buttons = [
    { title: "Get Started", onClick: null, variant: "primary" },
    { title: "Learn More", href: "#features", variant: "secondary" },
  ],
}) {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 md:p-16">
          <div className="max-w-lg mx-auto text-center">
            <h2 className=" text-center mb-5 text-2xl font-bold text-white md:mb-6 md:text-4xl lg:text-6xl">
              {heading}
            </h2>
            <p className="text-lg text-neutral-400">{description}</p>
            <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
              {buttons.map((button, index) =>
                button.variant === "primary" ? (
                  <button
                    key={index}
                    onClick={button.onClick}
                    className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition cursor-pointer"
                  >
                    {button.title}
                  </button>
                ) : (
                  <a
                    key={index}
                    href={button.href || "#"}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition"
                  >
                    {button.title}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
