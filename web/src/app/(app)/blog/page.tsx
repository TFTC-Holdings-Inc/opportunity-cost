import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Header } from "@/components/landing-page/header";
import { Footer } from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Suspense } from "react";

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

    const where: any = {
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
      collection: "posts",
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
      collection: "categories",
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
      collection: "tags",
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
    <main className="min-h-screen bg-background pt-24 pb-16">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights about Bitcoin, the opportunity cost mindset, and building
              better financial awareness
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link href="/blog">
              <Button
                variant={!activeCategory && !activeTag ? "primary" : "outline"}
                className="rounded-full"
              >
                All Posts
              </Button>
            </Link>

            {categories.map((category: any) => (
              <Link key={category.id} href={`/blog?category=${category.slug}`}>
                <Button
                  variant={
                    activeCategory === category.slug ? "primary" : "outline"
                  }
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              </Link>
            ))}

            {tags.slice(0, 6).map((tag: any) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <Button
                  variant={activeTag === tag.slug ? "primary" : "outline"}
                  className="rounded-full"
                >
                  {tag.name}
                </Button>
              </Link>
            ))}
          </div>

          {posts.docs && posts.docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.docs.map((post: any) => (
                <article
                  key={post.id}
                  className="bg-card rounded-lg p-6 shadow-sm border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4">
                    {post.featured && (
                      <span className="inline-block bg-oc-primary text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide mb-3">
                        Featured
                      </span>
                    )}

                    {(post.previewImage || post.featuredImage) && (
                      <Link href={`/blog/${post.slug}`}>
                        <div className="aspect-video overflow-hidden rounded-lg mb-4">
                          <Image
                            src={(post.previewImage || post.featuredImage).url}
                            alt={
                              (post.previewImage || post.featuredImage).alt ||
                              post.title
                            }
                            width={400}
                            height={240}
                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                          />
                        </div>
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {post.author?.avatar && (
                      <Image
                        src={post.author.avatar.url}
                        alt={post.author.displayName || "Author"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">
                        {post.author?.displayName ||
                          `${post.author?.firstName} ${post.author?.lastName}` ||
                          "Anonymous"}
                      </p>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground mb-3 hover:text-oc-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
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
                        <span>{post.readingTime} min read</span>
                      )}
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-oc-primary hover:text-oc-primary/80 font-medium transition-colors"
                    >
                      Read →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No posts found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new content.
              </p>
            </div>
          )}

          {posts.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                {Array.from({ length: posts.totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const searchQuery = new URLSearchParams();
                    if (activeCategory)
                      searchQuery.set("category", activeCategory);
                    if (activeTag) searchQuery.set("tag", activeTag);
                    if (page > 1) searchQuery.set("page", page.toString());

                    const href = `/blog${searchQuery.toString() ? `?${searchQuery.toString()}` : ""}`;

                    return (
                      <Link key={page} href={href}>
                        <Button
                          variant={page === posts.page ? "primary" : "outline"}
                          className="rounded-lg"
                        >
                          {page}
                        </Button>
                      </Link>
                    );
                  }
                )}
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
