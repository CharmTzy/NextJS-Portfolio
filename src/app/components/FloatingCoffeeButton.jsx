import { Coffee } from "lucide-react";

export default function FloatingCoffeeButton({ href, label, title }) {
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
      <Coffee aria-hidden="true" />
    </a>
  );
}
