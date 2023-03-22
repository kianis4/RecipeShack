import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Grid,
} from "@chakra-ui/react";

function CaloriesModal({callback}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bgColor, setBgColor] = useState("white");
  const [selectedCalories, setSelectedCalories] = useState(0);
  const [appliedCalories, setAppliedCalories] = useState(0);


  useEffect(() => {
    callback(appliedCalories);
  }, [appliedCalories]);

  const handleApply = () => {
    setAppliedCalories(selectedCalories);
    onClose();
    if (selectedCalories) {
      setBgColor("teal");
    }
  };


  return (
    <>
      <Button variant="outline" bg={bgColor} onClick={onOpen}>
        Calories
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Number of Calories</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
          <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>

            <Button
              variant="outline"
              bg={selectedCalories === 1 ? "teal" : "white"}
              onClick={() => setSelectedCalories(1)}
              disabled={selectedCalories === "0-250"}
            >
              0-250
            </Button>
            <Button
              variant="outline"
              bg={selectedCalories === 2 ? "teal" : "white"}
              onClick={() => setSelectedCalories(2)}
              disabled={selectedCalories === "250-500"}
            >
              250-500
            </Button>
            <Button
              variant="outline"
              bg={selectedCalories === 3 ? "teal" : "white"}
              onClick={() => setSelectedCalories(3)}
              disabled={selectedCalories === "500-1000"}
            >
              500-1000
            </Button>
            <Button
              variant="outline"
              bg={selectedCalories === 4 ? "teal" : "white"}
              onClick={() => setSelectedCalories(4)}
              disabled={selectedCalories === "1000-1500"}
            >
              1000-1500
            </Button>
            <Button
              variant="outline"
              bg={selectedCalories === 5? "teal" : "white"}
              onClick={() => setSelectedCalories(5)}
              disabled={selectedCalories === "1500-2500"}
            >
              1500-2500
            </Button>
            <Button
              variant="outline"
              bg={selectedCalories === 6 ? "teal" : "white"}
              onClick={() => setSelectedCalories(6)}
              disabled={selectedCalories === "2500+"}
            >
              2500+
            </Button>
          </Grid>


          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setSelectedCalories(0);
                setAppliedCalories(0);
                onClose();
                setBgColor("white");
              }}
            >
              Unselect filter
            </Button>
            <Button
              onClick={() => {
                handleApply();
              }}
              
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CaloriesModal;
