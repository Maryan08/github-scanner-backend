import { GitHubService } from "../services/github.service";

export const repositoriesResolvers = {
    Query: {
        listRepositories: async (_: any, { developerToken }: { developerToken: string }) => {
            const service = new GitHubService(developerToken);
            return service.getRepositories();
        },
        repositoryDetails: async (_: any, { developerToken, repoName, userName }: { developerToken: string, repoName: string, userName: string }) => {
            const service = new GitHubService(developerToken);
            return service.getRepositoryDetails(userName, repoName);
        },
    },
};
