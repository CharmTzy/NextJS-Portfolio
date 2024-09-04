import Navbar from "./components/NavBar";
import Welcome from "./components/Welcome";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col slide-up">
      <link rel="icon" href="/profile-pic.png" type="image/png" sizes="any" />
      <Navbar className="slide-up-navbar" /> 
      <Welcome className="slide-up-welcome" /> 
    </main>
  );
}
