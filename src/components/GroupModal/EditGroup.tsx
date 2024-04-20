"use client";

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
  InputRightElement,
  InputGroup,
  Spinner,
  FormHelperText,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { ChakraStylesConfig, Select as MultiSelect } from "chakra-react-select";
import { MdDelete } from "react-icons/md";
import { supabase } from "@/supabase";
import Image from "next/image";
import { getBranchesOfService, getCounties, getStates } from "./helper/getData";
import { set, z } from "zod";
import { Button } from "../ui/button";
import { SWRProvider } from "@/providers/swrProvider";
import useSWR, { KeyedMutator } from "swr";
import { InterestsType } from "@/app/api/interests/route";
import { getInterestsRequestOptions } from "@/app/api/interests/helper";
import useSWRMutation from "swr/mutation";
import { apiClient } from "@/apiClient";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  GroupDataType,
  UpdateGroupResponseType,
} from "@/app/api/groups/[groupId]/route";
import { parseReverseBranchOfService } from "@/data/helpers";
import { v4 as uuidv4 } from "uuid";

const updateGroupFormSchema = z.object({
  displayPhoto: z.string().min(1, {
    message: "Display photo is required",
  }),
  name: z
    .string()
    .min(1, {
      message: "Group name is required",
    })
    .max(100, {
      message: "Name must be at most 100 characters.",
    }),
  description: z.string().min(1, {
    message: "A description of the group is required",
  }),
  online: z.boolean(),
  state: z.string().min(1, {
    message: "State is required.",
  }),
  county: z.string().optional(),
  branchOfService: z.string().min(1, {
    message: "Branch of service is required.",
  }),
  tags: z.array(z.number()).min(1, {
    message: "At least one tag is required.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .optional(),
});

export type EditGroupFormValues = z.infer<typeof updateGroupFormSchema>;

const dropDownChakraStyles: ChakraStylesConfig = {
  clearIndicator: (provided, state) => ({
    ...provided,
  }),
  container: (provided, state) => ({
    ...provided,
  }),
  control: (provided, state) => ({
    ...provided,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
  }),
  group: (provided, state) => ({
    ...provided,
  }),
  groupHeading: (provided, state) => ({
    ...provided,
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
  }),
  input: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  inputContainer: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  menu: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

interface EditGroupType {
  displayPhoto: string;
  name: string;
  description: string;
  online: boolean;
  state: string;
  county: string;
  branchOfService: string;
  tags: number[];
  password: string | undefined;
}

async function updateGroup(
  url: string,
  { arg }: { arg: EditGroupFormValues }
): Promise<UpdateGroupResponseType> {
  const response = await apiClient(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });
  return response;
}

function _EditGroupModal({
  group,
  revalidateData,
}: {
  group: GroupDataType;
  revalidateData: KeyedMutator<GroupDataType>;
}) {
  const { toast } = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: interestsData,
    error: interestsError,
    isLoading: interestsAreLoading,
  } = useSWR<InterestsType>(["/interests", getInterestsRequestOptions()]);
  const { trigger, isMutating } = useSWRMutation(
    `/groups/${group.id}`,
    updateGroup,
    {
      onSuccess: (data) => {
        toast({
          title: `Group Updated!`,
          description: `${data.name} group has been successfully updated!`,
        });
        revalidateData();
        onClose();
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
  const originalDisplayPhoto = group.displayPhoto;
  const [isShowingOriginalDisplayPhoto, setIsShowingOriginalDisplayPhoto] =
    useState(true);

  // parse interests data into { label: name, value: id}
  const availableTags = interestsData
    ? interestsData.map((interest) => ({
        label: interest.name,
        value: interest.id,
      }))
    : [];

  const [imageIsUploading, setImageIsUploading] = useState(false);

  const branchesOfService = getBranchesOfService();

  const defaultFormValues = {
    displayPhoto: group.displayPhoto,
    name: group.name,
    description: group.description,
    online: group.online,
    state: group.state,
    county: group.county || "",
    branchOfService: parseReverseBranchOfService(group.branchOfService),
    tags: group.tagIds,
    password: group.password ? group.password : undefined,
  };
  const [input, setInput] = useState<EditGroupType>(defaultFormValues);
  const [validationErrors, setValidationErrors] = useState<any>([]);
  const { displayPhoto, name, description, online, state, tags, password } =
    input;

  const states = getStates();
  const [countyIsDisabled, setCountyIsDisabled] = useState(true);
  const [availableCounties, setAvailableCounties] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (!state || state === "National") {
      setCountyIsDisabled(true);
      handleInputChange("county", "");
      setAvailableCounties([]);
    } else {
      setCountyIsDisabled(false);
      handleInputChange("county", "");
      setAvailableCounties(getCounties(state));
    }
  }, [state]);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setValidationErrors([]);
  }, [isOpen]);

  const handleSingleChange = async (file: File) => {
    if (file) {
      setImageIsUploading(true);
      // generate random filepath using a hash
      const filePath = `group-banners/${Math.floor(Math.random() * 100000000)}-${uuidv4()}`;
      const { data, error } = await supabase.storage
        .from("warrior-wives-test")
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
          `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/warrior-wives-test/${data.path}`
        );
      }
      setImageIsUploading(false);
    }
  };

  const handleSingleDelete = async () => {
    setImageIsUploading(true);
    if (input.displayPhoto) {
      if (isShowingOriginalDisplayPhoto) {
        handleInputChange("displayPhoto", "");
        setIsShowingOriginalDisplayPhoto(false);
      } else {
        // URL.revokeObjectURL(input.displayPhoto);
        // need to get the name from `group-banners/` onwards
        const fileName = input.displayPhoto.split("/group-banners/")[1];
        const key = `group-banners/${fileName}`;
        const { data, error } = await supabase.storage
          .from("warrior-wives-test")
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
    }
    setImageIsUploading(false);
  };

  const handleInputChange = (inputType: string, value: any) => {
    setInput((prev: EditGroupType) => ({
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
      updateGroupFormSchema.parse(input);
      trigger(input);
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
        variant="outline"
        onClick={onOpen}
        disabled={interestsAreLoading || interestsError}
      >
        Edit Group
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="700px">
          <ModalHeader fontSize="lg">Edit Group</ModalHeader>
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
                      <>
                        <FileUploader
                          multiple={false}
                          handleChange={handleSingleChange}
                          name="file"
                          types={["JPG", "JPEG", "PNG"]}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleInputChange(
                              "displayPhoto",
                              originalDisplayPhoto
                            );
                            setIsShowingOriginalDisplayPhoto(true);
                          }}
                        >
                          Re-use current photo
                        </Button>
                      </>
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
                Group Name
              </FormLabel>
              <Input
                fontSize={"sm"}
                paddingX={3}
                paddingY={1}
                type="name"
                placeholder="Enter group name"
                value={name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {validationErrors["name"] && (
                <FormErrorMessage>{validationErrors["name"]}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={validationErrors["description"]}>
              <FormLabel fontSize="sm" textColor="gray.600">
                Group Description
              </FormLabel>
              <Textarea
                fontSize={"sm"}
                paddingX={3}
                paddingY={3}
                height={200}
                resize={"none"}
                placeholder="Provide a description of the group"
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

            <FormControl as="fieldset">
              <FormLabel fontSize="sm" textColor="gray.600">
                Is this an online group?
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

            <div className="flex flex-row gap-6">
              <div className="w-full">
                <FormLabel fontSize="sm" textColor="gray.600">
                  State
                </FormLabel>
                <FormControl isInvalid={validationErrors["state"]}>
                  <MultiSelect
                    chakraStyles={dropDownChakraStyles}
                    options={states}
                    value={states.find((state) => state.value === input.state)}
                    placeholder="Select a state or national region"
                    onChange={(value) =>
                      // @ts-ignore
                      handleInputChange("state", value?.value)
                    }
                    variant="outline"
                    isClearable
                    useBasicStyles
                  />
                  {validationErrors["state"] && (
                    <FormErrorMessage>
                      State or region is required
                    </FormErrorMessage>
                  )}
                </FormControl>
              </div>

              <div className="w-full">
                <FormLabel fontSize="sm" textColor="gray.600">
                  County
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    chakraStyles={dropDownChakraStyles}
                    isDisabled={countyIsDisabled}
                    options={availableCounties}
                    value={
                      availableCounties.find(
                        (county) => county.value === input.county
                      ) || ""
                    }
                    placeholder="Select county"
                    onChange={(value) =>
                      // @ts-ignore
                      handleInputChange("county", value?.value)
                    }
                    variant="outline"
                    isClearable
                    useBasicStyles
                  />
                </FormControl>
              </div>
            </div>

            <div className="flex flex-row gap-6">
              <div className="w-full">
                <FormLabel fontSize="sm" textColor="gray.600">
                  Branch of Service
                </FormLabel>
                <FormControl isInvalid={validationErrors["branchOfService"]}>
                  <MultiSelect
                    name="branchOfService"
                    chakraStyles={dropDownChakraStyles}
                    options={branchesOfService}
                    value={branchesOfService.find(
                      (branch) => branch.value === input.branchOfService
                    )}
                    placeholder="Select branch of service"
                    variant="outline"
                    useBasicStyles
                    isClearable
                    onChange={(value) =>
                      // @ts-ignore
                      handleInputChange("branchOfService", value?.value)
                    }
                  />
                  {validationErrors["branchOfService"] && (
                    <FormErrorMessage>
                      Branch of service is required
                    </FormErrorMessage>
                  )}
                </FormControl>
              </div>
              <div className="w-full">
                <FormLabel fontSize="sm" textColor="gray.600">
                  Tags
                </FormLabel>
                <FormControl isInvalid={validationErrors["tags"]}>
                  <MultiSelect
                    isMulti
                    chakraStyles={dropDownChakraStyles}
                    options={availableTags}
                    value={
                      availableTags.filter((availableTag) =>
                        tags.includes(availableTag.value)
                      ) || []
                    }
                    name="interest"
                    placeholder="Select tags"
                    variant="outline"
                    useBasicStyles
                    onChange={(value) =>
                      handleInputChange(
                        "tags",
                        // @ts-ignore
                        value.map((tag) => tag.value)
                      )
                    }
                  />
                  {validationErrors["tags"] && (
                    <FormErrorMessage>
                      At least one tag is required
                    </FormErrorMessage>
                  )}
                </FormControl>
              </div>
            </div>

            <FormControl isInvalid={validationErrors["password"]}>
              <FormLabel fontSize="sm" textColor="gray.600">
                Lock group with a password? (Optional)
              </FormLabel>
              <InputGroup size="md">
                <Input
                  fontSize={"sm"}
                  paddingX={3}
                  paddingY={1}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const newValue =
                      e.target.value === "" ? undefined : e.target.value;
                    handleInputChange("password", newValue);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <ChakraButton
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </ChakraButton>
                </InputRightElement>
              </InputGroup>
              <FormHelperText fontSize={"0.8rem"} lineHeight={"5"}>
                Adding a password will require users to enter the password to
                join the group. Leave blank if you do not want to add a
                password.
              </FormHelperText>
              {validationErrors["password"] && (
                <FormErrorMessage>
                  {validationErrors["password"]}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" className="mr-2" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={interestsAreLoading || isMutating}
            >
              {isMutating ? "Updating" : "Update"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function EditGroupModal({
  group,
  revalidateData,
}: {
  group: GroupDataType;
  revalidateData: KeyedMutator<GroupDataType>;
}) {
  return (
    <SWRProvider>
      <_EditGroupModal group={group} revalidateData={revalidateData} />
    </SWRProvider>
  );
}
