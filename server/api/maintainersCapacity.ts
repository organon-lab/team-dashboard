import { Octokit } from "octokit";

export const FRONT_MAINTAINERS = [
  "clarani",
  "emersion",
  "SharglutDev",
  "kmer2016",
  "Math-R",
];

export default defineEventHandler(async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repo = "osrd";
  const owner = "OpenRailAssociation";
  const requestedReviewCounts: Record<string, number> = Object.fromEntries(
    FRONT_MAINTAINERS.map((m) => [m, 0])
  );

  await Promise.all(
    FRONT_MAINTAINERS.map(async (maintainer) => {
      const result = await octokit.rest.search.issuesAndPullRequests({
        q: `is:pr is:open review-requested:${maintainer} repo:${owner}/${repo}`,
        per_page: 1,
        advanced_search: true,
      });
      requestedReviewCounts[maintainer] = result.data.total_count;
    })
  );

  return requestedReviewCounts;
});

