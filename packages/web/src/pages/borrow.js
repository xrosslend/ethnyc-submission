import { Text } from "@chakra-ui/react";

import { Borrow } from "../components/Borrow";
import { Layout } from "../components/Layout";

export const BorrowPage = () => {
  const card = {
    collection: "collection",
    name: "name",
    image: "https://asia.olympus-imaging.com/content/000107506.jpg",
  };

  return (
    <Layout>
      <Text mb="6" fontSize={"xl"} fontWeight="bold" color="gray.700">
        Borrow NFT
      </Text>
      <Borrow card={card}></Borrow>
    </Layout>
  );
};
