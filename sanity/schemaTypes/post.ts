import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Resumo", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "content", title: "Conteúdo", type: "blockContent" }),
    defineField({ name: "category", title: "Categoria", type: "string" }),
    defineField({ name: "tag", title: "Tag", type: "string" }),
    defineField({ name: "author", title: "Autor", type: "string" }),
    defineField({ name: "date", title: "Data", type: "string" }),
    defineField({ name: "readTime", title: "Tempo de leitura", type: "string" }),
    defineField({ name: "gradient", title: "Gradiente CSS", type: "string" }),
    defineField({ name: "featured", title: "Destaque?", type: "boolean", initialValue: false }),
    defineField({ name: "featuredMain", title: "Destaque Principal?", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "author" },
  },
});
