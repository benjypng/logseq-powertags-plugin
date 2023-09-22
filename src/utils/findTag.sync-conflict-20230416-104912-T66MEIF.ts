export default function findTag(content: string) {
  // check if multi word between brackets
  if (content.includes("#[[") && content.includes("]]")) {
    const regExp = /\#\[\[(.*?)\]\]/;
    const matched = regExp.exec(content.trim());
    if (matched) {
      return matched[0];
    } else {
      return -1;
    }
  } else {
    // check if single word
    const arr = content.split(" ");
    const indexOfTag = arr.findIndex((e) => e.startsWith("#"));
    if (indexOfTag !== -1) {
      return arr[indexOfTag].split("\n")[0];
    } else {
      return -1;
    }
  }
}
