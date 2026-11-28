import { lstatSync, realpathSync, rmdirSync, symlinkSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

// The editor's TypeScript is tsrs (.vscode/settings.json's js/ts.tsdk.path, for VS Code's TypeScript 7 extension), and
// the folder holding its language server differs by platform: on Windows the native package beside tsrs (its tsgo.exe
// and lib files), elsewhere tsrs's own tsdk launcher. Run after every install, this links one path to whichever this
// machine needs, so the settings name the same folder for everyone
const nodeModules = join(import.meta.dirname, '../node_modules');
const link = join(nodeModules, '.tsrs-tsdk');

const editorTsdk = (): string => {
  const tsrs = join(nodeModules, 'tsrs');
  if (process.platform !== 'win32') {
    return join(tsrs, 'tsdk');
  }

  // Resolved from where tsrs really is (pnpm links node_modules/tsrs to it), as tsrs depends on every platform's
  // package and pnpm installs this machine's beside it
  const tsrsPackage = join(realpathSync(tsrs), 'package.json');
  return dirname(createRequire(tsrsPackage).resolve(`@tsrs/win32-${process.arch}/package.json`));
};

// Takes away the link a previous install made, never what it points to (a Windows junction can only be removed as a
// directory). Anything else at that path is left alone
const removeOldLink = (): void => {
  let found;
  try {
    found = lstatSync(link);
  } catch {
    return;
  }

  if (!found.isSymbolicLink()) {
    throw new Error(`${link} is there and isn't a link`);
  }

  try {
    unlinkSync(link);
  } catch {
    rmdirSync(link);
  }
};

// An install mustn't fail over the editor's setup, so a problem is only reported
try {
  removeOldLink();

  // A junction on Windows (no admin rights needed), a directory symlink elsewhere ('junction' is ignored there)
  symlinkSync(editorTsdk(), link, 'junction');
} catch (error) {
  console.warn(`link-editor-tsdk: the editor's TypeScript (node_modules/.tsrs-tsdk) wasn't linked: ${String(error)}`);
}
