import React, { useState, useEffect } from "react";
import {
  Grid,
  Text,
  Stack,
  Box,
} from "@chakra-ui/react";
import FavoritesCard from "./FavoritesCard";
import axios from "axios";

const FavoritesSearch = () => {
  const [favorites, setFavorites] = useState([]); 

  useEffect(() => {
    axios.get("/api/getfavorites/").then((res) => {
      setFavorites(res.data.data);
    });
  }, []);

  const deleteFavorite = (id) => {
    const updatedFavorites = favorites.filter((favorite) => favorite.ID !== id);
    setFavorites(updatedFavorites);
  };


  
  return (
<Box w="100%" p={2}>
  <Text fontSize="xl" textAlign="center" mb={2} pos="relative" mt={50}>
    Search Favorites
  </Text>
  
  <Stack spacing={4}>

    <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
      
    { favorites.map((recipe) => {
          return (
            <FavoritesCard
              title={recipe.Name}
              imageSrc={recipe.ImageURL}
              key={recipe.ID}
              id={recipe.ID}
              favorites={favorites}
              onDelete={deleteFavorite}
     
            />
          );

        }
        )
        }


      </Grid>
  </Stack>


</Box>
  );
};

export default FavoritesSearch;
