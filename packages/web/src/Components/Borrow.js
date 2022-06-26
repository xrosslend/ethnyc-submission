import { Grid, Box, Button, FormControl, FormLabel, Input, VStack, Checkbox, Stack } from "@chakra-ui/react";
import { Card } from "./Card";

export const Borrow = ({ card }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <Card card={card} />
      <Box border="1px" borderColor="gray.200" rounded={"2xl"} p="8">
        <VStack spacing={3} mb="12">
          <FormControl>
            <FormLabel htmlFor="email">Price Per Day</FormLabel>
            <Input id="email" type="email" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Currency</FormLabel>
            <Input id="currency" type="text" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Allowed Chain</FormLabel>
            <Stack justify={"left"}>
              <Checkbox defaultChecked size="sm">
                Optimism
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                Boba
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                Polygon
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                Gnosis Chain
              </Checkbox>
            </Stack>
          </FormControl>
        </VStack>
        <Button backgroundColor="red.400" _hover={{ bg: "red.500" }} color="white" width="100%" rounded={"2xl"}>
          Confirm
        </Button>
      </Box>
    </Grid>
  );
};
