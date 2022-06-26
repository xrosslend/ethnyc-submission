import { Text } from "@chakra-ui/react";
import { Cards } from "../components/Cards";
import { Layout } from "../components/Layout";

export const IndexPage = () => {
  const cards = [
    { collection: "collection", name: "name", image: "https://asia.olympus-imaging.com/content/000107506.jpg" },
    { collection: "collection", name: "name", image: "https://asia.olympus-imaging.com/content/000107506.jpg" },
    { collection: "collection", name: "name", image: "https://asia.olympus-imaging.com/content/000107506.jpg" },
  ];

  return (
    <Layout>
      <Text mb="6" fontSize={"xl"} fontWeight="bold" color="gray.700">
        Available NFTs to Borrow
      </Text>
      <Cards cards={cards} to="borrow" />
    </Layout>
  );
};
