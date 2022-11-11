import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { PrismaClient } from "@prisma/client";
import micro_cors from "micro-cors";
import { typeDefs } from "./schemas";
import * as Query from "./resolver/Query";
import * as Mutation from "./resolver/Mutation";

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ({ req }) => {
    return {
      ...req,
      prisma,
    };
  },
  playground: true,
});

const cors = micro_cors({
  origin: "https://studio.apollographql.com",
  allowMethods: ["GET", "POST"],
  allowHeaders: [
    "Access-Control-Allow-Credentials",
    "true",
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
  ],
});

const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
