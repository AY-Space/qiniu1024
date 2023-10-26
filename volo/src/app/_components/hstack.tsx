import { Stack, type StackProps } from "@mui/joy";

export const HStack = (props: StackProps) => {
  const { children, ...rest } = props;
  return (
    <Stack direction="row" {...rest}>
      {children}
    </Stack>
  );
};
