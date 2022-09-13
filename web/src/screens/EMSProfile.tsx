import { Box, Button, Checkbox, Sheet, TextField, Typography } from "@mui/joy";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEMSEmployee,
  getEMSProfile,
  linkEMSProfile,
  updateEMSEmployee,
} from "../helpers/firebase";
import { Config, EMSField, EMSProfile, User } from "../helpers/types";

interface Props {
  config: Config | null;
  user: User;
  write: boolean;
  isOnDashboard?: boolean;
}

export default function EMS(props: Props) {
  const { config, write, user, isOnDashboard } = props;
  const id = useParams().id;
  const navigate = useNavigate();
  const [data, setData] = React.useState<EMSProfile>({
    email: "",
  });
  const [fields, setFields] = React.useState<EMSField[]>([]);
  const [existingProfile, setExistingProfile] = React.useState<boolean>(false);
  // Run once on mount
  React.useEffect(() => {
    // Check for profile
    if (id) {
      getEMSProfile(id)
        .then((profile) => {
          if (profile) {
            setExistingProfile(true);
            setData(profile);
          }
        })
        .catch((e) => {
          alert(e);
        });
    }
    if (isOnDashboard === true) {
      getEMSProfile(null)
        .then((profile) => {
          console.log("profile", profile);
          if (profile) {
            setExistingProfile(true);
            setData(profile);
          }
        })
        .catch((e) => {
          alert(e);
        });
    }
  }, [id, isOnDashboard]);

  React.useEffect(() => {
    if (config?.ems) {
      setFields(config.ems.fields);
    }
  }, [config]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isOnDashboard ? null : (
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
          <Button
            disabled={!write}
            variant="solid"
            onClick={() => {
              if (write) {
                if (existingProfile) {
                  updateEMSEmployee(data)
                    .then(() => {
                      alert("Profile updated");
                    })
                    .catch((e) => {
                      alert(e);
                    });
                } else {
                  createEMSEmployee(data)
                    .then(() => {
                      alert("Profile created");
                      navigate("/ems");
                    })
                    .catch((e) => {
                      alert(e);
                    });
                }
              }
            }}
          >
            {existingProfile ? "Update" : "Create"} Profile
          </Button>
        </Box>
      )}

      <Sheet
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          borderRadius: "sm",
          mt: 2,
        }}
      >
        {fields.map((field) => {
          if (
            field.type === "text" ||
            field.type === "number" ||
            field.type === "date"
          ) {
            if (field.id === "uuid") {
              if (data["uuid"] !== undefined) {
                return (
                  <TextField
                    variant="soft"
                    type={field.type}
                    disabled={true}
                    sx={{ maxWidth: 300, mt: 1 }}
                    key={field.id}
                    required={field.required}
                    label={field.name}
                    value={data?.[field.id]}
                  />
                );
              } else {
                return (
                  <Button
                    variant="solid"
                    disabled={data.email !== user.email}
                    sx={{ width: 300 }}
                    onClick={() => {
                      linkEMSProfile()
                        .then(() => {
                          alert(
                            "Successfully linked profile, page will now reload."
                          );
                          // this isn't working
                          navigate("/", { replace: true });
                        })
                        .catch((e) => {
                          alert(e);
                        });
                    }}
                  >
                    Link Account
                  </Button>
                );
              }
            } else {
              return (
                <TextField
                  variant="soft"
                  type={field.type}
                  disabled={
                    !write || (write && existingProfile && field.id === "email")
                  }
                  sx={{ maxWidth: 300, mt: 1 }}
                  key={field.id}
                  required={field.required}
                  label={field.name}
                  value={data?.[field.id]}
                  onChange={(e) => {
                    setData({ ...data, [field.id]: e.target.value });
                  }}
                />
              );
            }
          } else if (field.type === "checkbox") {
            return (
              <Checkbox
                color="success"
                label={field.name}
                disabled={!write}
                sx={{ mt: 1 }}
                key={field.id}
                required={field.required}
                checked={data?.[field.id] ?? false}
                onChange={(e) => {
                  setData({ ...data, [field.id]: e.target.checked });
                }}
              />
            );
          } else {
            return null;
          }
        })}
      </Sheet>
    </Box>
  );
}
