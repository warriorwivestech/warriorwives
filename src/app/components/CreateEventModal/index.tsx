"use client";

import {
  HandleInputChangeParams,
  NewEvent,
  requiredEventField,
} from "@/app/types/events";
import { FileWithPreview } from "@/app/types/groups";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  Radio,
  HStack,
  RadioGroup,
  Textarea,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

export function CreateEventModal({ groupName }: { groupName: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [bannerImage, setBannerImage] = useState<FileWithPreview | null>(null);
  const [photos, setPhotos] = useState<FileWithPreview[]>([]);
  const [dirty, setDirty] = useState<requiredEventField>({
    name: false,
    description: false,
    dateTime: false,
  });

  const [input, setInput] = useState<NewEvent>({
    name: "",
    description: "",
    location: "",
    online: false,
    link: "",
    dateTime: "",
    displayPhoto: "",
    photos: [],
  });

  const handleCloseModal = () => {
    onClose();
    setBannerImage(null);
    setPhotos([]);
    setDirty({
      name: false,
      description: false,
      dateTime: false,
    });
    setInput({
      name: "",
      description: "",
      location: "",
      online: false,
      link: "",
      dateTime: "",
      displayPhoto: "",
      photos: [],
    });
  };

  const getFormattedCurrentDateTime = () => {
    const now = new Date();
    // Adjusting date to UTC can help with timezone differences if needed
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();

    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}T${formattedHours}:${formattedMinutes}`;
  };

  // Use this function to get the min attribute value
  const minDateTime = getFormattedCurrentDateTime();

  const handleInputChange = ({ e, inputType }: HandleInputChangeParams) => {
    const value = typeof e === "string" ? e : e.target.value;

    const finalValue = inputType === "online" ? value === "Yes" : value;

    setInput((prev) => ({
      ...prev,
      [inputType]: finalValue,
    }));

    setDirty((prev) => ({
      ...prev,
      [inputType]: true,
    }));
  };

  const isNameError = dirty?.name && input?.name === "";
  const isDescriptionError = dirty?.description && input?.description === "";
  const isDateTimeError = dirty?.dateTime && input?.dateTime === "";

  const fileTypes = ["JPG", "JPEG", "PNG"];

  // Single image
  const handleSingleChange = (file: File) => {
    if (file) {
      if (bannerImage?.url) URL.revokeObjectURL(bannerImage.url);

      const newFileWithUrl = {
        file: file,
        url: URL.createObjectURL(file),
      };

      setBannerImage(newFileWithUrl);

      // Get the blob

      // Set
      //   setInput((prev) => ({
      //     ...prev,
      //     ['displayPhoto']: IMAGE_BLOB,
      //   }));
    }
  };

  const handleSingleDelete = () => {
    if (bannerImage) URL.revokeObjectURL(bannerImage.url);
    setBannerImage(null);
  };

  // Multiple images
  const handleChange = (newFiles: FileList | File[]) => {
    const newFilesWithUrls: FileWithPreview[] = Array.from(newFiles).map(
      (file) => ({
        file,
        url: URL.createObjectURL(file),
      })
    );
    setPhotos((prevFiles) => [...prevFiles, ...newFilesWithUrls]);

    // Get the blob

    // Set
    //   setInput((prev) => ({
    //     ...prev,
    //     ['photos']: IMAGE_BLOB,
    //   }));
  };
  const handleDelete = (indexToDelete: number) => {
    URL.revokeObjectURL(photos[indexToDelete].url);
    setPhotos((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToDelete)
    );
  };

  const isButtonDisabled = () => {
    const conditions = [
      isDateTimeError,
      isDescriptionError,
      isNameError,
      input?.name === "",
      input?.description === "",
      input?.dateTime === "",
    ];

    return conditions.some((condition) => condition);
  };

  return (
    <>
      <Button onClick={onOpen}>Create new event</Button>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <ModalOverlay />
        <ModalContent minW="900px">
          <ModalHeader>Create new event for {groupName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} gap={6} display={"flex"} flexDirection={"column"}>
            {/* banner image */}
            <div className="flex flex-col gap-2">
              <FormLabel>Banner Image</FormLabel>
              <div className="flex flex-col justify-center w-[100%] items-center gap-6">
                {bannerImage && (
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <img
                      src={bannerImage.url}
                      alt={bannerImage.file.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        maxHeight: "350px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <Button
                      onClick={() => handleSingleDelete()}
                      width={100}
                      bgColor={"#FC8181 !important"}
                      _hover={{
                        bgColor: "#E53E3E !important",
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
                <FileUploader
                  multiple={false}
                  handleChange={handleSingleChange}
                  name="file"
                  types={fileTypes}
                />
              </div>
            </div>
            <Divider />

            <div className="flex flex-row gap-8">
              {/* name */}
              <FormControl isInvalid={isNameError}>
                {/* <FormLabel>Name</FormLabel> */}
                <Input
                  placeholder="Name"
                  type="name"
                  value={input?.name}
                  onChange={(e) =>
                    handleInputChange({ e: e, inputType: "name" })
                  }
                />
                {isNameError && (
                  <FormErrorMessage>Name is required.</FormErrorMessage>
                )}
              </FormControl>

              {/* date time */}
              <FormControl isInvalid={isDateTimeError}>
                {/* <FormLabel>Meeting Link</FormLabel> */}
                <Input
                  placeholder="Meeting Link"
                  type="datetime-local"
                  value={input?.dateTime}
                  min={minDateTime}
                  onChange={(e) =>
                    handleInputChange({ e: e, inputType: "dateTime" })
                  }
                />
                {isDateTimeError && (
                  <FormErrorMessage>
                    Date and time is required.
                  </FormErrorMessage>
                )}
              </FormControl>
            </div>

            {/* description */}
            <FormControl isInvalid={isDescriptionError}>
              {/* <FormLabel>Description</FormLabel> */}

              <Textarea
                height={200}
                resize={"none"}
                placeholder="Description for the event"
                value={input?.description}
                onChange={(e) =>
                  handleInputChange({ e: e, inputType: "description" })
                }
              />
              {isDescriptionError && (
                <FormErrorMessage>Description is required.</FormErrorMessage>
              )}
            </FormControl>

            {/* image */}
            <div className="flex flex-col gap-2">
              <FormLabel>Images</FormLabel>

              <div className="flex flex-col justify-center w-[100%] items-center gap-6">
                {photos.length > 0 && (
                  <SimpleGrid columns={3} spacing={10}>
                    {/* <button onClick={logFiles}>Log Uploaded Pictures</button> */}
                    {photos.map((photosObj, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 justify-center items-center"
                      >
                        {/* <p>File name: {fileObj.file.name}</p> */}
                        <img
                          src={photosObj.url}
                          alt={photosObj.file.name}
                          style={{
                            width: "200px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <Button
                          width={100}
                          onClick={() => handleDelete(index)}
                          bgColor={"#FC8181 !important"}
                          _hover={{
                            bgColor: "#E53E3E !important",
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </SimpleGrid>
                )}
                <FileUploader
                  multiple={true}
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                />
              </div>
            </div>

            {/* online */}
            <FormControl as="fieldset">
              <FormLabel as="legend">Is this an online event?</FormLabel>
              <RadioGroup
                defaultValue="No"
                value={input?.online ? "Yes" : "No"}
                onChange={(e) =>
                  handleInputChange({ e: e, inputType: "online" })
                }
              >
                <HStack spacing="24px">
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            {/* location */}
            {/* meeting link */}
            {!input?.online ? (
              <FormControl>
                <Input
                  placeholder="Location"
                  type="location"
                  value={input?.location}
                  onChange={(e) =>
                    handleInputChange({ e: e, inputType: "location" })
                  }
                />
              </FormControl>
            ) : (
              <FormControl>
                <Input
                  placeholder="Meeting Link"
                  type="link"
                  value={input?.link}
                  onChange={(e) =>
                    handleInputChange({ e: e, inputType: "link" })
                  }
                />
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              isDisabled={isButtonDisabled()}
              onClick={() => console.log(input)}
            >
              Save
            </Button>
            <Button onClick={() => handleCloseModal()}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
