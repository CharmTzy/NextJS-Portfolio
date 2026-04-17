import { Fraunces, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import FloatingCoffeeButton from "./components/FloatingCoffeeButton";
import { ThemeProvider } from "./components/theme-provider";
import { personalInfo } from "./data/portfolio";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["SOFT", "WONK", "opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});


export const metadata = {
  title: "Wai Yan Aung — AI Engineer",
  description:
    "Portfolio of Wai Yan Aung, a Singapore-based AI engineer building modern interfaces, practical software, and GitHub-backed projects.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {children}
          <FloatingCoffeeButton href={personalInfo.buyMeACoffeeUrl} />
        </ThemeProvider>
      </body>
    </html>
  );
}
