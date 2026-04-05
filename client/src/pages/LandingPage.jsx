import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Create Profile',
      subtitle: 'Level 1',
      description: 'Sign up once with your core details and unlock your personal print dashboard.',
      accent: 'from-teal-500 to-cyan-500',
    },
    {
      title: 'Drop Files + Settings',
      subtitle: 'Level 2',
      description: 'Upload one or more files, choose copies, print type, and optional notes in one flow.',
      accent: 'from-sky-500 to-blue-600',
    },
    {
      title: 'Track + Collect',
      subtitle: 'Level 3',
      description: 'Follow status updates from queue to delivered and collect right when it is ready.',
      accent: 'from-amber-500 to-orange-500',
    },
  ];

  const features = [
    {
      title: 'Mission Feed',
      detail: 'All your files, copies, and statuses in a single timeline view.',
      emoji: '🛰️',
    },
    {
      title: 'Turbo Upload',
      detail: 'Upload multiple files together with per-file controls.',
      emoji: '⚡',
    },
    {
      title: 'Smart Tracking',
      detail: 'Clear status badges: In Queue, Printing, Ready, Delivered.',
      emoji: '🎯',
    },
    {
      title: 'Pocket Friendly',
      detail: 'Built for phones first with easy tap zones and cleaner forms.',
      emoji: '📱',
    },
    {
      title: 'Admin Command Mode',
      detail: 'Admin dashboard with status controls and delivered cleanup action.',
      emoji: '🛠️',
    },
    {
      title: 'Always In Flow',
      detail: 'Fast interactions and smooth transitions from upload to pickup.',
      emoji: '🏁',
    },
  ];

  return (
    <div className="app-shell">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 frost-panel">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-[74px]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
                <img
                  src="/logo.svg"
                  alt="SmartXerox logo"
                  className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 sm:text-xl">SmartXerox</h1>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Campus Print Quest</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => navigate('/login')} className="btn btn-ghost px-3 py-2 text-xs sm:text-sm">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-primary px-4 py-2 text-xs sm:text-sm">
                Start Quest
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pb-10 pt-8 sm:pb-14 sm:pt-12">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="animate-rise">
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 xs:text-4xl sm:text-5xl lg:text-6xl">
                Print Faster,
                <br />
                <span className="gradient-text">Move Smarter</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 xs:text-base sm:text-lg">
                SmartXerox turns document printing into a smooth mission flow. Upload from mobile, tune each file, track progress, and pick up with confidence.
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <button onClick={() => navigate('/register')} className="btn btn-primary w-full sm:w-auto">
                  Create Student Account
                </button>
                <button
                  onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Explore Journey
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2.5 sm:max-w-xl sm:gap-3.5">
                <div className="card p-3 text-center sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Speed</p>
                  <p className="mt-1 text-lg font-extrabold text-brand sm:text-xl">2 min</p>
                </div>
                <div className="card p-3 text-center sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Flow</p>
                  <p className="mt-1 text-lg font-extrabold text-highlight sm:text-xl">3 Steps</p>
                </div>
                <div className="card p-3 text-center sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rating</p>
                  <p className="mt-1 text-lg font-extrabold text-amber-600 sm:text-xl">4.9</p>
                </div>
              </div>
            </div>

            <div className="card animate-float relative overflow-hidden p-4 sm:p-6">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-100 blur-xl" />
              <div className="absolute -bottom-10 left-0 h-28 w-28 rounded-full bg-sky-100 blur-xl" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Live Mission Board</p>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-2xl">Today&apos;s Print Queue</h3>

                <div className="mt-4 space-y-2.5">
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-700">Assignment_4.pdf</p>
                      <span className="status-pill border-slate-200 bg-slate-50 text-slate-700">In Queue</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">5 copies • B&W • Submitted 10:24 AM</p>
                  </div>

                  <div className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-700">Lab_Report.pdf</p>
                      <span className="status-pill border-sky-200 bg-white text-sky-700">Printing</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">2 copies • Color • Submitted 09:58 AM</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-700">Project_Summary.pdf</p>
                      <span className="status-pill border-emerald-200 bg-white text-emerald-700">Ready</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">1 copy • B&W • Collect now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center sm:mb-10">
            <h3 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">Your 3-Level Print Journey</h3>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">Designed for quick completion on mobile without losing control.</p>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="card hover-lift p-4 sm:p-5">
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-r ${step.accent} px-3 py-1 text-xs font-bold uppercase tracking-wider text-white`}>
                  {step.subtitle}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Step {index + 1}</p>
                <h4 className="mt-1 text-lg font-extrabold text-slate-900">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="card p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Fast lane tips</p>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-2xl">Smoothest student workflow</h3>
              </div>
              <button onClick={() => navigate('/login')} className="btn btn-primary w-full sm:w-auto">
                Open My Dashboard
              </button>
            </div>
            <div className="mt-4 grid gap-2.5 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700">1. Keep a clear file name before upload.</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700">2. Set copies and color once per file to avoid errors.</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700">3. Track status and collect once marked Ready.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center sm:mb-10">
            <h3 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">Built To Feel Effortless</h3>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card hover-lift p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl">{feature.emoji}</div>
                  <h4 className="text-base font-extrabold text-slate-900">{feature.title}</h4>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="card overflow-hidden bg-gradient-to-r from-teal-500 via-sky-600 to-blue-700 p-6 text-center text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">Start today</p>
            <h3 className="mt-2 text-2xl font-extrabold sm:text-4xl">Launch Your Print Quest</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              Register, upload, and track everything from your phone in a single, smooth flow.
            </p>

            <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
              <button onClick={() => navigate('/register')} className="btn border border-white/20 bg-white text-sky-700 hover:bg-sky-50">
                Create Account
              </button>
              <button onClick={() => navigate('/login')} className="btn border border-white/35 bg-transparent text-white hover:bg-white/10">
                I Already Have One
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-white/80 py-8">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-900">SmartXerox</p>
              <p className="text-xs text-slate-500">Made for students and print admins.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => navigate('/register')} className="btn btn-ghost px-3 py-2 text-xs">Register</button>
              <button onClick={() => navigate('/login')} className="btn btn-ghost px-3 py-2 text-xs">Login</button>
              <button onClick={() => navigate('/admin')} className="btn btn-ghost px-3 py-2 text-xs">Admin</button>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4 text-center">
            <p className="text-xs text-slate-500">© 2026 SmartXerox. Crafted for smooth student printing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
