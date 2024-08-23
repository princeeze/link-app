"use client";

import { useState } from "react";

import { uploadFile } from "@/app/(home)/dashboard/profile/profile";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function ProfileForm() {
  const form = useForm();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: any) {
    console.log(data);
    if (data.file && data.file.length > 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", data.file[0]);
        console.log(formData);
        const result = await uploadFile(formData);
        console.log("File uploaded successfully", result);
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No file selected");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Item</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  //For some reason, react hook form needs this for file types
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
