import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPayload, Where } from "payload";
import config from "@/payload.config";
import { Header } from "@/components/landing-page/header";
import { Footer } from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Suspense } from "react";
import { Media, User } from "@/payload-types";

// Define proper types based on collection configuration
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  previewImage?: Media;
  featuredImage?: Media;
  author?: User & {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    avatar?: Media;
  };
  featured?: boolean;
  publishedAt?: string;
  readingTime?: number;
  status: "draft" | "published" | "scheduled" | "archived";
  categories?: Category[];
  tags?: Tag[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  featuredImage?: Media;
  postsCount?: number;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postsCount?: number;
}

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Latest blog posts about Bitcoin, cryptocurrency, and the Opportunity Cost extension",
};

interface SearchParams {
  category?: string;
  tag?: string;
  page?: string;
}

async function getBlogPosts(searchParams: SearchParams = {}) {
  try {
    const payload = await getPayload({ config });

    const where: Where = {
      status: {
        equals: "published",
      },
    };

    if (searchParams.category) {
      where.categories = {
        in: [searchParams.category],
      };
    }

    if (searchParams.tag) {
      where.tags = {
        in: [searchParams.tag],
      };
    }

    const posts = await payload.find({
      collection: "posts" as any,
      limit: 12,
      where,
      sort: "-publishedAt",
      page: searchParams.page ? parseInt(searchParams.page) : 1,
    });

    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1 };
  }
}

async function getCategories() {
  try {
    const payload = await getPayload({ config });
    const categories = await payload.find({
      collection: "categories" as any,
      limit: 20,
      sort: "name",
    });
    return categories.docs;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getTags() {
  try {
    const payload = await getPayload({ config });
    const tags = await payload.find({
      collection: "tags" as any,
      limit: 20,
      sort: "name",
    });
    return tags.docs;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

interface BlogContentProps {
  searchParams: SearchParams;
}

async function BlogContent({ searchParams }: BlogContentProps) {
  const [posts, categories, tags] = await Promise.all([
    getBlogPosts(searchParams),
    getCategories(),
    getTags(),
  ]);

  const activeCategory = searchParams.category;
  const activeTag = searchParams.tag;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 pt-24 pb-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <Container>
          <div className="relative max-w-4xl mx-auto text-center pt-24">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Opportunity Cost <span className="text-oc-primary">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Insights about Bitcoin, opportunity cost thinking, and building
              better financial awareness in the digital age
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-7xl mx-auto pb-20">
          {posts.docs && posts.docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {posts.docs.map((post: Post) => (
                <article
                  key={post.id}
                  className="group relative bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-oc-primary to-oc-primary/80 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-lg">
                        ⭐ Featured
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  {(post.previewImage || post.featuredImage) && (
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                        <Image
                          src={
                            (post.previewImage || post.featuredImage)?.url || ""
                          }
                          alt={
                            (post.previewImage || post.featuredImage)?.alt ||
                            post.title
                          }
                          width={600}
                          height={375}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  )}

                  <div className="p-6 space-y-4">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      {post.author?.avatar ? (
                        <Image
                          src={post.author.avatar.url || ""}
                          alt={post.author.displayName || "Author"}
                          width={40}
                          height={40}
                          className="rounded-full ring-2 ring-border"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-oc-primary to-oc-primary/70 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {(post.author?.displayName ||
                            post.author?.firstName ||
                            "A")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {post.author?.displayName ||
                            `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim() ||
                            "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {post.publishedAt && (
                            <time dateTime={post.publishedAt}>
                              {new Date(post.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </time>
                          )}
                          {post.readingTime && (
                            <>
                              <span>•</span>
                              <span>{post.readingTime} min read</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-foreground group-hover:text-oc-primary transition-colors duration-200 leading-tight">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Categories & Tags */}
                    {(post.categories || post.tags) && (
                      <div className="flex flex-wrap gap-2">
                        {post.categories
                          ?.slice(0, 2)
                          .map((category: Category) => (
                            <Link
                              key={category.id}
                              href={`/blog?category=${category.slug}`}
                              className="inline-flex items-center px-2.5 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground hover:bg-oc-primary hover:text-white transition-colors"
                            >
                              {category.name}
                            </Link>
                          ))}
                        {post.tags?.slice(0, 2).map((tag: Tag) => (
                          <Link
                            key={tag.id}
                            href={`/blog?tag=${tag.slug}`}
                            className="inline-flex items-center px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            #{tag.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Read More */}
                    <div className="pt-2 border-t border-border/50">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-oc-primary hover:text-oc-primary/80 transition-colors group/link"
                      >
                        Read Full Article
                        <svg
                          className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  No posts found
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We couldn't find any posts matching your current filters. Try
                  adjusting your search criteria or check back later for new
                  content.
                </p>
                <Link href="/blog">
                  <Button variant="outline" className="rounded-full">
                    Clear Filters
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {posts.totalPages > 1 && (
            <div className="flex justify-center mt-16">
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  {posts.page > 1 && (
                    <Link
                      href={`/blog${posts.page > 2 ? `?page=${posts.page - 1}` : ""}${activeCategory ? `${posts.page > 2 ? "&" : "?"}category=${activeCategory}` : ""}${activeTag ? `${posts.page > 2 || activeCategory ? "&" : "?"}tag=${activeTag}` : ""}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Previous
                      </Button>
                    </Link>
                  )}

                  {Array.from({ length: posts.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === posts.totalPages ||
                        Math.abs(page - posts.page) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      const searchQuery = new URLSearchParams();
                      if (activeCategory)
                        searchQuery.set("category", activeCategory);
                      if (activeTag) searchQuery.set("tag", activeTag);
                      if (page > 1) searchQuery.set("page", page.toString());

                      const href = `/blog${searchQuery.toString() ? `?${searchQuery.toString()}` : ""}`;

                      const showEllipsis =
                        index > 0 && array[index - 1] < page - 1;

                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Link href={href}>
                            <Button
                              variant={
                                page === posts.page ? "default" : "ghost"
                              }
                              size="sm"
                              className={`rounded-full min-w-[40px] ${
                                page === posts.page
                                  ? "bg-oc-primary hover:bg-oc-primary/90 text-white"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {page}
                            </Button>
                          </Link>
                        </div>
                      );
                    })}

                  {posts.page < posts.totalPages && (
                    <Link
                      href={`/blog?page=${posts.page + 1}${activeCategory ? `&category=${activeCategory}` : ""}${activeTag ? `&tag=${activeTag}` : ""}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        Next
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center pt-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oc-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          </div>
        }
      >
        <BlogContent searchParams={params} />
      </Suspense>
      <Footer />
    </>
  );
}
