import { Box, Sheet, Typography } from "@mui/joy";
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Config } from "../helpers/types";
import GeneralConfig from "./Global Settings/General/GeneralConfig";
interface Props {
  user: User | null;
  config: Config | null;
}
export default function GettingStarted(props: Props) {
  const { user, config } = props;
  const navigate = useNavigate();
  React.useEffect(() => {
    if (config !== null) {
      navigate("/");
    }
  }, [config, navigate]);
  if (!user) {
    return <div>Loading... (please make you that you are signed in)</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          m: { xs: 2, md: 0 },
        }}
      >
        <Typography level="h3">Getting Started</Typography>
      </Box>
      <Sheet
        variant="outlined"
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          borderRadius: "sm",
          p: 2,
        }}
      >
        <GeneralConfig user={user} generalConfig={config?.general} mode="new" />
      </Sheet>
    </Box>
  );
}
