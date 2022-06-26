import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { useRecoilState } from "recoil";
import { accountState } from "../atoms/account";

export const Header = ({ isLanding }) => {
  const [account, setAccount] = useRecoilState(accountState);

  const connect = async () => {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "95f65ab099894076814e8526f52c9149",
          },
        },
      };
      const web3Modal = new Web3Modal({
        //network: "mainnet",
        providerOptions,
      });
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const [account] = await web3.eth.getAccounts();
      setAccount(account);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnect = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "95f65ab099894076814e8526f52c9149",
        },
      },
    };
    const web3Modal = new Web3Modal({
      //network: "mainnet",
      providerOptions,
    });
    await web3Modal.clearCachedProvider();
    localStorage.clear();
    setAccount("");
  };

  return (
    <Box>
      <Flex minH={"64px"} alignItems={"center"} justifyContent={"space-between"} py="8" px="4">
        <Link fontSize={isLanding ? "2xl" : "lg"} fontWeight={"bold"} href="/" _focus={{ boxShadow: "none" }}>
          XrossRent
        </Link>
        <Flex gap={"1"}>
          <>
            {!isLanding && (
              <>
                {!account ? (
                  <Button onClick={connect} fontSize={"xs"} rounded={"2xl"}>
                    Connect Wallet
                  </Button>
                ) : (
                  <Button fontSize={"xs"} maxWidth={"32"} rounded={"2xl"} onClick={disconnect}>
                    <Text noOfLines={1}>{account}</Text>
                  </Button>
                )}
              </>
            )}
          </>
        </Flex>
      </Flex>
    </Box>
  );
};
