"use client";

import { FileWithPreview } from "@/types/groups";
import {
  Button as ChakraButton,
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
  FormHelperText,
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
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { SWRProvider } from "@/providers/swrProvider";
import { useToast } from "../ui/use-toast";
import useSWRMutation from "swr/mutation";
import { CreateEventResponseType } from "@/app/api/groups/[groupId]/events/route";

const createEventFormSchema = z.object({
  displayPhoto: z.string().min(1, {
    message: "Display photo is required",
  }),
  name: z
    .string()
    .min(1, {
      message: "Event name is required",
    })
    .max(100, {
      message: "Name must be at most 100 characters.",
    }),
  description: z.string().min(1, {
    message: "A description of the event is required",
  }),
  online: z.boolean(),
  meetingLink: z
    .string()
    .url({
      message: "Meeting link must be a valid URL",
    })
    .optional(),
  location: z.string(),
  startDateTime: z.string().min(1, {
    message: "Start time is required",
  }),
  endDateTime: z.string().min(1, {
    message: "End time is required",
  }),
  photos: z.array(z.string()),
  resourceUrl: z
    .string()
    .url({
      message: "Resource link must be a valid URL",
    })
    .optional(),
});

export type CreateEventFormValues = z.infer<typeof createEventFormSchema>;

interface CreateEventType {
  name: string;
  description: string;
  displayPhoto: string;
  location: string;
  online: boolean;
  meetingLink: string;
  startDateTime: string;
  endDateTime: string;
  photos: string[];
  resourceUrl: string;
}

const defaultFormValues: CreateEventType = {
  name: "",
  description: "",
  displayPhoto: "",
  location: "",
  online: false,
  meetingLink: "",
  startDateTime: "",
  endDateTime: "",
  photos: [],
  resourceUrl: "",
};

async function createEvent(
  url: string,
  { arg }: { arg: CreateEventFormValues }
): Promise<CreateEventResponseType> {
  const response = await apiClient(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
  return response;
}

function _CreateEventModal({
  groupName,
  groupId,
}: {
  groupName: string;
  groupId: number;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { trigger, isMutating } = useSWRMutation(
    `/groups/${groupId}/events`,
    createEvent,
    {
      onSuccess: (data) => {
        toast({
          title: `New Event Created!`,
          description: `${data.name} event has been successfully created!`,
        });
        router.push(`/groups/${groupId}/events/${data.id}`);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      },
    }
  );

  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [imagesAreUploading, setImagesAreUploading] = useState(false);
  const fileTypes = ["JPG", "JPEG", "PNG"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [validationErrors, setValidationErrors] = useState<any>([]);

  const [input, setInput] = useState<CreateEventType>(defaultFormValues);
  const {
    displayPhoto,
    name,
    description,
    online,
    meetingLink,
    location,
    startDateTime,
    endDateTime,
    photos,
    resourceUrl,
  } = input;

  useEffect(() => {
    setValidationErrors([]);
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
  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME as string;

  // single image change
  const handleSingleChange = async (file: File) => {
    if (file) {
      setImageIsUploading(true);
      // generate random filepath using a hash
      const filePath = `event-banners/${Math.floor(Math.random() * 100000000)}-${uuidv4()}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) {
        console.log("Error uploading file: ", error.message);
        setValidationErrors((prev: any) => ({
          ...prev,
          ["displayPhoto"]: "An error occurred while uploading the file.",
        }));
      } else {
        handleInputChange(
          "displayPhoto",
          `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${bucketName}/${data.path}`
        );
      }
      setImageIsUploading(false);
    }
  };

  const handleSingleDelete = async () => {
    setImageIsUploading(true);
    if (input.displayPhoto) {
      // URL.revokeObjectURL(input.displayPhoto);
      // need to get the name from `event-banners/` onwards
      const fileName = input.displayPhoto.split("/event-banners/")[1];
      const key = `event-banners/${fileName}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .remove([key]);

      if (error) {
        console.log("Error deleting file: ", error.message);
        setValidationErrors((prev: any) => ({
          ...prev,
          ["displayPhoto"]: "An error occurred while deleting the file.",
        }));
      } else {
        handleInputChange("displayPhoto", "");
      }
    }
    setImageIsUploading(false);
  };

  // Multiple images
  const handleMultipleImageChange = async (newFiles: FileList | File[]) => {
    setImagesAreUploading(true);
    const newFilesWithUrls: FileWithPreview[] = Array.from(newFiles).map(
      (file) => ({
        file,
        url: URL.createObjectURL(file),
      })
    );
    const uploadedFilesToDisplay: string[] = [];
    // generate random filepath using a hash

    const resolveNewFiles = await Promise.all(
      newFilesWithUrls.map(async (file) => {
        const filePath = `event-photos/${Math.floor(Math.random() * 100000000)}-${uuidv4()}`;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file.file);

        if (error) {
          console.log("Error uploading file: ", error.message);
          setValidationErrors((prev: any) => ({
            ...prev,
            ["photos"]: "An error occurred while uploading the files.",
          }));
        } else {
          uploadedFilesToDisplay.push(
            `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${bucketName}/${data.path}`
          );
        }
      })
    );
    handleInputChange("photos", [...photos, ...uploadedFilesToDisplay]);

    setImagesAreUploading(false);
  };

  const handleMultipleDelete = async (indexToDelete: number) => {
    setImagesAreUploading(true);
    // URL.revokeObjectURL(photos[indexToDelete]);
    const photoToDelete = photos[indexToDelete];
    const fileName = photoToDelete.split("/event-photos/")[1];
    const key = `event-photos/${fileName}`;
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([key]);

    if (error) {
      console.log("Error deleting file: ", error.message);
      setValidationErrors((prev: any) => ({
        ...prev,
        ["photos"]: "An error occurred while deleting the file.",
      }));
    } else {
      handleInputChange(
        "photos",
        photos.filter((_, index) => index !== indexToDelete)
      );
    }
    setImagesAreUploading(false);
  };

  const getFormattedDateTime = (date: Date) => {
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const formattedDay = date.getDate().toString().padStart(2, "0");
    const formattedHours = date.getHours().toString().padStart(2, "0");
    const formattedMinutes = date.getMinutes().toString().padStart(2, "0");

    return `${date.getFullYear()}-${formattedMonth}-${formattedDay}T${formattedHours}:${formattedMinutes}`;
  };

  const minDateTime = new Date();

  const handleSubmit = async () => {
    try {
      createEventFormSchema.parse(input);
      trigger({
        ...input,
        startDateTime: new Date(input.startDateTime).toISOString(),
        endDateTime: new Date(input.endDateTime).toISOString(),
      });
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
      <Button onClick={onOpen} className="w-full">
        <IconText icon={RiAdminFill}>Create Event</IconText>
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="900px">
          <ModalHeader fontSize="lg">
            Create new event for {groupName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} gap={6} display={"flex"} flexDirection={"column"}>
            <FormControl isInvalid={validationErrors["displayImage"]}>
              <div className="flex flex-col gap-2">
                <FormLabel fontSize="sm" textColor="gray.600">
                  Banner Image
                </FormLabel>
                {imageIsUploading ? (
                  <div className="w-full flex justify-center items-center h-[100px]">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center w-full items-center gap-6">
                    {displayPhoto ? (
                      <div className="flex flex-col gap-4 justify-center items-center">
                        <Image
                          src={displayPhoto}
                          alt={displayPhoto}
                          width={350}
                          height={350}
                          style={{
                            width: "auto",
                            maxHeight: "350px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <ChakraButton
                          onClick={() => handleSingleDelete()}
                          bgColor={"red.400 !important"}
                          size={"sm"}
                          _hover={{
                            bgColor: "red.500 !important",
                          }}
                        >
                          <MdDelete size={20} />
                        </ChakraButton>
                      </div>
                    ) : (
                      <FileUploader
                        multiple={false}
                        handleChange={handleSingleChange}
                        name="file"
                        types={["JPG", "JPEG", "PNG"]}
                      />
                    )}
                  </div>
                )}

                {validationErrors["displayPhoto"] && (
                  <p className="text-red-500 text-[14px]">
                    {validationErrors["displayPhoto"]}
                  </p>
                )}
              </div>
            </FormControl>

            <FormControl isInvalid={validationErrors["name"]}>
              <FormLabel fontSize="sm" textColor="gray.600">
                Event Name
              </FormLabel>
              <Input
                fontSize={"sm"}
                paddingX={3}
                paddingY={1}
                type="name"
                placeholder="Enter event name"
                value={name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {validationErrors["name"] && (
                <FormErrorMessage>{validationErrors["name"]}</FormErrorMessage>
              )}
            </FormControl>

            <div className="flex flex-row gap-8">
              <FormControl isInvalid={validationErrors["startDateTime"]}>
                <FormLabel fontSize="sm" textColor="gray.600">
                  Start Date and Time
                </FormLabel>
                <Input
                  fontSize={"sm"}
                  paddingX={3}
                  paddingY={1}
                  type="datetime-local"
                  placeholder="Start time"
                  value={startDateTime ? startDateTime : ""}
                  min={getFormattedDateTime(minDateTime)}
                  max={endDateTime ? endDateTime : ""}
                  onChange={(e) => {
                    console.log(e.target.value);
                    handleInputChange("startDateTime", e.target.value);
                  }}
                />
                {validationErrors["startDateTime"] && (
                  <FormErrorMessage>
                    {validationErrors["startDateTime"]}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={validationErrors["endDateTime"]}>
                <FormLabel fontSize="sm" textColor="gray.600">
                  End Date and Time
                </FormLabel>
                <Input
                  fontSize={"sm"}
                  paddingX={3}
                  paddingY={1}
                  type="datetime-local"
                  placeholder="End time"
                  value={endDateTime ? endDateTime : ""}
                  min={
                    startDateTime
                      ? startDateTime
                      : getFormattedDateTime(minDateTime)
                  }
                  onChange={(e) => {
                    console.log(e.target.value);
                    handleInputChange("endDateTime", e.target.value);
                  }}
                />
                {validationErrors["endDateTime"] && (
                  <FormErrorMessage>
                    {validationErrors["endDateTime"]}
                  </FormErrorMessage>
                )}
              </FormControl>
            </div>

            <FormControl isInvalid={validationErrors["description"]}>
              <FormLabel fontSize="sm" textColor="gray.600">
                Event Description
              </FormLabel>
              <Textarea
                fontSize={"sm"}
                paddingX={3}
                paddingY={3}
                height={200}
                resize={"none"}
                placeholder="Provide a description of the event"
                value={description}
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
              <FormLabel fontSize="sm" textColor="gray.600">
                Images
              </FormLabel>
              {imagesAreUploading ? (
                <div className="w-[100%] flex justify-center items-center h-[100px]">
                  <Spinner />
                </div>
              ) : (
                <div className="flex flex-col justify-center w-[100%] items-center gap-6">
                  {photos.length > 0 && (
                    <SimpleGrid columns={3} spacing={10}>
                      {photos.map((photosObj, index) => (
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
                          <ChakraButton
                            onClick={() => handleMultipleDelete(index)}
                            bgColor={"red.400 !important"}
                            size={"sm"}
                            _hover={{
                              bgColor: "red.500 !important",
                            }}
                          >
                            <MdDelete size={20} />
                          </ChakraButton>
                        </div>
                      ))}
                    </SimpleGrid>
                  )}
                  <FileUploader
                    multiple={true}
                    handleChange={handleMultipleImageChange}
                    name="file"
                    types={fileTypes}
                  />
                </div>
              )}
            </div>

            <FormControl as="fieldset">
              <FormLabel fontSize="sm" textColor="gray.600">
                Is this an online event?
              </FormLabel>
              <RadioGroup
                defaultValue="No"
                value={online ? "Yes" : "No"}
                onChange={(value) =>
                  handleInputChange("online", value === "Yes")
                }
                textColor={"gray.600"}
              >
                <HStack spacing="24px">
                  <Radio size="sm" value="Yes">
                    Yes
                  </Radio>
                  <Radio size="sm" value="No">
                    No
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            {/* location */}
            {/* meeting link */}
            {online ? (
              <FormControl isInvalid={validationErrors["meetingLink"]}>
                <FormLabel fontSize="sm" textColor="gray.600">
                  Meeting Link
                </FormLabel>
                <Input
                  fontSize={"sm"}
                  paddingX={3}
                  paddingY={1}
                  type="link"
                  placeholder="https://meet.google.com/my-event"
                  value={meetingLink}
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
            ) : (
              <FormControl isInvalid={validationErrors["location"]}>
                <FormLabel fontSize="sm" textColor="gray.600">
                  Location
                </FormLabel>
                <Input
                  fontSize={"sm"}
                  paddingX={3}
                  paddingY={1}
                  type="link"
                  placeholder="9999 Main St, City, State, Zip"
                  value={location}
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
            )}
            <FormControl isInvalid={validationErrors["resourceUrl"]}>
              <FormLabel fontSize="sm" textColor="gray.600">
                Resources Link
              </FormLabel>
              <Input
                fontSize={"sm"}
                paddingX={3}
                paddingY={1}
                type="link"
                placeholder="https://drive.google.com/my-event-resources"
                value={resourceUrl}
                onChange={(e) => {
                  const newValue =
                    e.target.value === "" ? undefined : e.target.value;
                  handleInputChange("resourceUrl", newValue);
                }}
              />
              {validationErrors["resourceUrl"] && (
                <FormErrorMessage>
                  {validationErrors["resourceUrl"]}
                </FormErrorMessage>
              )}
              <FormHelperText className="text-[13px]">
                Provide a link to resources for this event. Leave blank if none.
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating}>
              {isMutating ? "Creating" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function CreateEventModal({
  groupName,
  groupId,
}: {
  groupName: string;
  groupId: number;
}) {
  return (
    <SWRProvider>
      <_CreateEventModal groupId={groupId} groupName={groupName} />
    </SWRProvider>
  );
}
