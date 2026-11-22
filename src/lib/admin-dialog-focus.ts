export function restoreDialogTriggerFocus(
  event: Event,
  trigger: HTMLElement | null,
  fallback?: HTMLElement | null,
) {
  const target = trigger?.isConnected ? trigger : fallback?.isConnected ? fallback : null;
  if (!target) return;

  event.preventDefault();
  target.focus({ preventScroll: true });
}
