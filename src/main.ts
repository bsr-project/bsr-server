import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

// 请求成功拦截器
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
// 请求失败拦截器
import { HttpExceptionFilter } from '@/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 跨域
  app.enableCors()

  // 成功返回参数
  app.useGlobalInterceptors(new TransformInterceptor())

  // 失败返回参数
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(3000)
}

bootstrap()
