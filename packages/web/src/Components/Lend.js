import { Grid, Box, Button, FormControl, FormLabel, Input, VStack, Checkbox, Stack, Select } from "@chakra-ui/react";
import { Card } from "./Card";

export const Lend = ({ card }) => {
  const lend = () => {
    console.log("test");
    const relay = {};
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <Card card={card} />
      <Box border="1px" borderColor="gray.200" rounded={"2xl"} p="8">
        <VStack spacing={3} mb="12">
          <FormControl>
            <FormLabel htmlFor="text">Price Per Day</FormLabel>
            <Input id="text" type="price" placeholder="USDC" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="currency">Currency</FormLabel>
            <Select id="currency">
              <option value="option1">USDC</option>
              <option value="option2" disabled>
                WETH
              </option>
              <option value="option2" disabled>
                WMATIC
              </option>
            </Select>
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
              <Checkbox defaultChecked size="sm">
                Cronos
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                SKALE
              </Checkbox>
            </Stack>
          </FormControl>
        </VStack>
        <Button
          backgroundColor="red.400"
          _hover={{ bg: "red.500" }}
          color="white"
          width="100%"
          rounded={"2xl"}
          onClick={lend}
        >
          Confirm
        </Button>
      </Box>
    </Grid>
  );
};
