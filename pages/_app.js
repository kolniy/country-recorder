import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import "../styles/globals.css";
import AlertTemplate from "react-alert-template-basic";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  // offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <AlertProvider template={AlertTemplate} {...options}>
        <Component {...pageProps} />
      </AlertProvider>
    </ApolloProvider>
  );
}

export default MyApp;
