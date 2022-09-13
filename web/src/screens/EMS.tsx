import { Box, Typography, Button } from "@mui/joy";
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Config } from "../helpers/types";

import EMSTable from "../components/EMSTable";
import { EMSProfile } from "../helpers/types";
import { getEMSRecords } from "../helpers/firebase";

interface Props {
  user: User | null;
  config: Config | null;
  role: number;
}
export default function EMS(props: Props) {
  const [rows, setRows] = React.useState<EMSProfile[]>([]);
  const itemsToLoad = 5;
  const navigate = useNavigate();
  const { user, config, role } = props;
  if (!user || !config) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    // if user doesn't have permissions in read, write, or admin, redirect to ems/view-employee/:id
    if (config && typeof config !== "string") {
      getEMSRecords(itemsToLoad)
        .then((res) => {
          if (res) {
            setRows(res);
          } else {
            alert("Something went wrong.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [config]);

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
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          m: { xs: 2, md: 0 },
        }}
      >
        <Typography level="h3">EMS</Typography>
        {role > 1 ? (
          <Button
            variant="solid"
            onClick={() => {
              navigate("/ems/create-employee");
            }}
          >
            New Employee
          </Button>
        ) : null}
      </Box>
      
        <EMSTable emsConfig={config.ems} rows={rows} role={role} />
      
      
    </Box>
  );
}
