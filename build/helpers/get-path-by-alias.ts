import { join, resolve } from 'node:path';
import tsconfig from '../../tsconfig.json' with { type: 'json' };

const paths = (tsconfig.compilerOptions.paths ?? {});

const buildAliases = (): Map<string, string> => {
  const aliasMap = new Map<string, string>();

  for (const [key, targetPaths] of Object.entries(paths)) {
    const target = targetPaths?.[0];
    if (!target) continue;

    const cleanKey = key.replace(/\/\*?$/, '').replace(/\*$/, '');

    const cleanTarget = target
      .replace(/^\.\//, '')
      .replace(/\/\*?$/, '')
      .replace(/\*$/, '')
      .replace(/\/index$/, '');

    aliasMap.set(cleanKey, resolve(process.cwd(), cleanTarget));
  }

  return aliasMap;
};

const aliases = buildAliases();

export default function (
  aliasPath: string,
  parentPartialDirectory?: string
): string {
  for (const [alias, targetDir] of aliases) {
    if (aliasPath === alias) {
      return targetDir;
    }

    if (aliasPath.startsWith(`${alias}/`)) {
      const subPath = aliasPath.slice(alias.length + 1);
      return join(targetDir, subPath);
    }
  }

  return join(parentPartialDirectory ?? '', aliasPath);
}