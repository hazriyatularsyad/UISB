// Kontrak pemicu popup sambutan: card hero memancarkan event ini,
// WelcomePopup mendengarkannya. Satu instance popup, satu state isOpen.
// (konstanta dipisah agar tidak meng-import komponen popup ke bundle hero)
export const OPEN_POPUP_EVENT = "uisb:open-popup"

export function openWelcomePopup() {
  window.dispatchEvent(new CustomEvent(OPEN_POPUP_EVENT))
}
