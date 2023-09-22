import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export default function CreateTag(props: { tag: string }) {
  const [tag, setTag] = useState<string | number>();
  const [properties, setProperties] = useState<string>("");
  const [propertyList, setPropertyList] = useState<string[]>([]);
  const [repeatTag, setRepeatTag] = useState<boolean>(false);

  useEffect(function () {
    setTag(props.tag);
    if (logseq.settings!.savedTags[props.tag]) {
      setRepeatTag(true);
    } else {
      setRepeatTag(false);
    }
  });

  function handleSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (properties === "") {
        logseq.UI.showMsg(
          "Please key in at least one property or ensure a tag is selected",
          "error",
        );
        return;
      } else {
        const arr: string[] = properties
          .trim()
          .split(",")
          .map((p) => p.trim());
        setPropertyList((prevState) => [...prevState, ...arr]);
        setProperties("");
      }
    }
  }

  function saveProperty() {
    if (propertyList.length === 0) {
      logseq.UI.showMsg(
        "Please key in at least one property or ensure a tag is selected",
        "error",
      );
      return;
    } else {
      let tagsObj = logseq.settings!.savedTags;

      tagsObj[props.tag] = propertyList;

      logseq.updateSettings({
        savedTags: tagsObj,
      });

      setPropertyList([]);
      logseq.hideMainUI();
    }
  }
  return (
    <Flex background="transparent" justifyContent="end">
      <Box height="full">
        <Button colorScheme="red">Button</Button>
      </Box>
    </Flex>
  );
}
