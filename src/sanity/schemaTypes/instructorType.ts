import { defineField, defineType } from "sanity";

export const instructorType = defineType({
  name: "instructor",
  title: "Instrutor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nome",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biografia",
      type: "text",
    }),
    defineField({
      name: "photo",
      title: "Foto",
      type: "image",
    }),
  ],
});
