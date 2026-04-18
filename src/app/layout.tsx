import { JetBrains_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import FloatingCoffeeButton from "./components/FloatingCoffeeButton";
import { ThemeProvider } from "./components/theme-provider";
import { personalInfo } from "./data/portfolio";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});


export const metadata = {
  title: "Wai Yan — AI Engineer",
  description:
    "Portfolio of Wai Yan, a Singapore-based AI engineer building modern interfaces, practical software, and GitHub-backed projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable}`}
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
