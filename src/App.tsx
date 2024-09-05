import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle, DefaultTheme, ThemeProvider } from "styled-components";
import reset from "styled-reset";
import { createContext, useContext, useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";
import ChangePassword from "./routes/change-password";
import Settings from "./routes/settings";
import { darkTheme, lightTheme } from "./theme";

interface ThemeContextType {
  theme: DefaultTheme;
  setLightTheme: () => void;
  setDarkTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
]);

const GlobalStyles = createGlobalStyle`
${reset};
* {
   box-sizing: border-box;
}
body {
   background-color: ${(props) => props.theme.bgColor};
   color: ${(props) => props.theme.textColor};
   font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
   overflow-y: scroll;
}
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const [theme, setTheme] = useState<DefaultTheme>(lightTheme);

  const init = async () => {
    await auth.authStateReady(); // 로그인 여부 확인하고 인증이 완료되면 promise를 리턴
    setLoading(false);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme === "light") {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }

    init();
  }, []);

  const setLightTheme = () => {
    setTheme(lightTheme);
    localStorage.setItem("appTheme", "light");
  };
  const setDarkTheme = () => {
    setTheme(darkTheme);
    localStorage.setItem("appTheme", "dark");
  };

  return (
    <Wrapper>
      <ThemeContext.Provider value={{ theme, setLightTheme, setDarkTheme }}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
        </ThemeProvider>
      </ThemeContext.Provider>
    </Wrapper>
  );
}

export default App;
