const dev = process.env.NODE_ENV !== "production";

export const serverUrl = dev
  ? "http://localhost:3000/api/graphql"
  : "https://hulu-2-0-ten-pied.vercel.app";
