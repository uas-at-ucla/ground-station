import pathImport from "path";
import fsImport from "fs";
const electron = window.require("electron");
export const path: typeof pathImport = window.require("path");
export const fs: typeof fsImport = window.require("fs");

const app = electron.remote.app;
const appPath = app.getAppPath();
export const userDataPath = app.getPath("userData");

export function relativePath(p: string) {
  return path.join(appPath, p).replace("app.asar", "app.asar.unpacked");
}
