import {
  Grid,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { Card } from "./Card.js";

export const Lend = ({ card }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <Card card={card} />
      <Box border="1px" borderColor="gray.200" rounded={"2xl"} p="8">
        <VStack spacing={3} mb="12">
          <FormControl>
            <FormLabel htmlFor="email">Price Per Day</FormLabel>
            <Text>0.1 ETH</Text>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Allowed Chain</FormLabel>
            <UnorderedList>
              <ListItem fontSize="sm">Optimism</ListItem>
              <ListItem fontSize="sm">Boba</ListItem>
              <ListItem fontSize="sm">Polygon</ListItem>
              <ListItem fontSize="sm">Gnosis Chain</ListItem>
            </UnorderedList>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Period</FormLabel>
            <Input id="email" type="email" />
          </FormControl>
        </VStack>
        <Button backgroundColor="red.400" _hover={{ bg: "red.500" }} color="white" width="100%" rounded={"2xl"}>
          Confirm
        </Button>
      </Box>
    </Grid>
  );
};
