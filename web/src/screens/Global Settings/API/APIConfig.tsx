import {
  Box,
  Button,
  Checkbox,
  Select,
  TextField,
  Typography,
  Option,
  Sheet,
  Switch,
} from "@mui/joy";
import {
  User,
  EMSConfig,
  PermissionRecord,
  APIKey,
} from "../../../helpers/types";
import React from "react";
import {
  generateAPIKey,
  getAPIKeys,
  saveKeySettings,
} from "../../../helpers/firebase";
import PermissionsTable from "../../../components/PermissionsTable";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
interface Props {
  user: User | null;
  emsConfig: EMSConfig | null | undefined;
}

export default function EMSConfigScreen(props: Props) {
  const { emsConfig, user } = props;
  const [apiKeys, setAPIKeys] = React.useState<APIKey[]>([]);
  const [shouldRefresh, setShouldRefresh] = React.useState(true);
  const [allHidden, setAllHidden] = React.useState(true);
  console.log(apiKeys);
  React.useEffect(() => {
    if (user && emsConfig?.permissions[user?.email].admin && shouldRefresh) {
      getAPIKeys()
        .then((keys) => {
          setAPIKeys(keys);
          setShouldRefresh(false);
        })
        .catch((e) => {
          alert(e);
        });
    }
  }, [emsConfig?.permissions, shouldRefresh, user]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h4">API</Typography>
        <Switch
          startDecorator={<VisibilityOffRoundedIcon />}
          checked={allHidden}
          onChange={(e) => {
            const tempKeys = apiKeys.map((key) => {
              return { ...key, hidden: e.target.checked };
            });
            console.log(tempKeys);
            setAPIKeys(tempKeys);
            setAllHidden(e.target.checked);
          }}
          color={allHidden ? "success" : "neutral"}
        />
        <Button
          variant="solid"
          color="primary"
          sx={{ ml: 2, maxWidth: 170 }}
          onClick={() => {
            generateAPIKey()
              .then(() => {
                alert("API Key Generated");
                // trigger page reload
              })
              .catch(() => {
                alert("Error Generating API Key");
              });
          }}
        >
          Generate New Key
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {apiKeys.map((key) => (
            <Sheet
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: "sm",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                mt: 1,
              }}
            >
              <Box sx={{ flexDirection: "row", display: "flex" }}>
                {key.hidden && allHidden ? (
                  <Typography
                    level="h5"
                    variant="outlined"
                    color="warning"
                    sx={{ minWidth: 250 }}
                  >
                    {key.key?.replace(/./g, "*")}
                  </Typography>
                ) : (
                  <Typography
                    level="h5"
                    variant="outlined"
                    color="warning"
                    sx={{ minWidth: 250 }}
                  >
                    {key.key}
                  </Typography>
                )}

                <Button
                  size="sm"
                  variant="solid"
                  color="primary"
                  disabled={!allHidden}
                  sx={{ ml: 2 }}
                  onClick={() => {
                    const keys = [...apiKeys];
                    keys.forEach((k) => {
                      if (k.key === key.key) {
                        k.hidden = !k.hidden;
                      }
                    });
                    setAPIKeys(keys);
                  }}
                >
                  {key.hidden && allHidden ? (
                    <VisibilityRoundedIcon />
                  ) : (
                    <VisibilityOffRoundedIcon />
                  )}
                </Button>
                <TextField
                  placeholder="Name"
                  value={key.name}
                  sx={{ ml: 2 }}
                  onChange={(e) => {
                    const keys = [...apiKeys];
                    keys.forEach((k) => {
                      if (k.key === key.key) {
                        k.name = e.target.value;
                      }
                    });
                    setAPIKeys(keys);
                  }}
                />

                <Button
                  variant="solid"
                  color="primary"
                  sx={{ ml: 2, maxWidth: 170 }}
                  onClick={() => {
                    saveKeySettings(key);
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  sx={{ ml: 2, maxWidth: 170 }}
                  onClick={() => {}}
                >
                  Deactivate
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {emsConfig?.fields.map((field) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 300 }} level="h5">
                        {field.name}
                      </Typography>
                      <Checkbox
                        label="Read"
                        sx={{ ml: 2 }}
                        checked={key.permissions[field.id]?.read ?? false}
                        onChange={(e) => {
                          const keys = [...apiKeys];
                          keys.forEach((k) => {
                            if (k.key === key.key) {
                              k.permissions[field.id] = {
                                read: e.target.checked,
                                write: k.permissions[field.id]?.write ?? false,
                              };
                            }
                          });
                          setAPIKeys(keys);
                        }}
                      />
                      <Checkbox
                        label="Write"
                        sx={{ ml: 2 }}
                        checked={key.permissions[field.id]?.write ?? false}
                        onChange={(e) => {
                          const keys = [...apiKeys];
                          keys.forEach((k) => {
                            if (k.key === key.key) {
                              k.permissions[field.id] = {
                                read: k.permissions[field.id]?.read ?? false,
                                write: e.target.checked,
                              };
                            }
                          });
                          setAPIKeys(keys);
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Sheet>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
