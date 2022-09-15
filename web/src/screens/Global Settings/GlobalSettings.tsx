import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { Config, User } from "../../helpers/types";
import { Sheet } from "@mui/joy";
import GeneralConfig from "./General/GeneralConfig";
import EMSConfig from "./EMS/EMSConfig";
import APIConfig from "./API/APIConfig";
interface Props {
  config: Config | null;
  user: User | null;
}
export default function GlobalSettings(props: Props) {
  const { config, user } = props;
  return (
    <Tabs
      aria-label="Basic tabs"
      defaultValue={0}
      sx={{ backgroundColor: "transparent" }}
    >
      <TabList>
        <Tab>General</Tab>

        <Tab>EMS</Tab>
        <Tab>API</Tab>
      </TabList>
      <TabPanel value={0}>
        <Sheet
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "sm",
            p: 2,
          }}
        >
          <GeneralConfig
            generalConfig={config?.general}
            user={user}
            mode="edit"
          />
        </Sheet>
      </TabPanel>

      <TabPanel value={1}>
        <Sheet
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "sm",
            p: 2,
          }}
        >
          <EMSConfig emsConfig={config?.ems} user={user} />
        </Sheet>
      </TabPanel>
      <TabPanel value={2}>
        <Sheet
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "sm",
            p: 2,
          }}
        >
          <APIConfig emsConfig={config?.ems} user={user} />
        </Sheet>
      </TabPanel>
    </Tabs>
  );
}
