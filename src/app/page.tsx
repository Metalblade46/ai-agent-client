import { features } from "@/config";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-transparent flex justify-center items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
      <section className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center space-y-10 text-center">
        <header className="space-y-6">
          <h1 className="text-5xl tracking-tight font-bold text-gray-900 sm:text-7xl bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 bg-clip-text text-transparent">
            Welcome to Agentos!
          </h1>
          <p className="max-w-[800px] text-lg text-gray-600 md:text-xl/relaxed lg:text-2xl/relaxed">
            Your Own AI-Agent that helps you with various tasks, from
            researching and writing articles to planning and executing projects.
          </p>
        </header>
        <SignedIn>
          <Link href={"/dashboard"}>
            <button
              className=" group relative inline-flex items-center justify-center
        px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-blue-900 to-blue-800 rounded-full
        hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:translate-y-0.5"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 " />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-900/20 to-blue-800/20 blur-xl opacity-5 grop-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={"/dashboard"}
            forceRedirectUrl={"/dashboard"}
          >
            <button
              className=" group relative inline-flex items-center justify-center
        px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-blue-900 to-blue-800 rounded-full
        hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:translate-y-0.5"
            >
              Sign Up
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 " />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-900/20 to-blue-800/20 blur-xl opacity-5 grop-hover:opacity-100 transition-opacity" />
            </button>
          </SignInButton>
        </SignedOut>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-8 max-w-3xl mx-auto">
          {features.map(({title,description})=>(
            <div key={title} className="text-center">
              <h2 className="text-2xl font-semibold text-blue-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          )

          )}
        </div>
      </section>
    </main>
  );
}
