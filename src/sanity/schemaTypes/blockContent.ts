import { defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent1",
  title: "Conteúdo",
  type: "array",
  of: [{ type: "block" }],
});
