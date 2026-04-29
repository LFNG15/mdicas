// Linha do banco (snake_case)
export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tag: string;
  author: string;
  date: string;
  read_time: string;
  gradient: string;
  featured: boolean;
  featured_main: boolean;
  created_at: string;
  updated_at: string;
}

// Tipo usado na aplicação (camelCase)
export interface Post {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tag: string;
  author: string;
  date: string;
  readTime: string;
  gradient: string;
  featured: boolean;
  featuredMain: boolean;
}

export function rowToPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tag: row.tag,
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    gradient: row.gradient,
    featured: row.featured,
    featuredMain: row.featured_main,
  };
}

export function postToRow(post: Post): Omit<PostRow, "id" | "created_at" | "updated_at"> {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tag: post.tag,
    author: post.author,
    date: post.date,
    read_time: post.readTime,
    gradient: post.gradient,
    featured: post.featured,
    featured_main: post.featuredMain,
  };
}
