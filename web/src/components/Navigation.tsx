import * as React from "react";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";

// Icons import
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/joy";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { Config } from "../helpers/types";
interface Props {
  config: Config | null;
}
export default function Navigation(props: Props) {
  const { config } = props;
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const styles = {
    unselected: { color: "neutral.500" },
    selected: { color: "inherit" },
  };
  const getPathStyle = (p: string) => {
    if (path === p) {
      return styles.selected;
    } else {
      return styles.unselected;
    }
  };
  return (
    <List size="md" sx={{ "--List-item-radius": "8px" }}>
      <ListItem nested sx={{ p: 0 }}>
        <ListItem>
          <ListItemButton
            variant={path === "/" ? "soft" : "plain"}
            color={path === "/" ? "primary" : "neutral"}
            onClick={() => {
              navigate("/");
            }}
          >
            <ListItemDecorator sx={getPathStyle("/")}>
              <DashboardRoundedIcon fontSize="small" />
            </ListItemDecorator>
            <ListItemContent>Dashboard</ListItemContent>
          </ListItemButton>
        </ListItem>
      </ListItem>

      {config?.ems?.enabled ? (
        <ListItem nested sx={{ p: 0 }}>
          <Box
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              id="nav-list-browse"
              textColor="neutral.500"
              fontWeight={700}
              sx={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: ".1rem",
              }}
            >
              HR
            </Typography>
            <IconButton
              size="sm"
              variant="plain"
              color="primary"
              sx={{ "--IconButton-size": "24px" }}
            >
              <KeyboardArrowDownRoundedIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
          <List
            aria-labelledby="nav-list-browse"
            sx={{
              "& .JoyListItemButton-root": { p: "8px" },
            }}
          >
            <ListItem>
              <ListItemButton
                variant={path === "/ems" ? "soft" : "plain"}
                color={path === "/ems" ? "primary" : "neutral"}
                onClick={() => {
                  navigate("/ems");
                }}
              >
                <ListItemDecorator sx={getPathStyle("/ems")}>
                  <PeopleRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>EMS</ListItemContent>
              </ListItemButton>
            </ListItem>
          </List>
        </ListItem>
      ) : null}
      <ListItem nested sx={{ p: 0 }}>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            id="nav-list-browse"
            textColor="neutral.500"
            fontWeight={700}
            sx={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: ".1rem",
            }}
          >
            Admin
          </Typography>
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            sx={{ "--IconButton-size": "24px" }}
          >
            <KeyboardArrowDownRoundedIcon fontSize="small" color="primary" />
          </IconButton>
        </Box>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            "& .JoyListItemButton-root": { p: "8px" },
          }}
        >
          <ListItem>
            <ListItemButton
              variant={path === "/global-settings" ? "soft" : "plain"}
              color={path === "/global-settings" ? "primary" : "neutral"}
              onClick={() => {
                navigate("/global-settings");
              }}
            >
              <ListItemDecorator sx={getPathStyle("/global-settings")}>
                <AdminPanelSettingsRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Global Settings</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}
