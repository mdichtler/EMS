import { Box, Sheet, Typography, Checkbox, Button, TextField } from "@mui/joy";
import React from "react";
import {  PermissionRecord } from "../helpers/types";

interface Props {
  rows: PermissionRecord[];
  onDeletePermission: (item: PermissionRecord) => void;
  onUpdatePermission: (item: PermissionRecord) => void;
  onCreatePermission: (item: PermissionRecord) => void;
}
export default function PermissionsTable(props: Props) {
  const { rows, onDeletePermission, onUpdatePermission, onCreatePermission } =
    props;
  console.log('Rows', rows)
  const [permissions, setPermissions] = React.useState<PermissionRecord>({
    email: "",
    read: false,
    write: false,
    admin: false,
  });
  function buildRow(item: PermissionRecord, index: number) {
    return (
      <React.Fragment key={item.email}>
        <Typography level="body2">{item.email}</Typography>
        <Checkbox
          color="success"
          label=""
          checked={item.read}
          onChange={(e) => {
            let temp = { ...item };
            temp.read = e.target.checked;
            temp.write = false;
            temp.admin = false;
            onUpdatePermission(temp);
          }}
        />
        <Checkbox
          color="success"
          label=""
          checked={item.write}
          onChange={(e) => {
            let temp = { ...item };
            temp.write = e.target.checked;
            temp.read = true;
            temp.admin = false;
            onUpdatePermission(temp);
          }}
        />
        <Checkbox
          color="success"
          label=""
          checked={item.admin}
          onChange={(e) => {
            let temp = { ...item };
            temp.read = true;
            temp.write = true;
            temp.admin = e.target.checked;
            onUpdatePermission(temp);
          }}
        />
        <Box>
          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              onDeletePermission(item);
            }}
          >
            Delete
          </Button>
        </Box>
      </React.Fragment>
    );
  }

  return (
    <Box sx={{ display: "flex", width: "100%", mt: 2 }}>
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "sm",
          gridColumn: "1/-1",
          bgcolor: "background.componentBg",
          display: { xs: "none", sm: "grid" },
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          "& > *": {
            p: 2,
            "&:nth-child(n):not(:nth-last-child(-n+0))": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        <Typography level="body3" fontWeight="md" noWrap>
          Email
        </Typography>
        <Typography level="body3" fontWeight="md" noWrap>
          Read
        </Typography>
        <Typography level="body3" fontWeight="md" noWrap>
          Write
        </Typography>
        <Typography level="body3" fontWeight="md" noWrap>
          Admin
        </Typography>
        <Typography level="body3" fontWeight="md" noWrap>
          Actions
        </Typography>

        {rows.map((item, index) => buildRow(item, index))}
        <React.Fragment key={"empty"}>
          <TextField
            variant="outlined"
            placeholder="Email"
            value={permissions?.email}
            onChange={(e) => {
              setPermissions({ ...permissions, email: e.target.value });
            }}
          />
          <Checkbox
            color="success"
            label=""
            checked={permissions?.read}
            onChange={(e) => {
              setPermissions({
                ...permissions,
                read: e.target.checked,
                write: false,
                admin: false,
              });
            }}
          />
          <Checkbox
            color="success"
            label=""
            checked={permissions?.write}
            onChange={(e) => {
              if (e.target.checked === true) {
                setPermissions({
                  ...permissions,
                  write: true,
                  read: true,
                  admin: false,
                });
              } else {
                setPermissions({
                  ...permissions,
                  write: false,
                  read: true,
                  admin: false,
                });
              }
            }}
          />
          <Checkbox
            color="success"
            label=""
            checked={permissions?.admin}
            onChange={(e) => {
              if (e.target.checked === true) {
                setPermissions({
                  ...permissions,
                  admin: true,
                  read: true,
                  write: true,
                });
              } else {
                setPermissions({
                  ...permissions,
                  admin: false,
                  read: true,
                  write: true,
                });
              }
            }}
          />
          <Box>
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                if (permissions.email !== "") {
                  onCreatePermission(permissions);
                  setPermissions({
                    email: "",
                    read: false,
                    write: false,
                    admin: false,
                  });
                } else {
                  alert("Please enter an email");
                }
              }}
            >
              Add
            </Button>
          </Box>
        </React.Fragment>
      </Sheet>
    </Box>
  );
}
