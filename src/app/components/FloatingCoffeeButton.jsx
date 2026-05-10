import Image from "next/image";

export default function FloatingCoffeeButton({ href, label, title, imageAlt }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="floating-coffee-button"
      aria-label={label}
      title={title}
    >
      <Image src="/coffee-logo.png" alt={imageAlt} width={34} height={34} />
    </a>
  );
}
