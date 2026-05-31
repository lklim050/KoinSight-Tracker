import ericTanProfileImg from "../../assets/eric-tan-profile-img.png";
import lincolnImg from "../../assets/LK-cartoon-2026_2.PNG";
import kennethProfileImg from "../../assets/azuki-nft-411.jpg";
import DecryptedText from "../ui/DecryptedText.jsx";

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 6.798c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const teamMembers = [
  {
    image: {
      src: ericTanProfileImg,
      alt: "Eric Tan",
    },
    name: "Eric Tan",
    jobTitle: "UX Engineer",
    description:
      "Focused on the frontend, crafting the landing page, portfolio dashboard, and features with React and Tailwind CSS.",
    socialLinks: [
      {
        href: "https://www.linkedin.com/in/ericistan/",
        icon: <LinkedinIcon />,
      },
      { href: "https://github.com/ericistan", icon: <GithubIcon /> },
    ],
  },
  {
    image: {
      src: lincolnImg,
      alt: "Lincoln",
    },
    name: "Lincoln",
    jobTitle: "Full Stack Developer/Engineer",
    description:
      "Focused on backend architecture, API integration, and bringing the portfolio data layer to life.",
    socialLinks: [
      {
        href: "https://www.linkedin.com/in/leng-khoon-lim/",
        icon: <LinkedinIcon />,
      },
      { href: "https://github.com/lklim050", icon: <GithubIcon /> },
    ],
  },
  {
    image: {
      src: kennethProfileImg,
      alt: "Kenneth",
    },
    name: "Kenneth",
    jobTitle: "Full Stack Developer",
    description:
      "Versatile contributor across the stack, helping with both frontend transaction logic and backend functionality to ensure a seamless user experience.",
    socialLinks: [
      { href: "#", icon: <LinkedinIcon /> },
      { href: "#", icon: <GithubIcon /> },
    ],
  },
];

function TeamMemberCard({ member }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 size-40 overflow-hidden rounded-full border border-white/10 md:mb-6 md:size-48">
        <img
          src={member.image.src}
          alt={member.image.alt}
          className="size-full object-cover"
        />
      </div>
      <div className="mb-3 md:mb-4">
        <h5 className="text-lg font-semibold text-white">{member.name}</h5>
        <p className="text-sm text-neutral-400">{member.jobTitle}</p>
      </div>
      <p className="text-base text-neutral-400">{member.description}</p>
      <div className="mt-5 flex gap-3">
        {member.socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 transition hover:text-white"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

export function TeamComponent() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-24">
      <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-neutral-500">
          The Team
        </p>
        <h2 className="mb-5 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          <DecryptedText
            text="Devs Behind KoinSight"
            animateOn="view"
            sequential={true}
            revealDirection="start"
            speed={30}
            className="text-white"
            encryptedClassName="text-neutral-500"
          />
        </h2>
        <p className="text-lg text-neutral-400">
          A team of three General Assembly bootcamp students who built this
          project under two weeks and learned the value of collaboration,
          teamwork, and resolving conflict merges.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3 md:gap-y-16">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>
    </section>
  );
}
