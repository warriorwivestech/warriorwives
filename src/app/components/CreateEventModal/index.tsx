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
import { MdDelete } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import IconText from "../common/icontext";
import { supabase } from "@/app/supabase";
import { apiClient } from "@/app/apiClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function CreateEventModal({
  groupName,
  groupId,
}: {
  groupName: string;
  groupId: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [bannerImage, setBannerImage] = useState<FileWithPreview | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [photos, setPhotos] = useState<FileWithPreview[]>([]);
  const [photosUrl, setPhotosUrl] = useState<string[]>([]);
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
  const router = useRouter();

  // Single image
  const handleSingleChange = async (file: File) => {
    if (file) {
      if (bannerImage?.url) URL.revokeObjectURL(bannerImage.url);

      const newFileWithUrl = {
        file: file,
        url: URL.createObjectURL(file),
      };

      // generate random filepath using a hash
      const filePath = `event-banners/${Math.random()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("warrior-wives-test")
        .upload(filePath, file);
      if (error) {
        console.log("Error uploading file: ", error.message);
      } else {
        console.log("File uploaded successfully: ", data);
        setBannerImageUrl(
          `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${data.fullPath}`
        );
      }

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
    // generate random filepath using a hash
    newFilesWithUrls.forEach(async (file) => {
      const filePath = `event-photos/${Math.random()}-${file.file.name}`;

      const { data, error } = await supabase.storage
        .from("warrior-wives-test")
        .upload(filePath, file.file);
      if (error) {
        console.log("Error uploading file: ", error.message);
      } else {
        console.log("File uploaded successfully: ", data);
        setBannerImageUrl(
          `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${data.fullPath}`
        );
      }

      setPhotosUrl((prev) => [
        ...prev,
        `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${data.fullPath}`,
      ]);
    });
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
      <Button
        onClick={onOpen}
        className="bg-black text-white hover:text-black mt-4"
      >
        <IconText icon={RiAdminFill}>Create a new event</IconText>
      </Button>
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
                    <Image
                      src={bannerImage.url}
                      alt={bannerImage.file.name}
                      width={200}
                      height={350}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "4px",
                        maxHeight: "350px",
                      }}
                    />
                    <Button
                      onClick={() => handleSingleDelete()}
                      bgColor={"#FC8181 !important"}
                      size={"sm"}
                      _hover={{
                        bgColor: "#E53E3E !important",
                      }}
                    >
                      <MdDelete size={25} />
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
                        <Image
                          src={photosObj.url}
                          alt={photosObj.file.name}
                          width={200}
                          height={100}
                          style={{ objectFit: "cover", borderRadius: "4px" }}
                        />
                        <Button
                          onClick={() => handleDelete(index)}
                          bgColor={"#FC8181 !important"}
                          size={"sm"}
                          _hover={{
                            bgColor: "#E53E3E !important",
                          }}
                        >
                          <MdDelete size={25} />
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
              onClick={async () => {
                console.log(input, bannerImageUrl);

                const eventData = await apiClient("/events", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...input,
                    displayPhoto: bannerImageUrl,
                    photos: photosUrl,
                    meetingLink: input.link,
                    userId: 3,
                    groupId,
                  }),
                });
                console.log(eventData);
                handleCloseModal();
                // navigate to group page
                router.push(`/groups/${groupId}/${eventData.id}`);
              }}
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
