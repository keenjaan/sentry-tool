export function createId(): void

export class BuildReleaseId {
  release: string
  constructor(option: any)
  apply: (compiler: any) =>any
}

export function writeFile(release: string): void