import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export async function writeFileAtomic(filePath: string, data: string) {
  await mkdir(path.dirname(filePath), { recursive: true });

  const tempPath = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;

  try {
    await writeFile(tempPath, data, "utf8");
    await rename(tempPath, filePath);
  } catch (error) {
    await rm(tempPath, { force: true }).catch(() => undefined);
    throw error;
  }
}
