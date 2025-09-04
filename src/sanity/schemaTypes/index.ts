import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { studentType } from "./studentType";
import { courseType } from "./courseType";
import { blockContent } from "./blockContent";
import { enrollmentType } from "./enrollmentType";
import { lessonCompletionType } from "./lessonCompletionType";
import { moduleType } from "./moduleType";
import { lessonType } from "./lessonType";
import { instructorType } from "./instructorType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    studentType,
    courseType,
    blockContent,
    enrollmentType,
    lessonCompletionType,
    moduleType,
    lessonType,
    instructorType
  ],
};
