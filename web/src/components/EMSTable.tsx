import { Box, Sheet, Typography, Checkbox, Button } from "@mui/joy";
import React from "react";
import { useNavigate } from "react-router-dom";
import { EMSProfile, EMSConfig } from "../helpers/types";

interface Props {
  rows: EMSProfile[];
  emsConfig: EMSConfig | null | undefined;
  role: number
}
export default function EMSTable(props: Props) {
    const navigate = useNavigate()
  const { rows, emsConfig, role } = props;
  const [columns, setColumns] = React.useState<string>("");
  function buildRow(item: EMSProfile) {
    return (
      <React.Fragment key={item.email}>
        {emsConfig?.fields.map((field) => {
          if (field.isTableField) {
            if (field.type === "checkbox") {
              return (
                <Checkbox
                  color="success"
                  label=""
                  checked={item[field.id]}
                  disabled
                />
              );
            } else if (field.type === "text" || field.type === "number" || field.type === "date") {
              return <Typography level="body2">{item[field.id]}</Typography>;
            } else {
              return null
            }

            
          } else {
            return null;
          }
        })}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              navigate(`/ems/view-employee/${item.id}`);
            }}
          >
            View
          </Button>
          <Button
            variant="solid"
            color="primary"
            disabled={role > 1 ? false : true}
            onClick={() => {
              navigate(`/ems/edit-employee/${item.id}`);
            }}
          >
            Edit
          </Button>
        </Box>
      </React.Fragment>
    );
  }

  React.useEffect(() => {
    let cols = "1fr ";
    if (emsConfig?.fields) {
      emsConfig.fields.forEach((field) => {
        if (field.isTableField) {
          cols += "1fr ";
        }
      });
    }
    setColumns(cols);
  }, [emsConfig]);

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
          gridTemplateColumns: columns, // add more rows by adding FR count
          "& > *": {
            p: 2,
            "&:nth-child(n):not(:nth-last-child(-n+0))": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        {emsConfig?.fields.map((field) => {
          if (field.isTableField) {
            return (
              <Typography level="body3" fontWeight="md" noWrap>
                {field.name}
              </Typography>
            );
          } else {
            return null;
          }
        })}
        <Typography level="body3" fontWeight="md" noWrap>
          Actions
        </Typography>

        {rows.map((item) => buildRow(item))}
      </Sheet>
    </Box>
  );
}
