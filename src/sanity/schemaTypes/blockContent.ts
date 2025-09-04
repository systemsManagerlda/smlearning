import { defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent1",
  title: "Content",
  type: "array",
  of: [{ type: "block" }],
});
