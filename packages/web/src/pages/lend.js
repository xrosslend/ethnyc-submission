import { Text } from "@chakra-ui/react";

import { Lend } from "../components/Lend.js";
import { Layout } from "../components/Layout.js";

export const LendPage = () => {
  const card = {
    collection: "collection",
    name: "name",
    image: "https://asia.olympus-imaging.com/content/000107506.jpg",
  };

  return (
    <Layout>
      <Text mb="6" fontSize={"xl"} fontWeight="bold" color="gray.700">
        Lend NFT
      </Text>
      <Lend card={card}></Lend>
    </Layout>
  );
};
