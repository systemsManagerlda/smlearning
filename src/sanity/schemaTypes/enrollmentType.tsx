import Image from "next/image";
import { defineField, defineType } from "sanity";

export const enrollmentType = defineType({
  name: "enrollment",
  title: "Inscrição",
  type: "document",
  fields: [
    defineField({
      name: "student",
      title: "Aluno",
      type: "reference",
      to: [{ type: "student" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "course",
      title: "Curso",
      type: "reference",
      to: [{ type: "course" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Preço",
      type: "number",
      validation: (rule) => rule.required().min(0),
      description: "O valor a ser pago pela inscrição no curso...",
    }),
    defineField({
      name: "paymentId",
      title: "ID de pagamento",
      type: "string",
      validation: (rule) => rule.required(),
      description: "O ID da sessão de pagamento/checkout",
    }),
    defineField({
      name: "enrolledAt",
      title: "Inscrito em",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      courseTitle: "course.title",
      studentFirstName: "student.firstName",
      studentLastName: "student.lastName",
      studentImage: "student.imageUrl",
    },
    prepare({ courseTitle, studentFirstName, studentLastName, studentImage }) {
      return {
        title: `${studentFirstName} ${studentLastName}`,
        subtitle: courseTitle,
        media: (
          <Image
            src={studentImage}
            alt={`${studentFirstName} ${studentLastName}`}
            width={100}
            height={100}
          />
        ),
      };
    },
  },
});
