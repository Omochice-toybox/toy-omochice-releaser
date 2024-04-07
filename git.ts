import $ from "https://deno.land/x/dax@0.39.2/mod.ts";
import * as mod from "https://deno.land/std@0.221.0/semver/mod.ts";
import { type Commit, sync } from "npm:conventional-commits-parser@5.0.0";
import createPreset from "npm:conventional-changelog-conventionalcommits@7.0.2";

export async function getTags(branch: string) {
  return (await $`git tag --merged ${branch}`.text())
    .split("\n")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
}

export async function getLatestTag(branch: string) {
  return (await getTags(branch))
    .filter(mod.canParse)
    .sort((a, b) => mod.compare(mod.parse(a)!, mod.parse(b)!))
    .at(-1);
}

export async function getTagHead(tagName: string) {
  return (await $`git rev-list -1 ${tagName}`.text());
}

export async function getCurrentBranch() {
  return (await $`git branch --show-current`.text()).trim();
}

export async function switchBranch(branchName: string) {
  return await $`git switch -c ${branchName}`;
}

export async function rebase(onto: string) {
  return await $`git rebase ${onto}`;
}

export async function config({ user, email }: { user: string; email: string }) {
  await $`git config user.name ${user}`;
  await $`git config user.email ${email}`;
}

export async function push(force = false) {
  return await $`git push origin HEAD ${force ? "--force" : ""}`;
}

export async function sample() {
  Deno.writeTextFileSync("sample.txt", "Hello, World!");
  await $`git add sample.txt`;
  await $`git commit -m "Add sample.txt"`;
}

export async function getLogs(
  from: string,
  to: string = "",
): Promise<(Commit & { hash: string })[]> {
  const { parserOpts } = await createPreset();
  return (await $`git log --reverse --oneline ${from}..${to}`.text())
    .split("\n")
    .map((log) => log.trim())
    .filter((log) => log !== "")
    .map((log) => {
      const [hash, ...m] = log.split(" ");
      const message = m.join(" ");
      const commit = sync(message, parserOpts);
      return {
        ...commit,
        isBreaking: parserOpts.breakingHeaderPattern?.test(message) ?? false,
        hash,
      };
    });
}
