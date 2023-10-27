import {
  Box,
  Divider,
  Drawer,
  type DrawerProps,
  List,
  ListItem,
  ListItemButton,
} from "@mui/joy";

export type NavigationDrawer = Pick<DrawerProps, "open" | "onClose">;

export function NavigationDrawer({ open, onClose }: NavigationDrawer) {
  return (
    <Drawer open={open} onClose={onClose}>
      <Box role="presentation">
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text) => (
            <ListItem key={text}>
              <ListItemButton>{text}</ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text) => (
            <ListItem key={text}>
              <ListItemButton>{text}</ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
