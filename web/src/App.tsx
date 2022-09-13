import * as React from "react";
import { GlobalStyles } from "@mui/system";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import type { Theme } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import IconButton from "@mui/joy/IconButton";

// Icons import
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

import MenuIcon from "@mui/icons-material/Menu";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import { LogoutRounded } from "@mui/icons-material";
import { LoginRounded } from "@mui/icons-material";
// custom
import theme from "./theme";
import Menu from "./components/Menu";
import Layout from "./components/Layout";
import Navigation from "./components/Navigation";
import { Config } from "./helpers/types";
import {
  getAppSettings,
  signInWithGoogle,
  signOutUser,
  useAuth,
} from "./helpers/firebase";
import { useNavigate, Routes, Route } from "react-router-dom";

// Screens
import Unauthorized from "./screens/Unauthorized";
import Dashboard from "./screens/Dashboard";

import { Button } from "@mui/joy";
import GlobalSettings from "./screens/Global Settings/GlobalSettings";
import EMS from "./screens/EMS";
import EMSProfile from "./screens/EMSProfile";
import GettingStarted from "./screens/GettingStarted";


const ColorSchemeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="primary"
      onClick={() => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
};

export default function App() {
  const [role, setRole] = React.useState<number>(-1);

  // Critical
  const navigate = useNavigate();
  const user = useAuth();
  const [config, setConfig] = React.useState<Config | null>(null);
  // Visual
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const verifyEMSRole = React.useCallback(() => {
    // 0 no permissions, 1 read only, 2 read write, 3 admin
    if (config && user) {
      // early return for owner
      if (config.general.owner === user.email) {
        return 4;
      }
      const tmpPermissions = config.ems.permissions[user.email];
      if (tmpPermissions) {
        if (
          tmpPermissions.admin ||
          tmpPermissions.write ||
          tmpPermissions.read
        ) {
          if (tmpPermissions.admin === true) {
            return 3;
          }
          if (tmpPermissions.write === true) {
            return 2;
          }
          if (tmpPermissions.read === true) {
            return 1;
          }
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
    return 0;
  }, [user, config]);

  React.useEffect(() => {
    getAppSettings()
      .then((newConfig) => {
        console.log(newConfig);
        if (newConfig === null) {
          navigate("/getting-started");
        } else {
          setConfig(newConfig);
        }
      })
      .catch((error) => {
        alert(error);
        setConfig(null);
      });
  }, [user, navigate]);
  React.useEffect(() => {
    if (role === -1) {
      setRole(verifyEMSRole());
    }
  }, [config, role, user, verifyEMSRole]);

  return (
    <CssVarsProvider disableTransitionOnChange theme={theme}>
      <GlobalStyles<Theme>
        styles={(theme) => ({
          body: {
            margin: 0,
            fontFamily: theme.vars.fontFamily.body,
          },
        })}
      />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation config={config} />
        </Layout.SideDrawer>
      )}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          }),
        }}
      >
        <Layout.Header>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <IconButton
              variant="outlined"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              size="sm"
              variant="solid"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              {config?.general?.logoURL ? (
                <img
                  src={config?.general?.logoURL}
                  alt="logo"
                  style={{ width: 32, height: 32, objectFit: "contain" }}
                />
              ) : (
                <BookRoundedIcon />
              )}
            </IconButton>
            <Typography component="h1" fontWeight="xl">
              {config?.general?.companyName ?? "EMS"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
            
            <ColorSchemeToggle />
            {user ? (
              <IconButton
                size="sm"
                variant="outlined"
                color="primary"
                aria-label="Apps"
                onClick={() => {
                  signOutUser().then(() => {
                    navigate("/");
                  });
                }}
              >
                <LogoutRounded />
              </IconButton>
            ) : (
              <Button
                size="sm"
                variant="outlined"
                color="primary"
                aria-label="logout"
                endIcon={<LoginRounded />}
                onClick={() => {
                  signInWithGoogle();
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Layout.Header>
        {config ? (
          <Layout.SideNav>
            <Navigation config={config} />
          </Layout.SideNav>
        ) : (
          <Layout.SideNav sx={{ bgcolor: "transparent", borderRight: "0px" }} />
        )}

        <Layout.Main>
          <Box className="App" sx={{ padding: { xs: 0, sm: 3 } }}>
            {user ? (
              <Routes>
                <Route
                  path="/getting-started"
                  element={<GettingStarted user={user} config={config} />}
                />
                <Route
                  path="/"
                  element={<Dashboard user={user} config={config} />}
                />
                <Route
                  path="/ems"
                  element={
                    verifyEMSRole() > 0 ? (
                      <EMS user={user} config={config} role={verifyEMSRole()} />
                    ) : (
                      <Unauthorized />
                    )
                  }
                />

                <Route
                  path="/ems/create-employee"
                  element={
                    verifyEMSRole() > 1 ? (
                      <EMSProfile user={user} config={config} write={true} />
                    ) : (
                      <Unauthorized />
                    )
                  }
                />
                <Route
                  path="/ems/view-employee/:id"
                  element={
                    verifyEMSRole() > 0 ? (
                      <EMSProfile user={user} config={config} write={false} />
                    ) : (
                      <Unauthorized />
                    )
                  }
                />
                <Route
                  path="/ems/edit-employee/:id"
                  element={
                    verifyEMSRole() > 1 ? (
                      <EMSProfile user={user} config={config} write={true} />
                    ) : (
                      <Unauthorized />
                    )
                  }
                />
                <Route
                  path="/global-settings"
                  element={
                    verifyEMSRole() > 2 ? (
                      <GlobalSettings user={user} config={config} />
                    ) : (
                      <Unauthorized />
                    )
                  }
                />
              </Routes>
            ) : (
              <Routes>
                <Route path="*" element={<Unauthorized />} />
              </Routes>
            )}
          </Box>
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  );
}
