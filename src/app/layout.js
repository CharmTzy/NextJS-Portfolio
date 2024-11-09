import {Inter} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "./components/theme-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Wai Yan's Portfoilio",
  description: "NextJS app",
};

export default function RootLayout({children}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
