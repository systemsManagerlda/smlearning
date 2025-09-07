import { defineField, defineType } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lição",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
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
      name: "videoUrl",
      title: "URL do vídeo",
      type: "url",
      description: "A URL do player de vídeo (por exemplo, YouTube, Vimeo)",
    }),
    defineField({
      name: "loomUrl",
      title: "Loom Share URL",
      type: "url",
      description:
        "O URL completo de compartilhamento do Loom (por exemplo, https://www.loom.com/share/...)",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true; // Allow empty value
          try {
            const url = new URL(value);
            if (!url.hostname.endsWith("loom.com")) {
              return "URL must be from loom.com";
            }
            if (!url.pathname.startsWith("/share/")) {
              return "Must be a Loom share URL";
            }
            const videoId = url.pathname.split("/share/")[1];
            if (!/^[a-f0-9-]{32,36}/.test(videoId)) {
              return "Invalid Loom video ID in URL";
            }
            return true;
          } catch {
            return "Please enter a valid URL";
          }
        }),
    }),
    defineField({
      name: "content",
      title: "Conteúdo",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
