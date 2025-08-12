// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { SharpDependency } from "payload";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " - Opportunity Cost",
    },
    css: path.resolve(dirname, "../app/(payload)/custom.scss"),
  },
  collections: [Users, Media, Posts, Categories, Tags],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Add additional lexical features here if needed
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp: sharp as SharpDependency,
  upload: {
    limits: {
      fileSize: 50000000, // 50MB
    },
    defCharset: "utf8",
    defParamCharset: "utf8",
    preservePath: true,
  },
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  cors: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  onInit: async (payload) => {
    // Initialize default categories and tags if they don't exist
    try {
      const categoriesCount = await payload.count({
        collection: "categories",
      });

      if (categoriesCount.totalDocs === 0) {
        await payload.create({
          collection: "categories",
          data: {
            name: "General",
            slug: "general",
            description: "General blog posts",
          },
        });

        await payload.create({
          collection: "categories",
          data: {
            name: "Technology",
            slug: "technology",
            description: "Technology-related posts",
          },
        });

        await payload.create({
          collection: "categories",
          data: {
            name: "Bitcoin",
            slug: "bitcoin",
            description: "Bitcoin and cryptocurrency posts",
          },
        });
      }

      const tagsCount = await payload.count({
        collection: "tags",
      });

      if (tagsCount.totalDocs === 0) {
        const defaultTags = [
          "opportunity cost",
          "bitcoin",
          "investing",
          "technology",
          "web development",
          "cryptocurrency",
          "finance",
          "economics",
        ];

        for (const tagName of defaultTags) {
          await payload.create({
            collection: "tags",
            data: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, "-"),
            },
          });
        }
      }

      console.log("Payload CMS initialized successfully");
    } catch (error) {
      console.error("Error initializing Payload CMS:", error);
    }
  },
});
