import React from "react";
import AuthInfoBanner from "./AuthInfoBanner";

const AuthSplitLayout = ({ children }) => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-5 sm:px-4 sm:py-6 lg:min-h-[calc(100vh-2.5rem)] lg:flex-row lg:items-stretch lg:gap-8 lg:py-8">
      <section className="hidden lg:block lg:w-7/12">
        <AuthInfoBanner />
      </section>

      <section className="flex flex-col gap-4 lg:w-5/12 lg:items-center lg:justify-center">
        <div className="w-full px-1 text-center lg:hidden">
          <h1 className="text-2xl font-extrabold tracking-tight text-cyan-300">BioVault</h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">
            Secure biomedical data portal for upload, review, and governance.
          </p>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  );
};

export default AuthSplitLayout;