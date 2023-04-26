import { ChakraProvider } from "@chakra-ui/react";
import { Router } from "components/router/Router";
import theme from "components/theme/theme";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ChakraProvider>
  );
}
