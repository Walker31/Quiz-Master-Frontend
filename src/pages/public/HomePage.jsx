import { NavLink } from "react-router-dom";
import heroImg from "@/assets/hero.png";

const features = [
  {
    title: "Smart quiz experiences",
    description: "Create engaging quizzes with clean layouts, timers, and instant feedback.",
  },
  {
    title: "Progress tracking",
    description: "Keep an eye on performance with simple analytics and score summaries.",
  },
  {
    title: "Fast and responsive",
    description: "Built for mobile and desktop so learners can jump in from anywhere.",
  },
];

function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="space-y-8">
          <span className="theme-badge inline-flex items-center rounded-full px-4 py-2 text-sm font-medium">
            Modern quiz platform for students and teams
          </span>

          <div className="space-y-4">
            <h1 className="theme-heading max-w-xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Build better quizzes and keep learners coming back.
            </h1>
            <p className="theme-text-secondary max-w-2xl text-lg leading-8">
              QuizMaster gives you a polished place to host quizzes, review results, and guide every learner through a smooth, engaging experience.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <NavLink
              to="/login"
              className="theme-btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm"
            >
              Get started
            </NavLink>
            <a
              href="#features"
              className="theme-card inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold theme-text"
            >
              Explore features
            </a>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4">
            {[
              ["100+", "Question types"],
              ["24/7", "Availability"],
              ["99%", "Smooth experience"],
            ].map(([value, label]) => (
              <div key={label} className="theme-card rounded-3xl p-4 text-center">
                <p className="theme-heading text-2xl font-black">{value}</p>
                <p className="theme-text-muted mt-1 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-emerald-500/25 via-teal-500/15 to-cyan-500/25 blur-3xl" />
          <div className="theme-card overflow-hidden rounded-4xl p-4 shadow-2xl backdrop-blur">
            <img
              src={heroImg}
              alt="QuizMaster preview"
              className="h-full w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-accent)' }}>
            Features
          </p>
          <h2 className="theme-heading text-3xl font-bold sm:text-4xl">
            Everything needed for a modern quiz landing page.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="theme-card rounded-3xl p-6 transition hover:-translate-y-1"
            >
              <div className="mb-4 h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-600" />
              <h3 className="theme-heading text-xl font-bold">{feature.title}</h3>
              <p className="theme-text-secondary mt-3 leading-7">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
