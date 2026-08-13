import React from "react";

const highlights = [
  "Secure biomedical dataset vault with role-based access",
  "Fast uploads, audit tracking, and reviewer workflows",
  "Built for researchers, reviewers, and data governance teams",
];

const AuthInfoBanner = () => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-slate-900/20 p-8 lg:p-10">
      <div className="absolute -top-20 -left-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <p className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            About BioVault
          </p>

          <h1 className="mt-5 text-3xl font-black leading-tight text-white lg:text-5xl">
            Protecting Biomedical Data with Trusted Intelligence
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 lg:text-base">
            BioVault is a secure data portal for biomedical teams to upload,
            validate, review, and monitor sensitive research datasets in one
            unified platform.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
              <p className="text-sm text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthInfoBanner;