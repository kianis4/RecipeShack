import React, { useState, useEffect } from "react";
import { FormControl, Text, Stack, Box } from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";

import { myIngredients } from "../ingredients";

const IngredientsSearch = ({ callback }) => {
  const [ingredients, setIngredients] = useState([]);
  const pickerItems = myIngredients;

  const handleSelectedItemsChange = (ingredients) => {
    if (ingredients) {
      setIngredients(ingredients);
    }
  };

  useEffect(() => {
    const ingredientValues = ingredients.map((ingredient) => ingredient.value);
    callback(ingredientValues);
  }, [ingredients]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <Box w="30%" p={2} border="1px solid black" pos="relative" mt={50}>
      <Text fontSize="xl" textAlign="center" mb={2}>
        Add ingredients
      </Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl mb={4}>
            <CUIAutoComplete
              limitTags={5}
              tagStyleProps={{ rounded: "full" }}
              placeholder="Type an ingredient"
              hideToggleButton={true}
              items={pickerItems}
              selectedItems={ingredients}
              disableCreateItem={true}
              onSelectedItemsChange={(changes) =>
                handleSelectedItemsChange(changes.selectedItems)
              }
            />
          </FormControl>
        </Stack>
      </form>
    </Box>
  );
};

export default IngredientsSearch;
