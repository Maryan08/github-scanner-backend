import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers";
import { readFileSync } from "fs";
import path from "path";

const typeDefs = readFileSync(path.join(__dirname, "./schemas/repositories.graphql"), "utf-8");

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
    const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
    console.log(`🚀 Server ready at ${url}`);
};

startServer().catch((err) => console.error(err));
