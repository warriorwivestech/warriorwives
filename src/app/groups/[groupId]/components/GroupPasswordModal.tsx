"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
} from "@chakra-ui/react";

export default function GroupPasswordModal({
  isOpen,
  onClose,
  password,
  setCorrectPassword,
}: {
  isOpen: boolean;
  password: string | undefined;
  onClose: () => void;
  setCorrectPassword: (state: boolean) => void;
}) {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredPassword(event.target.value);
  };

  const handleJoinGroup = () => {
    if (enteredPassword === password) {
      setCorrectPassword(true);
      onClose();
    } else {
      setCorrectPassword(false);
      setValidationError("Incorrect password.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Password"
            value={enteredPassword}
            onChange={handlePasswordChange}
            isInvalid={!!validationError}
          />

          {validationError && <p style={{ color: "red" }}>{validationError}</p>}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={handleJoinGroup}>
            Join Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
