import Navbar from "./components/NavBar";
import Welcome from "./pages/Welcome";
import "./globals.css";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <Navbar className="slide-up" />
      <Welcome className="slide-up" />
    </main>
  );
}
