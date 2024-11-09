import Navbar from "./components/NavBar";
import Welcome from "./pages/Welcome";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <link rel="icon" href="/profile-pic.png" type="image/png" sizes="any" />
      <Navbar className="slide-up" /> 
      <Welcome className="slide-up" />
    </main>
  );
}