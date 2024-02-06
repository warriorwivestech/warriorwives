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
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
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

export function CreateGroupModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bannerImage, setBannerImage] = useState<FileWithPreview | null>(null);
  const [dirty, setDirty] = useState<requiredGroupField>({
    name: false,
    description: false,
    branchOfService: false,
    tags: false,
  });

  const [input, setInput] = useState<NewGroup>({
    name: "",
    description: "",
    online: false,
    county: "",
    state: "",
    displayPhoto: "",
    branchOfService: [],
    tags: [],
  });

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
    });
  };

  const handleInputChange = ({ e, inputType, multi, single }: any) => {
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

  return (
    <>
      <Button onClick={onOpen}>Create new group</Button>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <ModalOverlay />
        <ModalContent minW="900px">
          <ModalHeader>Create new group</ModalHeader>
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
