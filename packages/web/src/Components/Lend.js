import { Grid, Box } from "@chakra-ui/react";
import { Card } from "./Card";

export const Lend = ({ card }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <Card card={card} />
      <Box border="1px" borderColor="gray.200" rounded={"2xl"} />
    </Grid>
  );
};
