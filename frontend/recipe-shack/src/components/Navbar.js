import { Box, Flex, Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const postRequestConf = {
  withCredentials: true,
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
};
const Navbar = () => {
  const [username, setUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    axios.get("/api/getsession/").then((res) => {
      console.log(res);
      setUsername(res.data.data);
    });
  }, []);

  return (
    <Flex
      width="100vw"
      backgroundColor="gray.200"
      pos="absolute"
      top={0}
      left={0}
      right={0}
      zIndex={1}
      p={4}
      alignItems="center"
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center">
        {username && (
          <Box mr={4} fontWeight="bold">
            Hi {username}
          </Box>
        )}
        <Link to="/">
          <Button
            borderRadius={0}
            type="submit"
            variant="solid"
            colorScheme="teal"
            mr={4}
            onClick={() => {
              axios.post("/api/logout/", {}, postRequestConf).then((res) => {
                console.log(res);
              });
            }}
          >
            Logout
          </Button>
        </Link>
        <Link
          to={location.pathname === "/favorites" ? "/homepage" : "/favorites"}
        >
          <Button
            borderRadius={0}
            type="submit"
            variant="solid"
            colorScheme="teal"
            mr={4}
          >
            {location.pathname === "/favorites" ? "Homepage" : "Favorites"}
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default Navbar;
