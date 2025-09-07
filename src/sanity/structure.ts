import { StructureBuilder } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Painel de Administração")
    .items([
      // Course Content
      S.listItem()
        .title("Conteúdo do Curso")
        .child(
          S.documentTypeList("course")
            .title("Cursos")
            .child((courseId) =>
              S.list()
                .title("Opções de Curso")
                .items([
                  // Option to edit course content
                  S.listItem()
                    .title("Editar o Conteúdo do Curso")
                    .child(
                      S.document().schemaType("course").documentId(courseId)
                    ),
                  // Option to view course enrollments
                  S.listItem()
                    .title("Ver Alunos")
                    .child(
                      S.documentList()
                        .title("Inscrições em Cursos")
                        .filter(
                          '_type == "enrollment" && course._ref == $courseId'
                        )
                        .params({ courseId })
                    ),
                ])
            )
        ),

      S.divider(),

      // Users
      S.listItem()
        .title("Gerenciamento de Usuários")
        .child(
          S.list()
            .title("Selecione um Tipo de Usuário")
            .items([
              // Instructors with options
              S.listItem()
                .title("Instrutores")
                .schemaType("instructor")
                .child(
                  S.documentTypeList("instructor")
                    .title("Instrutores")
                    .child((instructorId) =>
                      S.list()
                        .title("Opções do Instrutor")
                        .items([
                          // Option to edit instructor details
                          S.listItem()
                            .title("Editar Detalhes do Instrutor")
                            .child(
                              S.document()
                                .schemaType("instructor")
                                .documentId(instructorId)
                            ),
                          // Option to view instructor's courses
                          S.listItem()
                            .title("Ver Cursos")
                            .child(
                              S.documentList()
                                .title("Cursos de Instrutores")
                                .filter(
                                  '_type == "course" && instructor._ref == $instructorId'
                                )
                                .params({ instructorId })
                            ),
                        ])
                    )
                ),
              // Students with options
              S.listItem()
                .title("Alunos")
                .schemaType("student")
                .child(
                  S.documentTypeList("student")
                    .title("Alunos")
                    .child((studentId) =>
                      S.list()
                        .title("Opções Para Alunos")
                        .items([
                          // Option to edit student details
                          S.listItem()
                            .title("Editar Detalhes do Aluno")
                            .child(
                              S.document()
                                .schemaType("student")
                                .documentId(studentId)
                            ),
                          // Option to view enrollments
                          S.listItem()
                            .title("Ver Inscrições")
                            .child(
                              S.documentList()
                                .title("Matrículas de Alunos")
                                .filter(
                                  '_type == "enrollment" && student._ref == $studentId'
                                )
                                .params({ studentId })
                            ),
                          // Option to view completed lessons
                          S.listItem()
                            .title("Ver Lições Concluídas")
                            .child(
                              S.documentList()
                                .title("Lições Concluídas")
                                .schemaType("lessonCompletion")
                                .filter(
                                  '_type == "lessonCompletion" && student._ref == $studentId'
                                )
                                .params({ studentId })
                                .defaultOrdering([
                                  { field: "completedAt", direction: "desc" },
                                ])
                            ),
                        ])
                    )
                ),
            ])
        ),

      S.divider(),

      // System Management
      S.listItem()
        .title("Gerenciamento do Sistema")
        .child(
          S.list()
            .title("Gerenciamento do Sistema")
            .items([S.documentTypeListItem("category").title("Categorias")])
        ),
    ]);
