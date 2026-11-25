/** Covers the frozen route before swapping it for the new one underneath the chevrons. */
export async function raceWipe(overlay: HTMLElement, reverse: boolean, signal: AbortSignal, reveal: () => void) {
  const styles = getComputedStyle(overlay);
  const duration = Number.parseFloat(styles.getPropertyValue("--race-phase-ms"));
  const start = styles.getPropertyValue(reverse ? "--race-right" : "--race-left");
  const end = styles.getPropertyValue(reverse ? "--race-left" : "--race-right");
  const center = styles.getPropertyValue("--race-center");

  if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches || !overlay.animate) {
    reveal();
    return;
  }

  overlay.toggleAttribute("data-reverse", reverse);
  overlay.setAttribute("data-running", "");
  let animation = overlay.animate([start, center].map((transform) => ({ transform })), {
    duration, easing: "ease-in", fill: "both",
  });

  const cancel = () => {
    overlay.removeAttribute("data-running");
    animation.cancel();
  };
  signal.addEventListener("abort", cancel, { once: true });

  try {
    await animation.finished;
    reveal();
    animation.cancel();
    animation = overlay.animate([center, end].map((transform) => ({ transform })), {
      duration, easing: "ease-out", fill: "both",
    });
    await animation.finished;
  } catch (error) {
    if (!signal.aborted) throw error;
  } finally {
    if (!signal.aborted) cancel();
    signal.removeEventListener("abort", cancel);
  }
}
