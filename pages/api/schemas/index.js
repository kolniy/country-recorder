import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type User {
    id: ID
    login: String
    avatar_url: String
  }

  type Location {
    id: ID!
    country: String!
    year: String!
    area: Int!
    total_population: Int!
  }

  type Query {
    getLocations: [Location!]
  }

  type Mutation {
    createNewLocation(data: createLocationInput): Location!
    updateLocation(idOfLocation: ID!, data: updateLocationInput): Location!
    deleteLocation(idOfLocation: ID!): Location!
  }

  input createLocationInput {
    country: String!
    year: String!
    area: Int!
    population: Int!
  }

  input updateLocationInput {
    country: String!
    year: String!
    area: Int!
    population: Int!
  }
`;
