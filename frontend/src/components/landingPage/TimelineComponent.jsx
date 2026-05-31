import React from "react";
import { Timeline } from "@/components/ui/timeline";
import projectTracking from "../assets/p3-project-tracking.jpg";
import p3CodingTerminal from "../assets/p3-coding-terminal.png";
import projectInitialPlanning from "../assets/p3-initial-planning.jpg";

export function TimelineComponent() {
  const data = [
    {
      title: "Phase 1",
      content: (
        <div>
          <p className="mb-2 text-xl font-semibold text-neutral-200">
            Planning & Ideation
          </p>
          <p className="mb-6 text-lg text-neutral-400">
            The team aligned on building a crypto portfolio tracker — a tool we
            genuinely wanted to use ourselves. We kicked off with a planning
            session to scope features, assign roles, and define our MVP.
          </p>
          <div className="mb-6 flex flex-col gap-2 text-lg text-neutral-300">
            <div>
              📋 Mapped out feature ideas and user stories on GitHub Projects
            </div>
            <div>
              🎨 Wireframed key pages: portfolio overview, transaction log, and
              asset detail
            </div>
            <div>
              🗂️ Structured the monorepo with separate frontend and backend
              folders
            </div>
            <div>
              ✅ Agreed on core MVP: auth, transaction CRUD, live price data,
              and portfolio calculations
            </div>
          </div>
          <div className="flex-col">
            <div className="flex border border-neutral-700 rounded-lg p-1 mb-4">
              <img
                src={projectInitialPlanning}
                alt="project-initial-planning"
                width={500}
                height={500}
                className="h-40 w-full rounded-lg object-fit md:h-80 lg:h-96"
              />
            </div>
            <div className="flex border border-neutral-700 rounded-lg p-1 mb-4">
              <img
                src={projectTracking}
                alt="project-tracking"
                width={500}
                height={500}
                className="h-40 w-full rounded-lg object-fit md:h-80 lg:h-96"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Phase 2",
      content: (
        <div>
          <p className="mb-2 text-xl font-semibold text-neutral-200">
            Building the Stack
          </p>
          <p className="mb-6 text-lg text-neutral-400">
            With the plan in hand, we got to work. The backend came together
            first — Express routes, MongoDB models, and JWT auth. Then we
            layered in the frontend, wiring everything up with React and Vite.
          </p>
          <div className="mb-6 flex flex-col gap-2 text-lg text-neutral-300">
            <div>
              🔧 Set up Express server with RESTful routes for auth, assets, and
              transactions
            </div>
            <div>
              🗄️ Modelled MongoDB schemas for users, portfolios, and coin
              transactions
            </div>
            <div>
              🔐 Implemented JWT-based authentication with protected routes
            </div>
            <div>
              📈 Integrated CoinGecko API for live crypto prices with scheduled
              cron jobs
            </div>
            <div>
              ⚛️ Built the React frontend with Vite, Tailwind CSS, and Flowbite
              components
            </div>
            <div>
              ✨ Added motion and glassmorphism UI using Aceternity UI and
              ReactBits
            </div>
          </div>
          <div className="mb-6">
            <p className="mb-4 text-sm uppercase tracking-widest text-neutral-500">Tech Stack</p>
            <div className="flex flex-wrap gap-6">
              {[
                { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" },
                { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
                { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
                { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invert: true },
                { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
              ].map((tech) => (
                <div key={tech.name} className="flex flex-col items-center gap-2">
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="h-10 w-10"
                    style={tech.invert ? { filter: "brightness(0) invert(1)" } : {}}
                  />
                  <span className="text-sm text-neutral-400">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-col gap-4 flex border border-neutral-700 rounded-lg p-1">
            <img
              src={p3CodingTerminal}
              alt="project-tracking"
              width={500}
              height={500}
              className="h-40 w-full rounded-lg object-fit md:h-80 lg:h-96"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Phase 3",
      content: (
        <div>
          <p className="mb-2 text-xl font-semibold text-neutral-200">
            Outcomes & Lessons
          </p>
          <p className="mb-6 text-lg text-neutral-400">
            We shipped a working crypto portfolio tracker with live prices, full
            transaction CRUD, and a polished landing page. Along the way, we hit
            real-world engineering challenges that sharpened our skills.
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              ✅ Portfolio overview with live CoinGecko price data
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              ✅ Transaction log with add, edit, and delete flows
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              ✅ Asset detail page with filtered transactions per coin
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              ⚠️ Debugged 429 rate limiting caused by React StrictMode
              double-firing effects in dev
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              ⚠️ Resolved repeated git merge conflicts across feature branches
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              ⚠️ Traced Vite asset import issues — relative paths in JSX don't
              work, must import assets as modules
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Stretch Goals",
      content: (
        <div>
          <p className="mb-2 text-xl font-semibold text-neutral-200">
            What's Next
          </p>
          <p className="mb-6 text-lg text-neutral-400">
            With the MVP complete, these are features we'd love to build next to
            make KoinSight even more useful for everyday crypto investors.
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              🔄 Real-time price updates via WebSockets or polling — no more
              manual refreshes
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              💱 Multi-currency support — toggle between USD, SGD, and other
              fiat currencies
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              📊 Portfolio performance chart — visualise gains and losses over
              time
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              🔔 Price alerts — notify users when a coin hits a target price
            </div>
            <div className="flex items-center gap-2 text-lg text-neutral-300">
              📱 Mobile-responsive polish — optimised experience for smaller
              screens
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip mt-32">
      <Timeline data={data} />
    </div>
  );
}
