import { defineField, defineType } from "sanity";

export const courseType = defineType({
  name: "course",
  title: "Coursos",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    {
      name: "price",
      title: "Preço (MZN)",
      type: "number",
      description: "Preço em Meticais",
      validation: (Rule) => Rule.min(0),
    },
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descrição",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Image do Curso",
      type: "image",
    }),
    defineField({
      name: "category",
      title: "Categoria",
      description: "A categoria do curso",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "modules",
      title: "Modulos",
      description: "Os módulos do curso",
      validation: (rule) => rule.required(),
      type: "array",
      of: [{ type: "reference", to: { type: "module" } }],
    }),
    defineField({
      name: "instructor",
      title: "Instrutor",
      description: "O instrutor do curso",
      validation: (rule) => rule.required(),
      type: "reference",
      to: { type: "instructor" },
    }),
  ],
});
