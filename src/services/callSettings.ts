import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

const settings: SettingSchemaDesc[] = [
  {
    key: "addTypeProperty",
    type: "boolean",
    default: false,
    title: "Add Type Property",
    description: "Add type property when using power tag.",
  },
];

export default settings;
