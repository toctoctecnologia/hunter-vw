export function scrollToHash(hash?: string) {
  if (!hash || hash.length <= 1) return;
  const id = hash.slice(1);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    setTimeout(() => scrollToHash(hash), 120);
  }
}
