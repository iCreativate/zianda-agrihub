import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero section */}
      <section className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.28),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,118,110,0.2),_transparent_55%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center md:py-28 lg:py-32">
          <p className="mb-6 inline-flex items-center rounded-full border border-emerald-400/40 bg-slate-900/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-emerald-200">
            Built for African farmers
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl md:leading-tight">
            Run your{" "}
            <span className="text-emerald-300">livestock, crops and finances</span>{" "}
            from one simple hub.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Zianda Agri-Hub gives you a live picture of your herd, fields and cash flow. Track
            health, plan vaccinations, record costs and scan QR codes in the kraal or in the field –
            even when you are offline.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-emerald-400 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 hover:shadow-xl"
            >
              Register | Login
            </Link>
            <Link
              href="/login?next=%2Fscan"
              className="rounded-full border border-slate-600 bg-slate-900/60 px-8 py-3.5 text-sm font-semibold text-slate-100 shadow-md transition hover:border-emerald-400/60 hover:bg-slate-900"
            >
              Scan an animal or field QR
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Works on your phone, tablet or computer.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl space-y-20 px-6 py-16 md:py-24">
          {/* Why section */}
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Why farmers use Zianda Agri-Hub
              </h2>
              <p className="mt-3 mx-auto max-w-2xl text-sm text-slate-300">
                One place to see your animals, crops, cash and risks – without complicated
                spreadsheets.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <FeaturePill title="Livestock & crops">
                Capture births, weights, planting dates and inputs for every herd and field.
              </FeaturePill>
              <FeaturePill title="Health & vaccines">
                Smart schedules and QR health cards for each animal, so you never miss a treatment.
              </FeaturePill>
              <FeaturePill title="Costs & yield">
                Track feed, labour and medical spend against expected harvest and sales.
              </FeaturePill>
            </div>
          </div>

          {/* What it does */}
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-xl shadow-black/40 md:p-12">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              What Zianda Agri-Hub does for you
            </h2>
            <ul className="mt-8 space-y-5 text-sm text-slate-200 sm:space-y-6">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>
                  <span className="font-semibold text-slate-50">
                    See your whole farm in one place:
                  </span>{" "}
                  a live dashboard of livestock, fields and monthly cash burn.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>
                  <span className="font-semibold text-slate-50">
                    Never miss a vaccine date:
                  </span>{" "}
                  automatic schedules based on each calf&apos;s date of birth and disease
                  requirements.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>
                  <span className="font-semibold text-slate-50">
                    Capture problems with photos:
                  </span>{" "}
                  upload images of sick animals or plants and follow their recovery timeline.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>
                  <span className="font-semibold text-slate-50">
                    Be ready for bank or investor visits:
                  </span>{" "}
                  generate a clean PDF report of herd health and farm costs in one click.
                </span>
              </li>
            </ul>
            <div className="mt-10 grid gap-6 md:grid-cols-[2fr,3fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm">
                <p className="font-semibold text-slate-50">
                  Built for the way farmers really work
                </p>
                <p className="mt-2 leading-relaxed text-slate-300">
                  Zianda Agri-Hub is mobile-first and offline-friendly. Record data in the lands or
                  kraal and it will sync when your device comes back online.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm">
                <p className="font-semibold text-slate-50">
                  Works with QR codes in the field
                </p>
                <p className="mt-2 leading-relaxed text-slate-300">
                  Print health cards with QR codes for animals and crop blocks. Scan them on your
                  phone to jump straight to the right record and update treatments or notes.
                </p>
              </div>
            </div>
          </div>

          {/* How it fits your farm */}
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureBlock
              title="Smallholder & emerging farmers"
              body="Keep simple, reliable records for animals, fields and expenses without needing complex software."
            />
            <FeatureBlock
              title="Commercial operations"
              body="Give your team one place to capture data, monitor risk and prepare compliance reports."
            />
            <FeatureBlock
              title="Advisors & vets"
              body="Use Zianda data during farm visits to track herd health, plan interventions and show impact."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-50">Zianda Agri-Hub</p>
              <p className="text-sm text-slate-300">
                Farm management for livestock, crops, equipment, and finances — built for mobile.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quick links
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/login" className="text-slate-300 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-300 hover:text-white">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login?next=%2Fscan" className="text-slate-300 hover:text-white">
                    Scan QR
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Support
              </p>
              <p className="text-sm text-slate-300">
                Need help setting up your farm? Use the in‑app assistant and keep your records updated for better recommendations.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Zianda Agri-Hub. All rights reserved.</p>
            <p className="text-slate-500">Built for farmers.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

interface FeaturePillProps {
  title: string;
  children: React.ReactNode;
}

function FeaturePill(props: FeaturePillProps) {
  return (
    <div className="rounded-2xl border border-slate-800/40 bg-slate-900/80 p-6 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg">
      <p className="text-sm font-semibold text-slate-50">{props.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        {props.children}
      </p>
    </div>
  );
}

interface FeatureBlockProps {
  title: string;
  body: string;
}

function FeatureBlock({ title, body }: FeatureBlockProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-md shadow-black/40">
      <p className="text-sm font-semibold text-slate-50">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}


