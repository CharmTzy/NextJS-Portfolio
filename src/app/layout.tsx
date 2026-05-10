import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FloatingCoffeeButton from "./components/FloatingCoffeeButton";
import { ThemeProvider } from "./components/theme-provider";
import { personalInfo } from "./data/portfolio";
import { coffeeButtonContent, siteMetadata } from "./data/site-content";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={jetbrainsMono.variable}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {children}
          <FloatingCoffeeButton
            href={personalInfo.buyMeACoffeeUrl}
            label={coffeeButtonContent.ariaLabel}
            title={coffeeButtonContent.title}
            imageAlt={coffeeButtonContent.imageAlt}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
