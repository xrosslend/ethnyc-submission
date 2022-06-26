import { Grid, Box, Button } from "@chakra-ui/react";
import { Card } from "./Card";

export const Borrow = ({ card }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <Card card={card} />
      <Box border="1px" borderColor="gray.200" rounded={"2xl"}>
        <Button backgroundColor="red.400" _hover={{ bg: "red.500" }} color="white">
          Confirm
        </Button>
      </Box>
    </Grid>
  );
};
