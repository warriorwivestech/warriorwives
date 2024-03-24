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
} from "@/app/types/groups";
import locationData from "../../json/location.json";
import { MdDelete } from "react-icons/md";
import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/apiClient";
import Image from "next/image";
import { GroupData } from "@/app/api/groups/[groupId]/types";

interface CreateGroupModalType {
  data?: GroupData;
}

export function CreateGroupModal(props: CreateGroupModalType) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bannerImage, setBannerImage] = useState<any | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [dirty, setDirty] = useState<requiredGroupField>({
    name: false,
    description: false,
    branchOfService: false,
    tags: false,
  });
  const router = useRouter();

  const [input, setInput] = useState<NewGroup>({
    name: "",
    description: "",
    online: false,
    county: "",
    state: "",
    displayPhoto: "",
    branchOfService: [],
    tags: [],
    password: "",
    archived: false,
  });

  useEffect(() => {
    setBannerImage(props?.data?.displayPhoto as any);

    setInput((prevInput: any) => ({
      ...prevInput,
      name: props?.data?.name || "",
      description: props?.data?.description || "",
      online: props?.data?.online || false,
      displayPhoto: props?.data?.displayPhoto || "",
      county: props?.data?.county || "",
      state: props?.data?.state || "",
      branchOfService: props?.data?.branchOfService || [],
      tags: props?.data?.tags || [],
      password: props?.data?.password || "",
      archived: props?.data?.archived || false,
    }));
  }, [props?.data, isOpen]);

  const handleCloseModal = () => {
    onClose();
    setBannerImage(null);
    setDirty({
      name: false,
      description: false,
      branchOfService: false,
      tags: false,
    });
    setInput({
      name: "",
      description: "",
      online: false,
      county: "",
      state: "",
      displayPhoto: "",
      branchOfService: [],
      tags: [],
      password: "",
      archived: false,
    });
  };

  const handleInputChange = ({ e, inputType, multi, single, toggle }: any) => {
    // If multi selector
    if (multi) {
      let value;
      value = e?.map((e: any) => {
        return e?.label;
      });

      setInput((prev) => ({
        ...prev,
        [inputType]: value,
      }));

      return;
    }

    if (toggle) {
      let value;
      value = e?.target?.checked;

      setInput((prev) => ({
        ...prev,
        [inputType]: value,
      }));

      return;
    }

    if (single) {
      let value;
      value = e?.label;

      setInput((prev) => ({
        ...prev,
        [inputType]: value,
      }));

      return;
    }

    const value = typeof e === "string" ? e : e?.target?.value;

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
  const isTagsError = dirty?.tags && input?.tags?.length === 0;
  const isBranchOfServiceError =
    dirty?.branchOfService && input?.branchOfService?.length === 0;

  const fileTypes = ["JPG", "JPEG", "PNG"];

  // Single image
  const handleSingleChange = async (file: File) => {
    if (file) {
      if (bannerImage?.url) URL.revokeObjectURL(bannerImage.url);

      const newFileWithUrl = {
        file: file,
        url: URL.createObjectURL(file),
      };

      // generate random filepath using a hash
      const filePath = `group-banners/${Math.random()}-${file.name}`;

      const { data, error }: { data: any; error: any } = await supabase.storage
        .from("warrior-wives-test")
        .upload(filePath, file);

      if (error) {
        console.log("Error uploading file: ", error.message);
      } else {
        console.log("File uploaded successfully: ", data);
        setBannerImageUrl(
          `${process.env.NEXT_PUBLIC_SUPABASE_BLOB_URL}/${data?.fullPath}`
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
    if (bannerImage) URL.revokeObjectURL(bannerImage.url as any);
    setBannerImage(null);
  };
  const sample = [
    { value: "ALL", label: "All Branch" },
    { value: "ARMY", label: "Army" },
    { value: "NAVY", label: "Navy" },
    { value: "AIR_FORCE", label: "Air Force" },
    { value: "COAST_GUARD", label: "Coast Guard" },
    { value: "MARINE_CORPS", label: "Marine Corps" },
    { value: "SPACE_FORCE", label: "Space Force" },
  ];

  const [selectedState, setSelectedState] = useState<string>("");
  const [filteredCounties, setFilteredCounties] = useState<LocationType[]>([]);

  // Extract unique states for the state dropdown
  let states: any = Array.from(
    new Set(locationData.map((location) => location.State))
  );

  states = states.map((state: any) => {
    return { value: state, label: state };
  });

  // Me and my homies hate alaska && hawaii
  states = states?.filter((state: any) => {
    return state?.value !== "Alaska" && state?.value !== "Hawai?i";
  });

  // Handle changing of the state dropdown
  const handleStateChange = (e: any) => {
    const state = e?.label;
    setSelectedState(state);

    handleInputChange({
      e: e,
      inputType: "state",
      single: true,
    });

    // Filter counties based on selected state
    let counties: any = locationData.filter(
      (location) => location.State === state
    );

    counties = counties.map((county: any) => {
      return {
        label: county?.County.slice(0, -7),
        value: county?.County.slice(0, -7),
      };
    });

    setFilteredCounties(counties);
  };

  const isButtonDisabled = () => {
    const conditions = [
      isDescriptionError,
      isNameError,
      isTagsError,
      isBranchOfServiceError,
      input?.branchOfService?.length === 0,
      input?.tags?.length === 0,
      input?.description === "",
      input?.name === "",
    ];

    return conditions.some((condition) => condition);
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <>
      <Button onClick={onOpen}>
        {props?.data ? `Edit group` : "Create new group"}
      </Button>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <ModalOverlay />
        <ModalContent minW="900px">
          <ModalHeader>
            {props?.data ? `Edit ${props?.data?.name}` : "Create new group"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} gap={6} display={"flex"} flexDirection={"column"}>
            <div>
              <FormControl>
                <FormLabel htmlFor="isChecked">Archieve group</FormLabel>
                <Switch
                  name="archived"
                  checked={input?.archived}
                  onChange={(e) =>
                    handleInputChange({
                      e: e,
                      toggle: true,
                      inputType: "archived",
                    })
                  }
                />
              </FormControl>
            </div>

            {/* banner image */}
            <div className="flex flex-col gap-2">
              <FormLabel>Banner Image</FormLabel>
              <div className="flex flex-col justify-center w-[100%] items-center gap-6">
                {bannerImage && (
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <Image
                      src={(bannerImage as string) || (bannerImage?.url as any)}
                      alt={
                        (bannerImage as string) ||
                        (bannerImage?.file.name as any)
                      }
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
                  types={fileTypes}
                />
              </div>
            </div>
            <Divider />

            {/* name */}
            <FormControl isInvalid={isNameError}>
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                placeholder="Group name"
                type="name"
                value={input?.name}
                onChange={(e) => handleInputChange({ e: e, inputType: "name" })}
              />
              {isNameError && (
                <FormErrorMessage>Name is required.</FormErrorMessage>
              )}
            </FormControl>

            {/* description */}
            <FormControl isInvalid={isDescriptionError}>
              {/* <FormLabel>Description</FormLabel> */}

              <Textarea
                height={200}
                resize={"none"}
                placeholder="Description for the group"
                value={input?.description}
                onChange={(e) =>
                  handleInputChange({ e: e, inputType: "description" })
                }
              />
              {isDescriptionError && (
                <FormErrorMessage>Description is required.</FormErrorMessage>
              )}
            </FormControl>

            {/* online */}
            <FormControl as="fieldset">
              <FormLabel as="legend">Is this an online group?</FormLabel>
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

            <div className="flex flex-row gap-6">
              <FormControl>
                <MultiSelect
                  options={states}
                  value={states.find(
                    (option: { value: string }) => option.value === input?.state
                  )}
                  placeholder="Select state"
                  onChange={(e: any) => handleStateChange(e)}
                  variant="outline"
                  isClearable
                  useBasicStyles
                />
              </FormControl>

              <FormControl>
                <MultiSelect
                  isDisabled={!selectedState}
                  options={filteredCounties}
                  value={filteredCounties.find(
                    (option) => option.County === input?.county
                  )}
                  placeholder="Select county"
                  onChange={(e) =>
                    handleInputChange({
                      e: e,
                      inputType: "county",
                      single: true,
                    })
                  }
                  variant="outline"
                  isClearable
                  useBasicStyles
                />
              </FormControl>
            </div>

            <div className="flex flex-row gap-6">
              <FormControl isInvalid={isTagsError}>
                <CreatableSelect
                  isMulti
                  value={input?.tags.map((tag) => ({ label: tag, value: tag }))}
                  name="interest"
                  placeholder="Select interest"
                  variant="outline"
                  useBasicStyles
                  onChange={(e) =>
                    handleInputChange({ e: e, inputType: "tags", multi: true })
                  }
                  onBlur={() =>
                    setDirty((prev) => ({
                      ...prev,
                      tags: true,
                    }))
                  }
                />
                {isTagsError && (
                  <FormErrorMessage>
                    Please select at least one interest.
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={isBranchOfServiceError}>
                <MultiSelect
                  name="branchOfService"
                  options={sample}
                  value={sample.find(
                    (option) => option.label === (input?.branchOfService as any)
                  )}
                  placeholder="Select branch of service"
                  variant="outline"
                  useBasicStyles
                  isClearable
                  onBlur={() =>
                    setDirty((prev) => ({
                      ...prev,
                      branchOfService: true,
                    }))
                  }
                  onChange={(e) =>
                    handleInputChange({
                      e: e,
                      inputType: "branchOfService",
                      single: true,
                    })
                  }
                />

                {isBranchOfServiceError && (
                  <FormErrorMessage>
                    Please select at least one branch of service.
                  </FormErrorMessage>
                )}
              </FormControl>
            </div>

            <div>
              {/* password */}
              <FormControl isInvalid={isNameError}>
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
                      handleInputChange({ e: e, inputType: "password" })
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
            <Button
              mr={3}
              isDisabled={isButtonDisabled()}
              onClick={async () => {
                const groupData = await apiClient("/groups", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...input,
                    displayPhoto: bannerImageUrl,
                    userId: 3,
                  }),
                });
                console.log(groupData);
                handleCloseModal();
                // navigate to group page
                router.push(`/groups/${groupData.id}`);
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
