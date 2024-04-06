import $ from "https://deno.land/x/dax@0.39.2/mod.ts";
import * as mod from "https://deno.land/std@0.221.0/semver/mod.ts";

export async function getTags(branch: string) {
  return (await $`git tag --merged ${branch}`.text())
    .split("\n")
    .map((tag) => tag.trim())
    .map((tag) => mod.tryParse(tag))
    .filter(mod.isSemVer);
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
