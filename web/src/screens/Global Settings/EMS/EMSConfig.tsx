import {
  Box,
  Button,
  Checkbox,
  Select,
  TextField,
  Typography,
  Option,
  Sheet,
} from "@mui/joy";
import { User, EMSConfig, PermissionRecord } from "../../../helpers/types";
import React from "react";
import { updateEMSAppSettings } from "../../../helpers/firebase";
import PermissionsTable from "../../../components/PermissionsTable";
interface Props {
  user: User | null;
  emsConfig: EMSConfig | null | undefined;
}

export default function EMSConfigScreen(props: Props) {
  const { emsConfig } = props;
  const [workingConfig, setWorkingConfig] = React.useState<EMSConfig>({
    enabled: false,
    fields: [],
    permissions: {},
  });

  const [loaded, setLoaded] = React.useState(false);
  const [permissions, setPermissions] = React.useState<PermissionRecord[]>([]);

  React.useEffect(() => {
    if (emsConfig && emsConfig.enabled !== workingConfig.enabled && !loaded) {
      setWorkingConfig(emsConfig);
      setLoaded(true);
    }
  }, [emsConfig, workingConfig.enabled, loaded]);

  React.useEffect(() => {
    const tempPermissions: PermissionRecord[] = [];
    console.log("Updating: ", workingConfig.permissions);
    if (emsConfig !== null && emsConfig !== undefined) {
      if (Object.keys(workingConfig.permissions).length === 0) {
        setPermissions([]);
      } else {
        Object.keys(workingConfig.permissions).forEach((key) => {
          tempPermissions.push({
            email: key,
            read: workingConfig.permissions[key].read,
            write: workingConfig.permissions[key].write,
            admin: workingConfig.permissions[key].admin,
          });
        });
        setPermissions(tempPermissions);
      }
    }
  }, [emsConfig, workingConfig]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h4">EMS</Typography>
        <Button
          variant="solid"
          color="primary"
          sx={{ ml: 2 }}
          onClick={() => {
            updateEMSAppSettings(workingConfig)
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          mt: 1,
        }}
      >
        <Checkbox
          label="Enabled"
          checked={workingConfig.enabled}
          onChange={(e) => {
            setWorkingConfig({
              ...workingConfig,
              enabled: e.target.checked,
            });
          }}
        />
        {workingConfig.enabled ? (
          <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography level="h5">Fields</Typography>
              <Button
                variant="solid"
                color="primary"
                sx={{ ml: 2 }}
                onClick={() => {
                  setWorkingConfig({
                    ...workingConfig,
                    fields: [
                      ...workingConfig.fields,
                      {
                        name: "New Field",
                        type: "text",
                        id: "newField",
                        required: false,
                        isTableField: false,
                      },
                    ],
                  });
                }}
              >
                Add
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: 1,
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {workingConfig.fields.map((field, index) => {
                return (
                  <Sheet
                    variant="outlined"
                    sx={{
                      borderRadius: "sm",
                      p: 2,
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography level="h6" width={200}>
                        {field.name} ({field.id})
                      </Typography>
                      <Select
                        sx={{ ml: 2, width: 120 }}
                        variant="outlined"
                        disabled={field.id === "email" || field.id === "uuid"}
                        value={field.type}
                        onChange={(e) => {
                          if (e) {
                            const newFields = workingConfig.fields;
                            newFields[index].type = e;
                            setWorkingConfig({
                              ...workingConfig,
                              fields: newFields,
                            });
                          }
                        }}
                      >
                        <Option value="text">Text</Option>
                        <Option value="number">Number</Option>
                        <Option value="date">Date</Option>
                        <Option value="checkbox">Checkbox</Option>
                      </Select>

                      <TextField
                        sx={{ ml: 2 }}
                        value={field.name}
                        disabled={field.id === "email" || field.id === "uuid"}
                        required={field.required}
                        onChange={(e) => {
                          const newFields = workingConfig.fields;
                          newFields[index].name = e.target.value;
                          const textArr = e.target.value.split(" ");
                          let id = textArr
                            .map((word, index) => {
                              let returnWord: string = word.toLowerCase();
                              if (index === 0) {
                                return returnWord;
                              }
                              return (
                                returnWord.charAt(0).toUpperCase() +
                                returnWord.slice(1)
                              );
                            })
                            .join("");

                          newFields[index].id = id;
                          setWorkingConfig({
                            ...workingConfig,
                            fields: newFields,
                          });
                        }}
                      />
                      <Checkbox
                        label="Required"
                        sx={{ ml: 2 }}
                        disabled={field.id === "email" || field.id === "uuid"}
                        checked={field.required}
                        onChange={(e) => {
                          const newFields = workingConfig.fields;
                          newFields[index].required = e.target.checked;
                          setWorkingConfig({
                            ...workingConfig,
                            fields: newFields,
                          });
                        }}
                      />
                      <Checkbox
                        label="Table Field"
                        sx={{ ml: 2 }}
                        checked={field.isTableField}
                        onChange={(e) => {
                          const newFields = workingConfig.fields;
                          newFields[index].isTableField = e.target.checked;
                          setWorkingConfig({
                            ...workingConfig,
                            fields: newFields,
                          });
                        }}
                      />
                    </Box>
                    <Button
                      variant="solid"
                      color="primary"
                      sx={{ ml: 2 }}
                      disabled={field.id === "email" || field.id === "uuid"}
                      onClick={() => {
                        setWorkingConfig({
                          ...workingConfig,
                          fields: workingConfig.fields.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </Sheet>
                );
              })}
            </Box>
            {/* Permissions */}
            <PermissionsTable
              rows={permissions}
              onUpdatePermission={(permission) => {
                const newPermissions = workingConfig.permissions;
                newPermissions[permission.email] = {
                  read: permission.read,
                  write: permission.write,
                  admin: permission.admin,
                };
                setWorkingConfig({
                  ...workingConfig,
                  permissions: newPermissions,
                });
              }}
              onDeletePermission={(record: PermissionRecord) => {
                const newPermissions = workingConfig.permissions;
                delete newPermissions[record.email];
                setWorkingConfig({
                  ...workingConfig,
                  permissions: newPermissions,
                });
              }}
              onCreatePermission={(record: PermissionRecord) => {
                setWorkingConfig({
                  ...workingConfig,
                  permissions: {
                    ...workingConfig.permissions,
                    [record.email]: {
                      read: record.read,
                      write: record.write,
                      admin: record.admin,
                    },
                  },
                });
              }}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
