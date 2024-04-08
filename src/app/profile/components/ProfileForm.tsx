"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Cross2Icon } from "@radix-ui/react-icons";

const availableInterests = [
  { value: "Christian", label: "Christian" },
  { value: "Gardening", label: "Gardening" },
  { value: "Cooking", label: "Cooking" },
  { value: "Reading", label: "Reading" },
  { value: "Fitness", label: "Fitness" },
  { value: "Music", label: "Music" },
  { value: "Art", label: "Art" },
  { value: "Sports", label: "Sports" },
  { value: "Travel", label: "Travel" },
  { value: "Photography", label: "Photography" },
];

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(40, {
      message: "Name must not be longer than 40 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  branch: z.string({
    required_error: "Please select a branch of service.",
  }),
  interests: z
    .array(
      z.object({
        value: z
          .string({ required_error: "Please select an interest" })
          .min(1, {
            message: "Please select an interest",
          }),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  name: "Jane Doe",
  branch: "Army",
  email: "warriorwivestech@gmail.com",
  interests: [{ value: "Christian" }, { value: "Gardening" }],
};

export function ProfileForm() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "interests",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@google.com" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch of Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch of service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Army">Army</SelectItem>
                  <SelectItem value="Air Force">Air Force</SelectItem>
                  <SelectItem value="Marine">Marine</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The branch of service that you or your family member served in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`interests.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Interests
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Select any of these available interests. More interests will
                    be added when more groups are created.
                  </FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? availableInterests.find(
                                  (interest) => interest.value === field.value
                                )?.label
                              : "Select interest"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="ml-2 p-2"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <Cross2Icon />
                          </Button>
                        </div>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search interest..."
                          className="h-9"
                        />
                        <CommandEmpty>No interests found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {availableInterests.map((interest) => (
                              <CommandItem
                                value={interest.label}
                                key={interest.value}
                                onSelect={() => {
                                  form.setValue(
                                    `interests.${index}.value`,
                                    interest.value
                                  );
                                }}
                              >
                                {interest.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    interest.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add Interest
          </Button>
        </div>
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
