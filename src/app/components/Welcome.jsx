import {Inter} from "next/font/google";

const inter = Inter({subsets: ["latin"]});

export default function Welcome({className}) {
  return (
    <main className={`flex min-h-screen flex-col bg-custom-gradient text-[var(--text-color)] ${inter.className}`}>
      {/* Hero Section */}
      <section className={`flex-1 flex flex-col items-start justify-center text-left px-8 lg:px-24 lg:ml-52 lg:mt-40 ${className}`}>
        {/* Intro Text */}
        <span className="block text-xl lg:text-4xl font-mono font-semibold">
          {Array.from("Helloworld I'm").map((letter, index) => (
            <span key={index} className="hover:text-[#41e4fd] transition-colors">
              {letter}
            </span>
          ))}
        </span>

        <h1 className="text-5xl lg:text-7xl font-mono font-bold">
          <span
            className="block mt-4 text-transparent bg-clip-text bg-[200%_auto] bg-gradient-to-r from-[#41e4fd] via-[#b2a8fd] to-[#8678f9] animate-text-gradient"
          >
            {Array.from("Wai Yan.").map((letter, index) => (
              <span key={index} className="hover:text-[#41e4fd] transition-colors ">
                {letter}
              </span>
            ))}
          </span>

          <span className="block mt-4 text-6xl lg:text-7xl text-[var(--text-color)]">
            {Array.from("Fullstack Developer").map((letter, index) => (
              <span key={index} className="hover:text-[#41e4fd] transition-colors">
                {letter}
              </span>
            ))}
          </span>
        </h1>

        <p className="mt-12 max-w-3xl text-md lg:text-lg text-[var(--text-color)]">Web Developer with experience in Digital Concept Arts, Frontend Web Designs. I love fun Web UI, collaboration, and making products.</p>
        <p className="mt-4 max-w-3xl text-md lg:text-lg text-[var(--text-color)]">I value simple content structure, clean design patterns, and thoughtful interactions.</p>
        {/* Call to Action */}
        <div className="mt-10 flex items-center space-x-6">
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-[var(--text-color)] font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform">Let’s Talk!</button>
        </div>
      </section>
    </main>
  );
}
