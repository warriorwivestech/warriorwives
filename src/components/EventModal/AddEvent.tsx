"use client";

import { EventDetailsProps } from "@/types/events";
import { FileWithPreview } from "@/types/groups";
import {
  Button,
  FormControl,
  FormErrorMessage,
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
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { MdDelete } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import IconText from "../common/icontext";
import { supabase } from "@/supabase";
import { apiClient } from "@/apiClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";

const GroupSchema = z.object({
  displayPhoto: z.string().min(1, {
    message: "Display photo cannot be empty",
  }),
  name: z.string().min(1, {
    message: "Group name cannot be empty",
  }),
  description: z.string().min(1, {
    message: "Description cannot be empty",
  }),
  online: z.boolean(),
  meetingLink: z.string(),
  location: z.string(),
  startDateTime: z.string().min(1, {
    message: "Start time cannot be empty",
  }),
  endDateTime: z.string().min(1, {
    message: "End time cannot be empty",
  }),
  photos: z.array(z.string()).min(1, {
    message: "Photos cannot be empty",
  }),
});

export function AddEvent({
  groupName,
  groupId,
}: {
  groupName: string;
  groupId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const fileTypes = ["JPG", "JPEG", "PNG"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [validationErrors, setValidationErrors] = useState<any>([]);
  const [input, setInput] = useState<EventDetailsProps>({
    name: "",
    description: "",
    location: "",
    online: false,
    meetingLink: "",
    startDateTime: null,
    endDateTime: null,
    displayPhoto: "",
    photos: [],
  });

  useEffect(() => {
    setValidationErrors([]);
    setInput({
      name: "",
      description: "",
      location: "",
      online: false,
      meetingLink: "",
      startDateTime: null,
      endDateTime: null,
      displayPhoto: "",
      photos: [],
    });
  }, [isOpen]);

  const handleInputChange = (inputType: string, value: any) => {
    setInput((prev: any) => ({
      ...prev,
      [inputType]: value,
    }));

    setValidationErrors((prev: any) => ({
      ...prev,
      [inputType]: null,
    }));
  };

  // Single image
  const handleSingleChange = async (file: File) => {
    setLoading(true);
    if (file) {
      // generate random filepath using a hash
      const filePath = `event-banners/${Math.random()}-${file.name}`;

      const { data, error }: { data: any; error: any } = await supabase.storage
        .from("warrior-wives-test")
        .upload(filePath, file);
      if (error) {
        setValidationErrors((prev: any) => ({
          ...prev,
          ["displayPhoto"]:
            "Make sure your file name does not contain any special characters",
        }));
        setLoading(false);
      } else {
        handleInputChange(
          "displayPhoto",
          `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${data?.fullPath}`
        );

        setLoading(false);
      }
    }
  };

  const handleSingleDelete = () => {
    if (input?.displayPhoto) URL.revokeObjectURL(input?.displayPhoto);
    handleInputChange("displayPhoto", null);
  };

  // Multiple images
  const handleChange = (newFiles: FileList | File[]) => {
    setLoadingPhotos(true);
    const newFilesWithUrls: FileWithPreview[] = Array.from(newFiles).map(
      (file) => ({
        file,
        url: URL.createObjectURL(file),
      })
    );
    // generate random filepath using a hash
    newFilesWithUrls.forEach(async (file) => {
      const filePath = `event-photos/${Math.random()}-${file.file.name}`;

      const { data, error }: { data: any; error: any } = await supabase.storage
        .from("warrior-wives-test")
        .upload(filePath, file.file);
      if (error) {
        setValidationErrors((prev: any) => ({
          ...prev,
          ["photos"]:
            "Make sure your file name does not contain any special characters",
        }));
        setLoadingPhotos(false);
      } else {
        setLoadingPhotos(false);
        handleInputChange("photos", [
          ...input?.photos,
          `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${data?.fullPath}`,
        ]);
      }
    });
  };

  const handleDelete = (indexToDelete: number) => {
    URL.revokeObjectURL(input?.photos[indexToDelete]);
    handleInputChange(
      "photos",
      input?.photos.filter((_, index) => index !== indexToDelete)
    );
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

  const minDateTime = getFormattedCurrentDateTime();

  const handleSubmit = async () => {
    try {
      GroupSchema.parse(input);
      const eventData = await apiClient("/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...input,
          userId: 3,
          groupId,
        }),
      });
      onClose();
      // navigate to group page
      router.push(`/groups/${groupId}/${eventData.id}`);
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};

        error.errors.forEach((err) => {
          errorMap[err.path[0]] = err.message;
        });

        setValidationErrors(errorMap);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        className="bg-black text-white hover:text-black mt-4"
      >
        <IconText icon={RiAdminFill}>{"Create new event"}</IconText>
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="900px">
          <ModalHeader>{`Create new event for ${groupName}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} gap={6} display={"flex"} flexDirection={"column"}>
            {/* banner image */}
            <FormControl isInvalid={validationErrors["displayImage"]}>
              <div className="flex flex-col gap-2">
                <FormLabel>Banner Image</FormLabel>
                {loading ? (
                  <div className="w-[100%] flex justify-center items-center h-[100px]">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center w-[100%] items-center gap-6">
                    {input?.displayPhoto && (
                      <div className="flex flex-col gap-4 justify-center items-center">
                        <Image
                          src={input?.displayPhoto as string}
                          alt={input?.displayPhoto as string}
                          width={200}
                          height={350}
                          style={{
                            maxHeight: "350px",
                            objectFit: "cover",
                            borderRadius: "4px",
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
                      types={["JPG", "JPEG", "PNG"]}
                    />
                  </div>
                )}

                {validationErrors["displayPhoto"] && (
                  <p className="text-red-500 text-[14px]">
                    {validationErrors["displayPhoto"]?.includes("null")
                      ? "Display image is required"
                      : validationErrors["displayPhoto"]}
                  </p>
                )}
              </div>
            </FormControl>
            <Divider />

            <div className="flex flex-row gap-8">
              {/* name */}
              <FormControl isInvalid={validationErrors["name"]}>
                {/* <FormLabel>Name</FormLabel> */}
                <Input
                  placeholder="Name"
                  type="name"
                  value={input?.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {validationErrors["name"] && (
                  <FormErrorMessage>
                    {validationErrors["name"]}
                  </FormErrorMessage>
                )}
              </FormControl>
            </div>

            <div className="flex flex-row gap-8">
              {/* date time */}
              <FormControl isInvalid={validationErrors["startDateTime"]}>
                <FormLabel>Start time</FormLabel>
                <Input
                  placeholder="Start time"
                  type="datetime-local"
                  value={input?.startDateTime as any}
                  min={minDateTime}
                  onChange={(e) =>
                    handleInputChange("startDateTime", e.target.value)
                  }
                />
                {validationErrors["startDateTime"] && (
                  <FormErrorMessage>
                    Start time cannot be empty
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={validationErrors["endDateTime"]}>
                <FormLabel>End time</FormLabel>
                <Input
                  placeholder="End time"
                  type="datetime-local"
                  value={input?.endDateTime as any}
                  min={minDateTime}
                  onChange={(e) =>
                    handleInputChange("endDateTime", e.target.value)
                  }
                />
                {validationErrors["endDateTime"] && (
                  <FormErrorMessage>End time cannot be empty</FormErrorMessage>
                )}
              </FormControl>
            </div>

            {/* description */}
            <FormControl isInvalid={validationErrors["description"]}>
              <Textarea
                height={200}
                resize={"none"}
                placeholder="Description for the event"
                value={input?.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
              {validationErrors["description"] && (
                <FormErrorMessage>
                  {validationErrors["description"]}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* image */}
            <div className="flex flex-col gap-2">
              <FormLabel>Images</FormLabel>

              {loadingPhotos ? (
                <div className="w-[100%] flex justify-center items-center h-[100px]">
                  <Spinner />
                </div>
              ) : (
                <div className="flex flex-col justify-center w-[100%] items-center gap-6">
                  {input?.photos?.length > 0 && (
                    <SimpleGrid columns={3} spacing={10}>
                      {input?.photos?.map((photosObj, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-4 justify-center items-center"
                        >
                          {/* <p>File name: {fileObj.file.name}</p> */}
                          <Image
                            src={photosObj}
                            alt={photosObj}
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
              )}
            </div>

            {/* online */}
            <FormControl as="fieldset">
              <FormLabel as="legend">Is this an online event?</FormLabel>
              <RadioGroup
                defaultValue="No"
                value={input?.online ? "Yes" : "No"}
                onChange={(value) =>
                  handleInputChange("online", value === "Yes")
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
              <FormControl isInvalid={validationErrors["location"]}>
                <Input
                  placeholder="Location"
                  type="location"
                  value={input?.location as string}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
                {validationErrors["location"] && (
                  <FormErrorMessage>
                    {validationErrors["location"]}
                  </FormErrorMessage>
                )}
              </FormControl>
            ) : (
              <FormControl isInvalid={validationErrors["meetingLink"]}>
                <Input
                  placeholder="Meeting Link"
                  type="link"
                  value={input?.meetingLink as string}
                  onChange={(e) =>
                    handleInputChange("meetingLink", e.target.value)
                  }
                />
                {validationErrors["meetingLink"] && (
                  <FormErrorMessage>
                    {validationErrors["meetingLink"]}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={() => onClose()}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
