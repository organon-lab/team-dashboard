import GithubProvider from "next-auth/providers/github";
import { Octokit } from "octokit";

export const FRONT_MAINTAINERS = [
  "clarani",
  "emersion",
  "SharglutDev",
  "kmer2016",
  "Math-R",
];

export default defineEventHandler(async () => {
  const octokit = new Octokit({
    auth: useRuntimeConfig().githubToken,
  });

  const repo = "osrd";
  const owner = "OpenRailAssociation";
  const requestedReviewCounts: Record<string, number> = Object.fromEntries(
    FRONT_MAINTAINERS.map((maintainer) => [maintainer, 0])
  );

  const isInvolvedReviewCounts: Record<string, number> = Object.fromEntries(
    FRONT_MAINTAINERS.map((maintainer) => [maintainer, 0])
  );

  const iterator = octokit.paginate.iterator(octokit.rest.pulls.list, {
    owner,
    repo,
    state: "open",
    per_page: 100,
  });

  for await (const { data: prs } of iterator) {
    for (const pr of prs) {
      console.log(pr, "pr");
      const reviewers =
        pr.requested_reviewers?.map((r: { login: string }) => r.login) ?? [];
      for (const reviewer of reviewers) {
        if (requestedReviewCounts.hasOwnProperty(reviewer)) {
          requestedReviewCounts[reviewer]++;
        }
      }
    }
  }
  console.log("Review counts:", requestedReviewCounts);
  return requestedReviewCounts;
});
