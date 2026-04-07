import Image from "next/image";

export default function FloatingCoffeeButton({ href }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="floating-coffee-button"
      aria-label="Buy me a coffee"
      title="Buy me a coffee"
    >
      <Image src="/coffee-logo.png" alt="Buy me a coffee" width={34} height={34} />
    </a>
  );
}
