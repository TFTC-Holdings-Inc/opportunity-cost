import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "status", "publishedAt"],
    listSearchableFields: ["title", "excerpt", "content"],
    description: "Create and manage blog posts with rich content and media",
    preview: (data) => {
      if (data?.slug) {
        return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${data.slug}`;
      }
      return null;
    },
  },
  access: {
    read: ({ req: { user } }) => {
      // Published posts are publicly readable
      // Drafts are only readable by authenticated users
      if (user) {
        return true;
      }

      return {
        status: {
          equals: "published",
        },
      };
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "The main title of your blog post",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "URL-friendly version of the title (auto-generated from title)",
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ value, originalDoc, data }) => {
            if (value) {
              return value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            }

            if (data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            }
          },
        ],
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "Brief summary of the post for previews, cards, and SEO (recommended: 150-160 characters)",
        placeholder:
          "Write a compelling summary that will appear in post previews...",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "content",
              type: "richText",
              required: true,
              localized: true,
              admin: {
                description: "The main content of your blog post",
              },
            },
          ],
        },
        {
          label: "Images",
          fields: [
            {
              name: "previewImage",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Small preview image for blog post cards and listings (recommended: 600x400px)",
              },
              filterOptions: {
                mediaType: {
                  equals: "image",
                },
              },
            },
            {
              name: "featuredImage",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Large featured image for the blog post header (recommended: 1200x630px)",
              },
              filterOptions: {
                mediaType: {
                  equals: "image",
                },
              },
            },
            {
              name: "gallery",
              type: "array",
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  filterOptions: {
                    mediaType: {
                      equals: "image",
                    },
                  },
                },
                {
                  name: "caption",
                  type: "text",
                  admin: {
                    description: "Optional caption for this image",
                  },
                },
              ],
              admin: {
                description: "Additional images to showcase in the post",
              },
            },
          ],
        },
        {
          label: "Metadata",
          fields: [
            {
              name: "author",
              type: "relationship",
              relationTo: "users",
              required: true,
              defaultValue: ({ user }) => user?.id,
              admin: {
                description: "Author of the blog post",
                position: "sidebar",
              },
            },
            {
              name: "categories",
              type: "relationship",
              relationTo: "categories",
              hasMany: true,
              admin: {
                description: "Categories for organizing posts",
                position: "sidebar",
              },
            },
            {
              name: "tags",
              type: "relationship",
              relationTo: "tags",
              hasMany: true,
              admin: {
                description: "Tags for better searchability",
                position: "sidebar",
              },
            },
            {
              name: "featured",
              type: "checkbox",
              defaultValue: false,
              admin: {
                description: "Mark as featured post to highlight it",
                position: "sidebar",
              },
            },
            {
              name: "relatedPosts",
              type: "relationship",
              relationTo: "posts",
              hasMany: true,
              admin: {
                description: "Related blog posts to show at the end",
              },
              filterOptions: {
                id: {
                  not_equals: "{{id}}",
                },
              },
            },
          ],
        },
        {
          label: "SEO & Social",
          fields: [
            {
              name: "seo",
              type: "group",
              label: "SEO Settings",
              fields: [
                {
                  name: "metaTitle",
                  type: "text",
                  localized: true,
                  admin: {
                    description:
                      "Override the page title for SEO (recommended: 50-60 characters)",
                    placeholder: "Leave empty to use post title",
                  },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  localized: true,
                  admin: {
                    description:
                      "Brief description for search engines (recommended: 150-160 characters)",
                    placeholder: "Leave empty to use excerpt",
                  },
                },
                {
                  name: "metaImage",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Image for social media sharing (recommended: 1200x630px). Defaults to featured image.",
                  },
                  filterOptions: {
                    mediaType: {
                      equals: "image",
                    },
                  },
                },
                {
                  name: "keywords",
                  type: "array",
                  fields: [
                    {
                      name: "keyword",
                      type: "text",
                      required: true,
                    },
                  ],
                  admin: {
                    description: "SEO keywords for this post",
                  },
                },
                {
                  name: "noIndex",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description:
                      "Prevent search engines from indexing this post",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "Published",
          value: "published",
        },
        {
          label: "Scheduled",
          value: "scheduled",
        },
        {
          label: "Archived",
          value: "archived",
        },
      ],
      admin: {
        description: "Publication status of the post",
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "When the post should be/was published",
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "readingTime",
      type: "number",
      admin: {
        description: "Estimated reading time in minutes (auto-calculated)",
        readOnly: true,
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData.content) {
              try {
                let textContent = "";

                // Handle richText content (Lexical format)
                if (
                  typeof siblingData.content === "object" &&
                  siblingData.content.root
                ) {
                  // Extract text from Lexical nodes recursively
                  const extractText = (node) => {
                    if (typeof node === "string") return node;
                    if (node.text) return node.text;
                    if (node.children && Array.isArray(node.children)) {
                      return node.children.map(extractText).join(" ");
                    }
                    return "";
                  };

                  textContent = extractText(siblingData.content.root);
                } else if (typeof siblingData.content === "string") {
                  // Handle plain text or HTML content
                  textContent = siblingData.content.replace(/<[^>]*>/g, "");
                }

                if (textContent) {
                  const wordCount = textContent
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length;
                  return Math.ceil(wordCount / 200);
                }
              } catch (error) {
                console.warn("Error calculating reading time:", error);
              }
            }
            return 0;
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === "create") {
          data.createdAt = new Date();
        }
        data.updatedAt = new Date();

        // Auto-fill SEO fields if empty
        if (data.seo) {
          if (!data.seo.metaTitle && data.title) {
            data.seo.metaTitle = data.title;
          }
          if (!data.seo.metaDescription && data.excerpt) {
            data.seo.metaDescription = data.excerpt;
          }
          if (!data.seo.metaImage && data.featuredImage) {
            data.seo.metaImage = data.featuredImage;
          }
        }
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log post creation/updates for analytics
        console.log(`Post ${operation}: ${doc.title} (${doc.id})`);
      },
    ],
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  endpoints: [
    {
      path: "/slug/:slug",
      method: "get",
      handler: async (req, res, next) => {
        const { slug } = req.params;

        try {
          const posts = await req.payload.find({
            collection: "posts",
            where: {
              slug: {
                equals: slug,
              },
            },
            limit: 1,
          });

          if (posts.docs.length === 0) {
            return res.status(404).json({ error: "Post not found" });
          }

          return res.json(posts.docs[0]);
        } catch (error) {
          return res.status(500).json({ error: "Internal server error" });
        }
      },
    },
  ],
};
