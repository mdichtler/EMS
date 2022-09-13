import { Box, Button, TextField, Typography } from "@mui/joy";
import React from "react";
import { User, GeneralConfig, Config } from "../../../helpers/types";
import { setAppSettings, updateGeneralAppSettings } from "../../../helpers/firebase";
import { useNavigate } from "react-router-dom";
interface Props {
  user: User | null;
  generalConfig: GeneralConfig | null | undefined;
  mode: "edit" | "new";
}

export default function GeneralConfigTab(props: Props) {
  const navigate = useNavigate();
  const { user, generalConfig, mode } = props;
  const [workingConfig, setWorkingConfig] = React.useState<GeneralConfig>({
    owner: null,
    companyName: "",
    currency: "",
    currencySymbol: "",
    logoURL: "",
  });
 

  React.useEffect(() => {
    if (mode === "new" && user !== null && workingConfig.owner === null) {
      setWorkingConfig({
        ...workingConfig,
        owner: user.email,
      });
    } else {
      if (generalConfig && workingConfig.owner === null) {
        setWorkingConfig(generalConfig);
      }
    }
  }, [generalConfig, mode, user, workingConfig]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {mode === "edit" ? (
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
          <Typography level="h4">General</Typography>
          <Button
            variant="solid"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => {
              updateGeneralAppSettings(workingConfig)
                .then(() => {
                  alert("Settings saved.");
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            Save
          </Button>
        </Box>
      ) : null}

      <Box
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", mt: 1 }}
      >
        <Box id="left">
          <TextField
            sx={{
              mt: 0,
              maxWidth: 250,
            }}
            label="Owner"
            required
            placeholder="Owner"
            size="lg"
            variant="soft"
            value={`${workingConfig.owner}`}
            onChange={(e) => {
              setWorkingConfig({
                ...workingConfig,
                owner: e.target.value,
              });
            }}
          />
          <TextField
            sx={{
              mt: 1,
              maxWidth: 250,
            }}
            label="Company name"
            placeholder="Company name"
            size="lg"
            variant="soft"
            value={`${workingConfig.companyName}`}
            onChange={(e) => {
              setWorkingConfig({
                ...workingConfig,
                companyName: e.target.value,
              });
            }}
          />

          <TextField
            sx={{
              mt: 1,
              maxWidth: 250,
            }}
            label="Logo URL"
            placeholder="Logo URL"
            size="lg"
            variant="soft"
            value={`${workingConfig.logoURL}`}
            onChange={(e) => {
              setWorkingConfig({
                ...workingConfig,
                logoURL: e.target.value,
              });
            }}
          />
        </Box>
        <Box id="right"></Box>
      </Box>
      {mode === "new" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              const appConfig: Config = {
                general: workingConfig,

                owner: "",
                ems: {
                  enabled: false,
                  permissions: {
                    [`${workingConfig.owner}`]: {
                      read: true,
                      write: true,
                      admin: true,
                    },
                  },
                  fields: [
                    {
                      name: "User ID",
                      type: "text",
                      required: false,
                      id: "uuid",
                      isTableField: false,
                    },
                    {
                      name: "Email",
                      type: "text",
                      required: true,
                      id: "email",
                      isTableField: true,
                    },
                  ],
                },
              };
              setAppSettings(appConfig)
                .then(() => {
                  alert("Success!");
                  navigate('/')
              })
            }}

          >
            Create
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
