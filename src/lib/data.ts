export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
};

const posts: Post[] = [
  {
    slug: "welcome-to-nextjs-16",
    title: "Welcome to Next.js 16",
    excerpt: "File-system routing, Turbopack by default, and async params.",
    content:
      "Next.js 16 ships with Turbopack as the default bundler and treats route params as Promises you must await.",
  },
  {
    slug: "app-router-basics",
    title: "App Router Basics",
    excerpt: "Layouts, loading states, and nested routes.",
    content:
      "The app/ directory maps folders to URLs. Special files like layout.tsx and loading.tsx add behavior without extra config.",
  },
  {
    slug: "why-generate-metadata",
    title: "Why generateMetadata Matters",
    excerpt: "Per-page titles and SEO from a single async export.",
    content:
      "export async function generateMetadata() lets each route set its own <title> and meta tags — great for blogs and product pages.",
  },
];

const users: User[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@example.com" },
  { id: "2", name: "Grace Hopper", email: "grace@example.com" },
  { id: "3", name: "Linus Torvalds", email: "linus@example.com" },
];

const products: Product[] = [
  { id: "1", name: "Mechanical Keyboard", price: 129 },
  { id: "2", name: "USB-C Hub", price: 49 },
  { id: "3", name: "Monitor Stand", price: 79 },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPosts(): Promise<Post[]> {
  await delay(800);
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await delay(400);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getUsers(): Promise<User[]> {
  await delay(600);
  return users;
}

export async function getProducts(): Promise<Product[]> {
  await delay(1200);
  return products;
}

export async function getSlowSummary(): Promise<string> {
  await delay(2000);
  return "This summary loaded slowly — perfect for demonstrating streaming in Session 2.";
}
