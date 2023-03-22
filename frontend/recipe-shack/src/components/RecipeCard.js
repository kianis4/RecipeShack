import { useState, useEffect } from "react";
import { Card, IconButton, Image, Text, Link } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

function RecipeCard(props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const favroites = props.favorites;
  const id = props.id;
  const url = (str) => {
    str = str.toLowerCase();
    str = str.replace(/(\s+)(?=[^-])/g, '-');
    return str+'-'+props.id;
  }
  const postRequestConf = {
    withCredentials: true,
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  useEffect(() => {
    const foundObject = favroites.find((obj) => obj.ID === id);
    if (foundObject) {
      setIsFavorite(true);
    }
  }, [favroites, id]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      console.log("My key", id);
      axios
        .post("/api/addfavorite/", { recipe_id: id }, postRequestConf)
        .then((res) => {
          console.log("This was favorited");
        });
    } else {
      axios
        .post("/api/removefavorite/", { recipe_id: id }, postRequestConf)
        .then((res) => {
          console.log("This was unfavorited");
        });
    }
  };

  return (
    <Card
      p={2}
      w="100%"
      h="100%"
      borderRadius="md"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text
        textAlign="center"
        fontSize="lg"
        m={2}
        w="100%"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.title}
      </Text>
      <IconButton
        position="absolute"
        top="0"
        right="0"
        size={"sm"}
        aria-label="Favorite"
        icon={<FaStar />}
        bg={isFavorite ? "yellow.500" : "white"}
        variant="outline"
        colorScheme="black"
        onClick={handleFavoriteClick}
      />
      <Link href={"https://www.food.com/recipe/"+url(props.title)}>
      <Image
        h={200}
        w={200}
        objectFit="cover"
        src={props.imageSrc}
        alt={props.title}
      />
      </Link>

    </Card>
  );
}

export default RecipeCard;
