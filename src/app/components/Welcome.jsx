
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Welcome({className}) {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg-color)] text-[var(--text-color)]">
      {/* Hero Section */}
      <section className={`flex-1 flex flex-col items-start justify-center text-left px-6 lg:px-24 ${className}`}>
        <h1 className="text-5xl lg:text-7xl font-extrabold">
          <span className="block">
            {Array.from("Helloworld I'm").map((letter, index) => (
              <span key={index} className="hover:text-red-500 transition-colors">
                {letter}
              </span>
            ))}
          </span>
          <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            {Array.from("RedX.").map((letter, index) => (
              <span key={index} className="hover:text-red-500 transition-colors">
                {letter}
              </span>
            ))}
          </span>
          <span className="block mt-4 text-6xl lg:text-7xl">
            {Array.from("Fullstack Engineer").map((letter, index) => (
              <span key={index} className="hover:text-red-500 transition-colors">
                {letter}
              </span>
            ))}
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          Web Developer with experience in Digital Concept Arts, Frontend Web Designs. I love fun Web UI, collaboration, and making products. I value simple content structure, clean design patterns, and thoughtful interactions.
        </p>
        <div className="mt-10 flex items-center space-x-6">
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform">
            Let’s Talk!
          </button>
        </div>
      </section>
    </main>
  );
}
