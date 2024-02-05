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
import { AsyncSelect, Select as MultiSelect } from "chakra-react-select";
import {
  FileWithPreview,
  NewGroup,
  requiredGroupField,
} from "@/app/types/groups";

export function CreateGroupModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [state, setState] = useState<string[]>();
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

  // for getting country and states
  const COUNTY_GEOJSON_URL =
    "https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson";
  const STATE_GEOJSON_URL =
    "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

  const sample = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  async function fetchCountiesData({ inputValue }: { inputValue: string }) {
    try {
      const response = await axios.get(COUNTY_GEOJSON_URL);
      let extractedCounties = response?.data?.features?.map(
        (res: any) => res?.properties?.NAME
      );

      let uniqueCounties = Array.from(new Set(extractedCounties));

      let filteredCounties = uniqueCounties.filter((countyName: any) =>
        countyName?.toLowerCase()?.includes(inputValue.toLowerCase())
      );

      let counties = filteredCounties.map((countyName) => ({
        value: countyName,
        label: countyName,
      }));

      return counties;
    } catch (e) {
      console.error("Error fetching GeoJSON data: ", e);
      return [];
    }
  }

  async function fetchStateData() {
    try {
      let states;
      const response = await axios.get(STATE_GEOJSON_URL);

      states = response?.data?.features?.map((res: any) => {
        return { value: res?.properties?.name, label: res?.properties?.name };
      });

      setState(states);
    } catch (e) {
      console.error("Error fetching GeoJSON data: ", e);
    }
  }

  useEffect(() => {
    fetchStateData();
  }, []);

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

            {/* name */}
            <FormControl isInvalid={isNameError}>
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                placeholder="Name"
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

            <div className="flex flex-row gap-6">
              <FormControl>
                <AsyncSelect
                  loadOptions={(e) => fetchCountiesData({ inputValue: e })}
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

              <FormControl>
                <MultiSelect
                  options={state}
                  placeholder="Select state"
                  onChange={(e) =>
                    handleInputChange({
                      e: e,
                      inputType: "state",
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
                <MultiSelect
                  isMulti
                  name="interest"
                  options={sample}
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
                    Select atleast one interest.
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={isBranchOfServiceError}>
                <MultiSelect
                  isMulti
                  name="branchOfService"
                  options={sample}
                  placeholder="Select branch of service"
                  variant="outline"
                  useBasicStyles
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
                      multi: true,
                    })
                  }
                />

                {isBranchOfServiceError && (
                  <FormErrorMessage>
                    Select atleast one branch of service.
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
