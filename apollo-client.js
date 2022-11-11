import { ApolloClient, InMemoryCache } from "@apollo/client";
import { serverUrl } from "./config";

const client = new ApolloClient({
  uri: serverUrl,
  cache: new InMemoryCache(),
});

export default client;
