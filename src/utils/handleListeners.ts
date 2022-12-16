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
      if (document.getElementById("text-field")) {
        (document.getElementById("text-field") as HTMLElement).focus();
      }
    }
  });

  // Click
  document.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest("#card")) {
      logseq.hideMainUI({ restoreEditingCursor: true });
    }
    e.stopPropagation();
  });
}
