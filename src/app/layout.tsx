import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./styles/foundations.css";
import "./styles/navigation.css";
import "./styles/resume-viewer.css";
import "./styles/hero.css";
import "./styles/skills-experience.css";
import "./styles/projects.css";
import "./styles/contact.css";
import "./styles/project-detail.css";
import "./styles/responsive.css";
import FloatingCoffeeButton from "./components/FloatingCoffeeButton";
import SiteBackground from "./components/SiteBackground";
import { ThemeProvider } from "./components/theme-provider";
import { personalInfo } from "./data/portfolio";
import { coffeeButtonContent, siteMetadata } from "./data/site-content";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <SiteBackground />
          {children}
          <FloatingCoffeeButton
            href={personalInfo.buyMeACoffeeUrl}
            label={coffeeButtonContent.ariaLabel}
            title={coffeeButtonContent.title}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
