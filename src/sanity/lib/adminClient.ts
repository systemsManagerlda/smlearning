import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
import baseUrl from "@/lib/baseUrl";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: `${baseUrl}/studio`,
  },
  token: "skTejYOH9T0gMD0rRLyPE5HBUH2KwSoijAbcORHWn9MOJIE5s2KbMLs1xRnYr3sgO7EuWuF1v4KfLSHde4o4ORE8TpouDP5T3k6Tik19vpaZkf2R4K9MP8fqtpXLwIgrLT1WjU0sfkCHpJQmX712ILnrAjd2DUJjnM2SxNIDXJUbF6lMF7J1",
});
