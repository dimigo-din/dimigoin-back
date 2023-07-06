import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { NTAppModule } from '@danieluhm2004/nestjs-tools';

ConfigModule.forRoot();

@Module({
  imports: [
    NTAppModule,
    //MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
