"use client";

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
  Select,
  InputRightElement,
  InputGroup,
  Switch,
  Spinner,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import {
  AsyncSelect,
  CreatableSelect,
  Select as MultiSelect,
} from "chakra-react-select";
import {
  FileWithPreview,
  LocationType,
  NewGroup,
  requiredGroupField,
} from "@/types/groups";
import locationData from "../../json/location.json";
import { MdDelete } from "react-icons/md";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import { apiClient } from "@/apiClient";
import Image from "next/image";
import { GroupDataType } from "@/app/api/groups/[groupId]/route";
import { getBranchOfService, getCounty, getStates } from "./helper/getData";
import { z } from "zod";

interface CreateGroupModalType {
  data?: GroupDataType;
}

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
  state: z.object({
    value: z.string().min(1),
    label: z.string().min(1),
  }),
  county: z.string(),
  tags: z.array(z.string()).min(1),
  branchOfService: z.string().min(1),
  password: z.string().optional(),
});

export function AddGroup(props: CreateGroupModalType) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const branchOfService = getBranchOfService();
  const states = getStates();
  const [validationErrors, setValidationErrors] = useState<any>([]);
  const [input, setInput] = useState<NewGroup>();
  const [filteredCounties, setFilteredCounties] = useState<LocationType[]>([]);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  useEffect(() => {
    setValidationErrors([]);
    setLoading(false);

    setInput((prevInput: any) => ({
      ...prevInput,
      name: "",
      description: "",
      online: false,
      displayPhoto: "",
      county: "",
      state: "",
      branchOfService: [],
      tags: [],
      password: "",
    }));
  }, [isOpen]);

  useEffect(() => {
    const stateValue =
      typeof input?.state === "object" ? input?.state?.value : input?.state;
    if (stateValue) {
      const counties = getCounty(stateValue);
      setFilteredCounties(counties);
    }
  }, [input?.state]);

  const handleSingleChange = async (file: File) => {
    if (file) {
      setLoading(true);
      // generate random filepath using a hash
      const filePath = `group-banners/${Math.random()}-${file.name}`;

      const { data, error }: { data: any; error: any } = await supabase.storage
        .from("warrior-wives-test")
        .upload(filePath, file);

      if (error) {
        console.log("Error uploading file: ", error.message);
        setValidationErrors((prev: any) => ({
          ...prev,
          ["displayPhoto"]:
            "Make sure your file name does not contain any special characters",
        }));
        setLoading(false);
      } else {
        console.log("File uploaded successfully: ", data);
        handleInputChange(
          "displayPhoto",
          `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${data?.fullPath}`
        );

        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    }
  };

  const handleSingleDelete = () => {
    if (input?.displayPhoto) URL.revokeObjectURL(input?.displayPhoto as any);
    handleInputChange("displayPhoto", null);
  };

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

  const handleSubmit = async () => {
    try {
      GroupSchema.parse(input);

      const groupData = await apiClient("/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...input,
          userId: 3,
        }),
      });
      onClose();
      // navigate to group page
      router.push(`/groups/${groupData.id}`);

      onClose();
      // navigate to group page
      // router.push(`/groups/${groupData.id}`);
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
      <Button onClick={onOpen}>Create new group</Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="900px">
          <ModalHeader>{`Edit ${props?.data?.name}`}</ModalHeader>
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

            {/* name */}
            <FormControl isInvalid={validationErrors["name"]}>
              <Input
                placeholder="Group name"
                type="name"
                value={input?.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {validationErrors["name"] && (
                <FormErrorMessage>{validationErrors["name"]}</FormErrorMessage>
              )}
            </FormControl>

            {/* description */}
            <FormControl isInvalid={validationErrors["description"]}>
              <Textarea
                height={200}
                resize={"none"}
                placeholder="Description for the group"
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

            {/* online */}
            <FormControl as="fieldset">
              <FormLabel as="legend">Is this an online group?</FormLabel>
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

            <div className="flex flex-row gap-6">
              <FormControl isInvalid={validationErrors["state"]}>
                <MultiSelect
                  options={states}
                  value={states.find(
                    (option: { value: any }) =>
                      option.value ===
                      (typeof input?.state === "object"
                        ? (input?.state?.value as any)
                        : input?.state)
                  )}
                  placeholder="Select state"
                  onChange={(value) => handleInputChange("state", value)}
                  variant="outline"
                  isClearable
                  useBasicStyles
                />
                {validationErrors["state"] && (
                  <FormErrorMessage>{"Select state"}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <MultiSelect
                  isDisabled={filteredCounties?.length <= 0}
                  options={filteredCounties}
                  value={filteredCounties.find(
                    (option) => option.County === input?.county
                  )}
                  placeholder="Select county"
                  onChange={(value) => handleInputChange("county", value)}
                  variant="outline"
                  isClearable
                  useBasicStyles
                />
              </FormControl>
            </div>

            <div className="flex flex-row gap-6">
              <FormControl isInvalid={validationErrors["tags"]}>
                <CreatableSelect
                  isMulti
                  value={input?.tags.map((tag) => ({ label: tag, value: tag }))}
                  name="interest"
                  placeholder="Select interest"
                  variant="outline"
                  useBasicStyles
                  onChange={(value) =>
                    handleInputChange(
                      "tags",
                      value.map((tag) => tag.value)
                    )
                  }
                />
                {validationErrors["tags"] && (
                  <FormErrorMessage>
                    {"Select at least one interest"}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={validationErrors["branchOfService"]}>
                <MultiSelect
                  name="branchOfService"
                  options={branchOfService}
                  value={branchOfService.find(
                    (option) => option.label === (input?.branchOfService as any)
                  )}
                  placeholder="Select branch of service"
                  variant="outline"
                  useBasicStyles
                  isClearable
                  onChange={(value) =>
                    handleInputChange("branchOfService", value?.label)
                  }
                />
                {validationErrors["branchOfService"] && (
                  <FormErrorMessage>
                    {"Select branch of service"}
                  </FormErrorMessage>
                )}
              </FormControl>
            </div>

            <div>
              {/* password */}
              <FormControl>
                <FormLabel as="legend">
                  Do you want to lock the group with a password? (Optional)
                </FormLabel>
                <InputGroup size="md">
                  {/* <FormLabel>Name</FormLabel> */}
                  <Input
                    placeholder="Password"
                    type={show ? "text" : "password"}
                    value={input?.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </div>
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
