import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Button,
} from "@mui/material";

import {
  Folder,
  FolderOpen,
  Apartment,
  BusinessCenter,
  Inventory2,
  Category,
  Description,
  ExpandLess,
  ExpandMore,
  MoreVert,
  UnfoldMore,
  UnfoldLess,
} from "@mui/icons-material";

const FolderTree = ({ data, level = 0, renderFileMenu, icons = {} }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Рекурсивна функция за обхождане на дървото и рендериране на възлите
  const expandAll = () => {
    const allExpanded = {};

    const walk = (obj, path = []) => {
      Object.entries(obj).forEach(([key, value]) => {
        const nodeKey = [...path, key].join("-");

        allExpanded[nodeKey] = true;

        if (!Array.isArray(value)) {
          walk(value, [...path, key]);
        }
      });
    };

    walk(data);

    setExpanded(allExpanded);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  const renderNode = (node, path = [], depth = 0) => {
    return Object.entries(node).map(([key, value]) => {
      const nodeKey = [...path, key].join("-");

      const isFileArray = Array.isArray(value);

      if (isFileArray) {
        return (
          <Box key={nodeKey}>
            <ListItemButton
              sx={{ pl: depth * 3 + 2 }}
              onClick={() => toggle(nodeKey)}
            >
              <ListItemIcon>
                <Category />
              </ListItemIcon>

              <ListItemText primary={`${key} (${value.length})`} />

              {expanded[nodeKey] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={expanded[nodeKey]}>
              <List>
                {value.map((file) => (
                  <ListItemButton key={file.id} sx={{ pl: depth * 3 + 5 }}>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>

                    <ListItemText
                      primary={file.originalname || file.filename}
                      secondary={file.description}
                    />

                    {renderFileMenu(file)}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        );
      }

      let Icon = Folder;

      if (depth === 0) Icon = icons.level0 || Apartment;

      if (depth === 1) Icon = icons.level1 || BusinessCenter;

      if (depth === 2) Icon = icons.level2 || Inventory2;

      return (
        <Box key={nodeKey}>
          <ListItemButton
            sx={{ pl: depth * 3 + 2 }}
            onClick={() => toggle(nodeKey)}
          >
            <ListItemIcon>
              {expanded[nodeKey] ? <FolderOpen /> : <Icon />}
            </ListItemIcon>

            <ListItemText primary={key} />

            {expanded[nodeKey] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={expanded[nodeKey]}>
            <List>{renderNode(value, [...path, key], depth + 1)}</List>
          </Collapse>
        </Box>
      );
    });
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<UnfoldMore />}
          onClick={expandAll}
        >
          Expand All
        </Button>

        <Button
          variant="outlined"
          startIcon={<UnfoldLess />}
          onClick={collapseAll}
        >
          Collapse All
        </Button>
      </Stack>

      <List>{renderNode(data)}</List>
    </>
  );
};

export default FolderTree;
