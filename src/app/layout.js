import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wai Yan's Portfoilio",
  description: "NextJS app",

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}> <ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
