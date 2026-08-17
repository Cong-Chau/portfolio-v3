export function callPhone(phone: string) {
  const telLink = `tel:${phone}`;
  window.open(telLink, "_self");
}
