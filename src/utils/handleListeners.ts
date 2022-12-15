export default function handleListeners() {
  //ESC
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key === "Escape") {
        logseq.hideMainUI({ restoreEditingCursor: true });
      }
      e.stopPropagation();
    },
    false
  );

  // Auto focus
  document.addEventListener("keydown", (e: any) => {
    if (e.key !== "Escape") {
      (document.getElementById("text-field") as HTMLElement).focus();
    }
  });
}
