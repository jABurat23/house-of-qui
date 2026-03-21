import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from "./system/bootstrap"

async function main() {
  await bootstrap()
}

main()