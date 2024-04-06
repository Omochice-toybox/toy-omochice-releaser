import {
  config,
  getCurrentBranch,
  push,
  rebase,
  sample,
  switchBranch,
} from "./git.ts";

const branchPrefix = "Omochice-releaser-";

if (import.meta.main) {
  // if current branch is not target branch then exit
  if (await getCurrentBranch() !== "main") {
    console.log("This action is only for main branch.");
    Deno.exit(0);
  }
  await config({
    user: "github-action",
    email: "github-action[bot]@users.noreply.github.com",
  });
  await switchBranch(`${branchPrefix}-sample`);
  await rebase("main");
  await sample();
  await push(true);
}
