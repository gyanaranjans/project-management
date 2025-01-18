// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "project-management",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "ap-south-1"
        }
      }
    };
  },
  async run() {
    new sst.aws.Nextjs("MyWeb", {
      environment: {
        AUTH_SECRET: process.env.AUTH_SECRET!,
        DATABASE_URL: process.env.DATABASE_URL!,
        NEXTAUTH_SECRET: process.env.AUTH_SECRET!,
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "${site.url}"
      },
      runtime: "nodejs18.x",
      entries: [
        "src/app/api/trpc/[trpc]/route.ts",
        "src/app/api/auth/[...nextauth]/route.ts"
      ],
      waitForInvalidation: true,
      logging: "per-function",
      warm: 5
    });
  },
});
