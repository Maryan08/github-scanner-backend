import axios from "axios";
import { GITHUB_API_BASE_URL } from "../config/github.config";
import { limitConcurrentRequests } from "../utils/limiter.util";
import {handleGitHubError} from "../utils/errorHandler.util";
import {repositoryArgsSchema} from "../utils/validation.util";
import {ApolloError} from "apollo-server";

export class GitHubService {
    private token: string;

    constructor(developerToken: string) {
        this.token = developerToken;
    }

    private getHeaders() {
        return {
            Authorization: `Bearer ${this.token}`,
        };
    }

    async getRepositories() {
        try {
            const response = await axios.get(`${GITHUB_API_BASE_URL}/user/repos`, { headers: this.getHeaders() });
            return response.data.map((repo: any) => ({
                name: repo.name,
                size: repo.size,
                owner: repo.owner.login,
            }));
        } catch (error) {
            handleGitHubError(error);
        }

    }

    async getRepositoryDetails(userName: string, repoName: string) {
        const {error} = repositoryArgsSchema.validate({userName, repoName});

        if (error) {
            throw new ApolloError(`Invalid arguments: ${error.details.map((e) => e.message).join(", ")}`);
        }

        try {
            const repoResponse = await axios.get(`${GITHUB_API_BASE_URL}/repos/${userName}/${repoName}`, { headers: this.getHeaders() });
            const contentResponse = await axios.get(`${GITHUB_API_BASE_URL}/repos/${userName}/${repoName}/contents`, { headers: this.getHeaders() });
            const ymlFile = contentResponse.data.find((file: any) => file.name.endsWith(".yml"));
            const ymlContent = ymlFile
                ? (await axios.get(ymlFile.download_url)).data
                : null;

            const webhooksResponse = await axios.get(`${GITHUB_API_BASE_URL}/repos/${userName}/${repoName}/hooks`, { headers: this.getHeaders() });

            return {
                name: repoResponse.data.name,
                size: repoResponse.data.size,
                owner: repoResponse.data.owner.login,
                isPrivate: repoResponse.data.private,
                fileCount: contentResponse.data.length,
                ymlFileContent: ymlContent,
                activeWebhooks: webhooksResponse.data.map((hook: any) => ({
                    id: hook.id,
                    url: hook.config.url,
                })),
            };
        } catch (error) {
            handleGitHubError(error);
        }

    }
}
