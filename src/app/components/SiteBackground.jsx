import SignalPathAnimation from "./SignalPathAnimation";

/** Global ambience, grid, and content-aware moving signal. */
export default function SiteBackground() {
  return (
    <>
      <div className="site-background" aria-hidden="true" />
      <SignalPathAnimation />
    </>
  );
}
