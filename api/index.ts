import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "../src/app.module";

const server = express();
let appPromise: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  // taruh setting lain dari main.ts di sini (pipes, prefix, dll)
  // app.setGlobalPrefix('api');
  await app.init();
}

export default async function handler(req: any, res: any) {
  if (!appPromise) appPromise = bootstrap();
  await appPromise;
  return server(req, res);
}
