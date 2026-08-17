export function openLink(url: string, target: "_blank" | "_self" = "_blank") {
  window.open(url, target);
}
