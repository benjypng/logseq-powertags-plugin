export default function findTag(content: string) {
  const arr = content.split(" ");
  const indexOfTag = arr.findIndex((e) => e.startsWith("#"));
  if (indexOfTag !== -1) {
    return arr[indexOfTag].split("\n")[0];
  } else {
    return -1;
  }
}
