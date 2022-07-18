import { writeFile, appendFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { promisify } from "bluebird";
const writeFileAsync = promisify(writeFile);

export async function writeTempFile(name: string, contents: string) {
  const fileName = name + ".json";
  const filePath = join(tmpdir(), fileName);
  await writeFileAsync(filePath, contents);
  return filePath;
}

export function pathToFileURL(path: string) {
  const fileUrl = "file://" + path;
  return fileUrl;
}
