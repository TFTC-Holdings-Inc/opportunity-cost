import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";
import { PayloadLexicalReact } from "@zapal/payload-lexical-react";
import { Header } from "@/components/landing-page/header";
import { Footer } from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  try {
    const payload = await getPayload({ config });

    const posts = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: "published",
        },
      },
      limit: 1,
    });

    return posts.docs.length > 0 ? posts.docs[0] : null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords?.map((k: any) => k.keyword) || [],
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.seo?.metaImage?.url
        ? [post.seo.metaImage.url]
        : post.featuredImage?.url
          ? [post.featuredImage.url]
          : [],
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.seo?.metaImage?.url
        ? [post.seo.metaImage.url]
        : post.featuredImage?.url
          ? [post.featuredImage.url]
          : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <article>
              <header className="mb-12">
                <div className="flex flex-wrap gap-3 mb-6">
                  {post.featured && (
                    <span className="bg-oc-primary text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      Featured
                    </span>
                  )}
                  {post.categories?.map((category: any) => (
                    <Link
                      key={category.id}
                      href={`/blog?category=${category.slug}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs"
                        style={{
                          backgroundColor: category.color
                            ? `${category.color}15`
                            : undefined,
                          borderColor: category.color || undefined,
                          color: category.color || undefined,
                        }}
                      >
                        {category.name}
                      </Button>
                    </Link>
                  ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-6 mb-8">
                  {post.author && (
                    <div className="flex items-center gap-3">
                      {post.author.avatar ? (
                        <Image
                          src={post.author.avatar.url}
                          alt={
                            post.author.displayName ||
                            `${post.author.firstName} ${post.author.lastName}` ||
                            "Author"
                          }
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-oc-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {(post.author.displayName ||
                              post.author.firstName ||
                              "A")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">
                          {post.author.displayName ||
                            `${post.author.firstName} ${post.author.lastName}` ||
                            "Anonymous"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {post.publishedAt && (
                            <time dateTime={post.publishedAt}>
                              {new Date(post.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </time>
                          )}
                          {post.readingTime && (
                            <span>{post.readingTime} min read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {post.featuredImage && (
                  <div className="mb-12">
                    <div className="aspect-video overflow-hidden rounded-lg shadow-sm">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        width={800}
                        height={400}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                )}
              </header>

              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none mb-16">
                <PayloadLexicalReact content={post.content} />
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mb-12 p-6 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: any) => (
                      <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-sm"
                        >
                          #{tag.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <div className="border-t border-border pt-12">
                  <h3 className="text-2xl font-bold text-foreground mb-8">
                    Related Posts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {post.relatedPosts.slice(0, 3).map((relatedPost: any) => (
                      <article
                        key={relatedPost.id}
                        className="bg-card rounded-lg p-4 shadow-sm border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                      >
                        {(relatedPost.previewImage ||
                          relatedPost.featuredImage) && (
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <div className="aspect-video overflow-hidden rounded-lg mb-4">
                              <Image
                                src={
                                  (
                                    relatedPost.previewImage ||
                                    relatedPost.featuredImage
                                  ).url
                                }
                                alt={
                                  (
                                    relatedPost.previewImage ||
                                    relatedPost.featuredImage
                                  ).alt || relatedPost.title
                                }
                                width={300}
                                height={180}
                                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                              />
                            </div>
                          </Link>
                        )}

                        <div>
                          <h4 className="font-semibold text-foreground mb-2 leading-tight hover:text-oc-primary transition-colors">
                            <Link href={`/blog/${relatedPost.slug}`}>
                              {relatedPost.title}
                            </Link>
                          </h4>

                          {relatedPost.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {relatedPost.excerpt}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-8 mt-12">
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="inline-flex items-center gap-2 rounded-full"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to all posts
                  </Button>
                </Link>
              </div>
            </article>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
