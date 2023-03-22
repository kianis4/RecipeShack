import React, { useEffect, useState, useRef } from "react";
import {
  FormControl,
  Grid,
  Input,
  Button,
  Text,
  Stack,
  Icon,
  Box,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import CaloriesModal from "./Modals/CaloriesModal";
import CookTimeModal from "./Modals/CookTimeModal";
import RatingModal from "./Modals/RatingModal";
import RecipeCard from "./RecipeCard";
import axios from "axios";
import Cookies from "js-cookie";
const postRequestConf = {
  withCredentials: true,
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
};
const RecipeSearch = ({ ingredients }) => {
  const [dish, setDish] = useState("");
  const [appliedCalories, setAppliedCalories] = useState(0);
  const [appliedCookTime, setAppliedCookTime] = useState(0);
  const [appliedRating, setAppliedRating] = useState(0);
  const [myData, setMyData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const inputRef = useRef("");

  useEffect(() => {
    axios.get("/api/getfavorites/").then((res) => {
      console.log("MY FAVORITES", res.data.data);
    });
  }, []);

  useEffect(() => {
    const request = {
      dish: dish,
      ingredients: ingredients,
      calories: appliedCalories,
      cooktime: appliedCookTime,
      rating: appliedRating,
    };
    console.log("MY request", request);
    axios.post("/api/getrecipes/", request, postRequestConf).then((res) => {
      setMyData(res.data.data);
      console.log(res);
    });

    axios.get("/api/getfavorites/").then((res) => {
      setFavorites(res.data.data);
    });
  }, [ingredients, appliedCalories, appliedCookTime, appliedRating, dish]);

  useEffect(() => {
    console.log("MY DATA", myData);
  }, [myData]);

  const handleSearchClick = () => {
    const inputValue = inputRef.current.value;

    setDish(inputValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Box w="70%" p={2}>
      <Text fontSize="xl" textAlign="center" mb={2} pos="relative" mt={50}>
        Search Recipes
      </Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl mb={4}>
            <Input type="text" placeholder="Enter dish name" ref={inputRef} />
          </FormControl>
          <Button
            type="submit"
            rightIcon={<Icon as={FaSearch} />}
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </Stack>
      </form>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
        <CaloriesModal callback={setAppliedCalories} />
        <CookTimeModal callback={setAppliedCookTime} />
        <RatingModal callback={setAppliedRating} />
      </Grid>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
        {myData.map((recipe) => {
          return (
            <RecipeCard
              title={recipe.Name}
              imageSrc={recipe.ImageURL}
              key={recipe.ID}
              id={recipe.ID}
              favorites={favorites}
            />
          );
        })}
      </Grid>
    </Box>
  );
};

export default RecipeSearch;
