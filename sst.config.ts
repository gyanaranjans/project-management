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
        AUTH_SECRET: process.env.AUTH_SECRET ?? 'auth',
        DATABASE_URL: process.env.DATABASE_URL ?? 'gyana'

      }
    });
  },
});
