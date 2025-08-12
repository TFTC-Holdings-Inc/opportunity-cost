import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { Header } from "@/components/landing-page/header";
import { Footer } from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";

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

  const html = convertLexicalToHTML({ data: post.content });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="pt-32 pb-24 px-6 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <article>
              <header className="mb-16">
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.featured && (
                    <span className="bg-oc-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
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
                        className="rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: category.color
                            ? `${category.color}10`
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

                <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-8 leading-[1.1] tracking-tight">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-light">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-6 mb-12 pb-8 border-b border-border/50">
                  {post.author && (
                    <div className="flex items-center gap-4">
                      {post.author.avatar ? (
                        <Image
                          src={post.author.avatar.url}
                          alt={
                            post.author.displayName ||
                            `${post.author.firstName} ${post.author.lastName}` ||
                            "Author"
                          }
                          width={48}
                          height={48}
                          className="rounded-full ring-2 ring-border/20"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-oc-primary rounded-full flex items-center justify-center ring-2 ring-border/20">
                          <span className="text-white font-bold">
                            {(post.author.displayName ||
                              post.author.firstName ||
                              "A")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {post.author.displayName ||
                            `${post.author.firstName} ${post.author.lastName}` ||
                            "Anonymous"}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                            <>
                              <span className="text-muted-foreground/60">
                                •
                              </span>
                              <span>{post.readingTime} min read</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {post.featuredImage && (
                  <div className="mb-16">
                    <div className="aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                )}
              </header>

              <div
                className="prose prose-lg prose-neutral dark:prose-invert mb-12 max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-oc-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-muted prose-pre:border prose-blockquote:border-l-oc-primary prose-blockquote:bg-muted/30 prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {post.tags && post.tags.length > 0 && (
                <div className="mb-16 p-8 bg-muted/30 rounded-2xl border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag: any) => (
                      <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-sm font-medium hover:bg-oc-primary hover:text-white hover:border-oc-primary transition-all duration-200"
                        >
                          #{tag.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <div className="border-t border-border/50 pt-16">
                  <h3 className="text-2xl font-bold text-foreground mb-12">
                    Related Posts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {post.relatedPosts.slice(0, 3).map((relatedPost: any) => (
                      <article
                        key={relatedPost.id}
                        className="group bg-card rounded-xl p-6 shadow-sm border border-border/50 transition-all duration-300 hover:shadow-lg hover:border-border hover:-translate-y-1"
                      >
                        {(relatedPost.previewImage ||
                          relatedPost.featuredImage) && (
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <div className="aspect-video overflow-hidden rounded-lg mb-6">
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
                                width={400}
                                height={225}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                        )}

                        <div>
                          <h4 className="font-bold text-foreground mb-3 leading-tight group-hover:text-oc-primary transition-colors duration-200">
                            <Link href={`/blog/${relatedPost.slug}`}>
                              {relatedPost.title}
                            </Link>
                          </h4>

                          {relatedPost.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                              {relatedPost.excerpt}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border/50 pt-12">
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="inline-flex items-center gap-3 rounded-full px-6 py-3 font-medium hover:bg-oc-primary hover:text-white hover:border-oc-primary transition-all duration-200"
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
        </div>
      </main>
      <Footer />
    </>
  );
}
