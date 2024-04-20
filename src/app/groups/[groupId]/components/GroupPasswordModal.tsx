"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
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
import { TriggerWithArgs } from "swr/mutation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { JoinGroupResponseType } from "@/app/api/groups/[groupId]/join/route";
import { Spinner } from "@chakra-ui/react";

const FormSchema = z.object({
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

interface GroupPasswordModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  trigger: TriggerWithArgs<
    JoinGroupResponseType,
    any,
    `/groups/${number}/join`,
    {
      password?: string | undefined;
    }
  >;
  disabled: boolean;
  data: JoinGroupResponseType | undefined;
}

export default function GroupPasswordModal({
  open,
  onOpenChange,
  trigger,
  disabled,
  data,
}: GroupPasswordModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    trigger({ password: data.password });
  }

  useEffect(() => {
    if (!data) return;
    if (data.error) {
      form.setError("password", {
        message: data.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button className="w-full" disabled={disabled}>
          Join Group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Enter Group Password</AlertDialogTitle>
              <AlertDialogDescription>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={disabled} className="w-20">
                {disabled ? <Spinner size="sm" /> : "Join"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
