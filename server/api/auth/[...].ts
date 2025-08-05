import GithubProvider from "next-auth/providers/github";
import { NuxtAuthHandler } from "#auth";
import { Octokit } from "octokit";
import { PrismaClient } from "@prisma/client";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user: currentUser }) {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      // the majority of the organization members are private, so we can't
      // retrieve them with the list members endpoint
      // we need to use the list contributors endpoint instead
      let contributors = [];
      const iterator = octokit.paginate.iterator(
        octokit.rest.repos.listContributors,
        {
          owner: "OpenRailAssociation",
          repo: "osrd",
          per_page: 100,
        },
      );
      for await (const { data: users } of iterator) {
        for (const user of users) {
          contributors.push(user);
        }
      }

      const isContributor = contributors.some(
        (contributor) => contributor.id === +currentUser.id,
      );

      // add the user in DB if not exists
      const prisma = new PrismaClient();

      await prisma.user.upsert({
	where: { email: currentUser.email! }, 
	update: {},
	create: {
	  name: currentUser.name,
	  email: currentUser.email!,
	},
      });

      return isContributor;
    },
  },
});
