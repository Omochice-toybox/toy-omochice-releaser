import {
  config,
  getCurrentBranch,
  getLatestTag,
  getLogs,
  getTagHead,
  push,
  rebase,
  sample,
  switchBranch,
} from "./git.ts";

import { parse } from "https://deno.land/std@0.221.0/semver/mod.ts";
const branchPrefix = "Omochice-releaser-";

if (import.meta.main) {
  // if current branch is not target branch then exit
  if (await getCurrentBranch() !== "main") {
    console.log("This action is only for main branch.");
    Deno.exit(0);
  }
  // await config({
  //   user: "github-action",
  //   email: "github-action[bot]@users.noreply.github.com",
  // });

  const tag = await getLatestTag("main");
  console.log("current tag: ", tag);

  if (tag === undefined) {
    console.log("No tags found.");
    Deno.exit(0);
  }

  const ref = await getTagHead(tag);
  console.log("head: ", ref);

  const logs = await getLogs(ref);
  console.log("logs: ", logs);
}

function bumpup(tag: string, logs) {
  const { major, minor, patch } = parse(tag)!;
  const startsWithV = tag.startsWith("v");
  if (logs.some((l) => l.isBreaking)) {
    return `${startsWithV ? "v" : ""}${major + 1}.${minor}.${patch}`;
  }
  if (logs.some((l) => l.)) {
}

function getNextVersion(tag: string) {
}
