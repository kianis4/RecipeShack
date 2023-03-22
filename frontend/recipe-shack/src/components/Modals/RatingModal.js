import React, { useState, useEffect } from "react";
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

function RatingModal({callback}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bgColor, setBgColor] = useState("white");
  const [selectedRating, setSelectedRating] = useState(0);
  const [appliedRating, setAppliedRating] = useState(0);


  useEffect(() => {
    callback(appliedRating);
  }, [appliedRating]);

  const handleApply = () => {
    setAppliedRating(selectedRating);
    onClose();
    if (selectedRating) {
      setBgColor("teal");
    }
  };




  return (
    <>
      <Button variant="outline" bg={bgColor} onClick={onOpen}>
        Ratings
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Rating</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
              <Button
                variant="outline"
                bg={selectedRating === 1 ? "teal" : "white"}
                onClick={() => setSelectedRating(1)}
                disabled={selectedRating === "1 Star"}
              >
                1 Star
              </Button>
              <Button
                variant="outline"
                bg={selectedRating === 2 ? "teal" : "white"}
                onClick={() => setSelectedRating(2)}
                disabled={selectedRating === "2 Star"}
              >
                2 Star
              </Button>
              <Button
                variant="outline"
                bg={selectedRating === 3 ? "teal" : "white"}
                onClick={() => setSelectedRating(3)}
                disabled={selectedRating === "3 Star"}
              >
                3 Star
              </Button>
              <Button
                variant="outline"
                bg={selectedRating === 4 ? "teal" : "white"}
                onClick={() => setSelectedRating(4)}
                disabled={selectedRating === "4 Star"}
              >
                4 Star
              </Button>
              <Button
                variant="outline"
                bg={selectedRating === 5 ? "teal" : "white"}
                onClick={() => setSelectedRating(5)}
                disabled={selectedRating === "5 Star"}
              >
                5 Star
              </Button>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setSelectedRating(0);
                setAppliedRating(0);
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
              variant="ghost"
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RatingModal;
