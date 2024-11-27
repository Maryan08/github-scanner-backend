import { GITHUB_API_BASE_URL } from "../../src/config/github.config";
import {GitHubService} from "../../src/services/github.service";
import axios from "axios";

jest.mock("axios");

describe("GitHubService", () => {
    const mockToken = "test-token";
    const service = new GitHubService(mockToken);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getRepositories", () => {
        it("should return a list of repositories", async () => {
            const mockResponse = {
                data: [
                    { name: "repo1", size: 123, owner: { login: "user1" } },
                    { name: "repo2", size: 456, owner: { login: "user2" } },
                ],
            };
            (axios.get as jest.Mock).mockResolvedValue(mockResponse);

            const repositories = await service.getRepositories();

            expect(axios.get).toHaveBeenCalledWith(`${GITHUB_API_BASE_URL}/user/repos`, {
                headers: { Authorization: `Bearer ${mockToken}` },
            });
            expect(repositories).toEqual([
                { name: "repo1", size: 123, owner: "user1" },
                { name: "repo2", size: 456, owner: "user2" },
            ]);
        });

        it("should handle errors", async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error("GitHub API Error"));

            await expect(service.getRepositories()).rejects.toThrow();
        });
    });

    describe("getRepositoryDetails", () => {
        it("should return repository details", async () => {
            const mockRepoResponse = {
                data: {
                    name: "repo1",
                    size: 123,
                    owner: { login: "user1" },
                    private: true,
                },
            };
            const mockContentResponse = {
                data: [
                    { name: "file1.txt" },
                    { name: "config.yml", download_url: "http://example.com/config.yml" },
                ],
            };
            const mockYamlResponse = { data: "yaml-content" };
            const mockWebhooksResponse = {
                data: [
                    { id: 1, config: { url: "http://webhook1.com" } },
                    { id: 2, config: { url: "http://webhook2.com" } },
                ],
            };

            (axios.get as jest.Mock)
                .mockResolvedValueOnce(mockRepoResponse)
                .mockResolvedValueOnce(mockContentResponse)
                .mockResolvedValueOnce(mockYamlResponse)
                .mockResolvedValueOnce(mockWebhooksResponse);

            const details = await service.getRepositoryDetails("user1", "repo1");

            expect(details).toEqual({
                name: "repo1",
                size: 123,
                owner: "user1",
                isPrivate: true,
                fileCount: 2,
                ymlFileContent: "yaml-content",
                activeWebhooks: [
                    { id: 1, url: "http://webhook1.com" },
                    { id: 2, url: "http://webhook2.com" },
                ],
            });
        });

        it("should handle validation errors", async () => {
            await expect(service.getRepositoryDetails("", "")).rejects.toThrow("Invalid arguments");
        });

        it("should handle API errors", async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error("GitHub API Error"));

            await expect(service.getRepositoryDetails("user1", "repo1")).rejects.toThrow();
        });
    });
});
