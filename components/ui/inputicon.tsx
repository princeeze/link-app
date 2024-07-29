/* eslint-disable react/jsx-no-undef */
import { LucideLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";
import { AnyAaaaRecord } from "dns";

export default function Signup() {
  return (
    <div className="p-5">
      <FormField
        control={form.control}
        name="username"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <div className="relative border-borders flex items-center max-w-2xl">
              <LucideLink
                className="absolute left-4 top-1/2 -translate-y-1/2 transform text-grey-default"
                size={16}
              />
              <FormControl>
                <Input
                  placeholder="Text Field Empty"
                  className={cn(
                    "pl-11 pr-4",
                    fieldState.error && "border-red text-red"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform" />
            </div>
            <FormDescription>This is your public display name.</FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}
