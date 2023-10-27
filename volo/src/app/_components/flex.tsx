import { Stack, type StackProps } from "@mui/joy";

export const Flex = ({ direction = "row", ...rest }: StackProps) => {
  return <Stack direction={direction} {...rest} />;
};
