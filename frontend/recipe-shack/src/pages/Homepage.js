import React, { useState, useEffect } from "react";
import { Flex, Stack } from "@chakra-ui/react";
import IngredientsSearch from "../components/IngridentsSearch";
import RecipeSearch from "../components/RecipeSearch";
import Navbar from "../components/Navbar";
import axios from "axios";

const Homepage = () => {
  const [ingredients, setIngredients] = useState([]);

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
          <IngredientsSearch callback={setIngredients} />
          <RecipeSearch ingredients={ingredients} />
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Homepage;
