export const findTag = (content: string) => {
  // check if multi word between brackets
  if (content.includes("#[[") && content.includes("]]")) {
    const regExp = /\#\[\[(.*?)\]\]/;
    const matched = regExp.exec(content.trim());
    if (matched) {
      return matched[0];
    } else {
      return;
    }
  } else {
    // check if single word
    const arr = content.split(" ").filter((e) => e.startsWith("#"));
    if (arr.length === 1) {
      return arr[0];
    } else if (arr.length > 1) {
      for (const t of arr) {
        if (logseq.settings?.savedTags[t]) {
          return t;
        } else {
          continue;
        }
      }
      return;
    } else {
      return;
    }
  }
};
