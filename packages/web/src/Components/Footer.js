import { Flex, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Flex minH={"64px"} alignItems={"center"} justifyContent={"center"} p={{ base: 4 }} gap={"16px"}>
      <Text fontSize={"xs"} fontWeight={"medium"}>
        XrossRent
      </Text>
    </Flex>
  );
};
