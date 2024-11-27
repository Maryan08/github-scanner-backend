import {AxiosError} from "axios";

export class ErrorHandlerUtil extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
    }
}

export class GitHubError extends Error {
    status: number;
    details: string | object;

    constructor(status: number, message: string, details: unknown = "") {
        super(message);
        this.status = status;
        this.details = details as object;
        this.name = "GitHubError";
    }
}

export const handleGitHubError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
            const status = axiosError.response.status;
            const responseData = axiosError.response.data;
            console.error(`GitHub API request failed with status ${status}:`, responseData);

            switch (status) {
                case 404:
                    throw new GitHubError(404, "Repository not found. Please check the owner and repository name.", responseData);
                case 403:
                    throw new GitHubError(403, "Forbidden. You might need proper authentication/authorization.", responseData);
                case 401:
                    throw new GitHubError(401, "Unauthorized. Please check your developer token.", responseData);
                case 500:
                    throw new GitHubError(500, "GitHub internal server error. Try again later.", responseData);
                default:
                    throw new GitHubError(status, `Unexpected error occurred. Status: ${status}`, responseData);
            }
        } else if (axiosError.request) {
            console.error("No response received from GitHub API:", axiosError.request);
            throw new GitHubError(500, "No response received from GitHub API.", axiosError.request);
        } else {
            console.error("Error setting up GitHub API request:", axiosError.message);
            throw new GitHubError(500, `Error setting up GitHub API request: ${axiosError.message}`);
        }
    } else {
        console.error("Unexpected error occurred:", error);
        throw new GitHubError(500, "An unexpected error occurred.", error);
    }
};
