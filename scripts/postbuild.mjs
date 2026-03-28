import { mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const sourceIndex = path.join(distDir, 'index.html')

const targets = [
  path.join(distDir, 'help', 'index.html'),
]

for (const target of targets) {
  await mkdir(path.dirname(target), { recursive: true })
  await copyFile(sourceIndex, target)
}

