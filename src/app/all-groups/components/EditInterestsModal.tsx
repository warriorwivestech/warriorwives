"use client";

import { apiClient } from "@/apiClient";
import { getInterestsRequestOptions } from "@/app/api/interests/helper";
import { InterestsType } from "@/app/api/interests/route";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SWRProvider } from "@/providers/swrProvider";
import { Spinner } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useSWR, { KeyedMutator } from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

const interestsFormSchema = z.object({
  interests: z.array(
    z.object({
      id: z.number({
        required_error: "Field cannot be empty",
      }),
      value: z.string({ required_error: "Field cannot be empty" }).min(1, {
        message: "Field cannot be empty",
      }),
    })
  ),
});

export type InterestsFormValues = z.infer<typeof interestsFormSchema>;

interface InterestFieldType {
  id: number;
  value: string;
}

async function updateInterests(
  url: string,
  { arg }: { arg: InterestsFormValues }
) {
  await apiClient(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });
}

interface InterestsFormProps {
  interests: InterestsType;
  revalidateData: KeyedMutator<InterestsType>;
}

function InterestsForm({ interests, revalidateData }: InterestsFormProps) {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [deletedInterests, setDeletedInterests] = useState<InterestFieldType[]>(
    []
  );
  const deletedInterestsWarning =
    deletedInterests.length > 0
      ? "Warning: You are about to delete the following interests: " +
        deletedInterests.map((interest) => interest.value).join(", ")
      : "";
  const defaultValues = {
    interests: interests.map((interest) => ({
      id: interest.id,
      value: interest.name,
    })),
  };

  const form = useForm<z.infer<typeof interestsFormSchema>>({
    resolver: zodResolver(interestsFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.setValue(
      "interests",
      interests.map((interest) => ({ id: interest.id, value: interest.name }))
    );
  }, [interests, form]);

  const { trigger, isMutating } = useSWRMutation(
    `/interests`,
    updateInterests,
    {
      onSuccess: () => {
        revalidateData();
        setDeletedInterests([]);
        setModalOpen(false);
        toast({
          title: `Interests Updated`,
          description: `Interests has been successfully updated.`,
        });
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

  function onSubmit(data: z.infer<typeof interestsFormSchema>) {
    trigger(data);
  }

  const { fields, append, remove } = useFieldArray({
    name: "interests",
    control: form.control,
  });

  return (
    <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="mr-2"
          size="sm"
          disabled={isMutating}
        >
          Edit Interests
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Interests</AlertDialogTitle>
              <AlertDialogDescription className="max-h-[80dvh] overflow-y-auto">
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`interests.${index}.value`}
                    render={({ field }) => {
                      return (
                        <FormItem className="mb-2">
                          <FormControl>
                            <div className="flex items-center">
                              <Input {...field} className="bg-slate-50" />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="ml-2 p-2"
                                onClick={() => {
                                  const interestFromForm =
                                    form.getValues("interests")[index];
                                  if (interestFromForm.id !== 0) {
                                    setDeletedInterests((prev) => [
                                      ...prev,
                                      fields[index],
                                    ]);
                                  }
                                  remove(index);
                                }}
                              >
                                <Cross2Icon />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <div>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2 mr-2"
                    onClick={() => append({ id: 0, value: "" })}
                  >
                    Add Interest
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setDeletedInterests([]);
                      form.reset();
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <FormDescription className="text-orange-500 mt-2">
                  Warning: Editing an interest will update it in all troops and
                  users. If you want to edit an interest to become a completely
                  new unrelated interest, you should delete the old interest and
                  create a new one.
                </FormDescription>
                {deletedInterestsWarning && (
                  <FormDescription className="text-red-500 mt-2">
                    {deletedInterestsWarning}
                    <br />
                    Deleting an interest will remove it from all troops and
                    users.
                  </FormDescription>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                type="submit"
                disabled={isMutating}
                className="w-full sm:w-20"
              >
                {isMutating ? <Spinner size="sm" /> : "Save"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function _EditInterestsModal() {
  const {
    data: interestsData,
    error: interestsError,
    isLoading: interestsAreLoading,
    mutate: revalidateInterests,
  } = useSWR<InterestsType>(["/interests", getInterestsRequestOptions()]);

  if (interestsAreLoading || !interestsData)
    return (
      <Button variant="outline" className="mr-2" disabled={interestsAreLoading}>
        Edit Interests
      </Button>
    );

  return (
    <InterestsForm
      interests={interestsData}
      revalidateData={revalidateInterests}
    />
  );
}

export default function EditInterestsModal() {
  return (
    <SWRProvider>
      <_EditInterestsModal />
    </SWRProvider>
  );
}
