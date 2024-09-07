import { z } from "zod";
import { create } from "zustand";

import { linkFormSchema, profileFormSchema } from "@/lib/schema";

interface FormDataState {
  linkStore: z.infer<typeof linkFormSchema>["links"];
  /* eslint-disable no-unused-vars */
  setLinkStore: (data: z.infer<typeof linkFormSchema>["links"]) => void;
  profileStore: z.infer<typeof profileFormSchema>;
  setProfileStore: (data: z.infer<typeof profileFormSchema>) => void;
  avatarURL: string | undefined;
  setAvatarURL: (link: string | undefined) => void;
  fetchedData: boolean;
  setFetchedData: (data: boolean) => void;
  resetStore: () => void;
  /* eslint-enable no-unused-vars */
}

export const useFormDataStore = create<FormDataState>((set) => ({
  linkStore: [],
  setLinkStore: (data) => set({ linkStore: data }),
  profileStore: {
    name: "",
    username: "",
    email: "",
    avatar: undefined,
  },
  setProfileStore: (data) => set({ profileStore: data }),
  avatarURL: undefined,
  setAvatarURL: (link) => set({ avatarURL: link }),
  fetchedData: false,
  setFetchedData: (data) => set({ fetchedData: data }),
  resetStore: () =>
    set({
      linkStore: [],
      profileStore: { name: "", username: "", email: "", avatar: undefined },
      avatarURL: undefined,
      fetchedData: false,
    }),
}));
