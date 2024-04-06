import { config, getCurrentBranch, rebase, switchBranch } from "./git.ts";

const branchPrefix = "Omochice-releaser-";

if (import.meta.main) {
  // if current branch is not target branch then exit
  if (await getCurrentBranch() !== "main") {
    Deno.exit(0);
  }
  await config({
    user: "github-action",
    email: "github-action[bot]@users.noreply.github.com",
  });
  await switchBranch(`${branchPrefix}-sample`);
  await rebase("main");
}
