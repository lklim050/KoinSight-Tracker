import { useNavigate } from "react-router-dom";
import DecryptedText from "../components/ui/DecryptedText.jsx";
import BorderGlow from "../components/landingPage/BorderGlow.jsx";
import { LandingPageFeatureComponent } from "../components/landingPage/LandingPageFeatureComponent.jsx";
import { ScrollingLogoComponent } from "../components/landingPage/ScrollingLogoComponent.jsx";
import { TimelineComponent } from "../components/landingPage/TimelineComponent.jsx";
import { TeamComponent } from "../components/landingPage/TeamComponent.jsx";
import { HeaderComponent } from "../components/landingPage/HeaderComponent.jsx";
import { FooterComponent } from "../components/landingPage/FooterComponent.jsx";
const LandingPage = ({ setShowAuthModal }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen text-white">
        {/* ── Hero ── */}
        <section className="px-[5%] pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Top row — heading left, description + buttons right */}
            <div className="max-w-2xl mx-auto mb-12 flex flex-col gap-y-5 text-center lg:mb-20">
              <h1 className="text-5xl font-bold leading-tight md:text-4xl lg:text-5xl text-white">
                <DecryptedText
                  text="Track your crypto with ease"
                  animateOn="view"
                  sequential={true}
                  revealDirection="start"
                  speed={40}
                  className="text-white"
                  encryptedClassName="text-neutral-500"
                />
              </h1>
              <p className="text-gray-400 text-lg">
                Monitor your holdings, log every transaction, and understand
                your performance, all in one place with KoinSight.
              </p>

              <div>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Full-width image below */}
            <div>
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#ffffff1c"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated
                colors={["#c084fc", "#f472b6", "#38bdf8"]}
              >
                <div style={{ padding: "0.5rem" }}>
                  <img
                    src="../src/assets/koin-sight_detail-page.jpg"
                    alt="Portfolio dashboard preview"
                    className="w-full object-cover rounded-2xl drop-shadow-2xl"
                  />
                </div>
              </BorderGlow>
            </div>
          </div>
        </section>

        <ScrollingLogoComponent heading="Track 250+ cryptocurrencies" />

        <section className="px-[5%] py-16 md:py-24 lg:py-24">
          <div className="max-w-2xl mx-auto mb-12 flex flex-col gap-y-5 text-center lg:mb-10">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl text-white">
              <DecryptedText
                text="Features"
                animateOn="view"
                sequential={true}
                revealDirection="start"
                speed={40}
                className="text-white"
                encryptedClassName="text-neutral-500"
              />
            </h2>
            <p className="text-gray-400 text-lg"></p>
          </div>
          <LandingPageFeatureComponent />
        </section>

        <section className="px-[5%] py-16 md:py-24 lg:py-24">
          <TimelineComponent />
        </section>

        <TeamComponent />

        <HeaderComponent
          buttons={[
            {
              title: "Get Started",
              onClick: () => setShowAuthModal(true),
              variant: "primary",
            },
            {
              title: "View GitHub",
              href: "https://github.com/ericistan/GA-P3",
              variant: "secondary",
            },
          ]}
        />

        <FooterComponent />
      </div>
    </>
  );
};

export default LandingPage;
