import { Box, Typography } from "@mui/joy";
import React from "react";
import { User, Config } from "../helpers/types";
import EMSProfile from "./EMSProfile";
interface Props {
  user: User | null;
  config: Config | null;
}
export default function Ledger(props: Props) {
  const { user, config } = props;
  React.useEffect(() => {}, [user]);
  if (!user || !config) {
    return <div>Loading...</div>;
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
        <Typography level="h3">Dashboard</Typography>
      </Box>
      <EMSProfile config={config} user={user} write={false} isOnDashboard />
    </Box>
  );
}
