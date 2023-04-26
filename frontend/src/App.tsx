import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "components/theme/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <h1>Hello World!</h1>
    </ChakraProvider>
  );
}

export default App;
