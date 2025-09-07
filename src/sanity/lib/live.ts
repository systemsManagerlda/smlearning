// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
"use server"
import { defineLive } from "next-sanity";
import { client } from "./client";

const token = "skCV2Z6CKWLtgRXnHbxnz1RLRtPQVfly1whyBTi4PwKz9rnp0jO0dl7opGYBXYw8a9Zoe4evUtqtIuMH7GM2N8q1uIGHAfeHlVXRTOEztpcovm39V2nVrcL1pmx94h1M1jsvmJboJt42St1ImVqGk2VQtrAmH4Ahb7wqMJoUKrbXhctIbFx9";
if (!token) {
  throw new Error("Missing SANITY_API_TOKEN");
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  fetchOptions: { 
    revalidate: 0,
  },
});