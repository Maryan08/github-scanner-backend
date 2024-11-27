import { repositoriesResolvers } from "./repositories.resolver";

export const resolvers = {
    Query: {
        ...repositoriesResolvers.Query,
    },
};
