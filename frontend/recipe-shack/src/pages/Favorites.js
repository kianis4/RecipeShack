import React, { useEffect } from "react";
import { Flex, Stack } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import FavoritesSearch from "../components/FavoritesSearch";
import axios from "axios";

const Favorites = () => {
  useEffect(() => {
    axios.get("/api/getsession/").then((res) => {
      if (!res.data.status) {
        window.location.href = "/";
      }
    });
  }, []);

  return (
    <Flex p={4}>
      <Stack w="100vw" maxW="1000px" spacing={4} p={2}>
        <Flex w="100vw" flexWrap="wrap">
          <Navbar />
          <FavoritesSearch />
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Favorites;
