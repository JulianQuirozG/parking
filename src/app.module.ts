import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ParkingsModule } from './parkings/parkings.module';
import { Parking } from './parkings/entities/parking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DBHOST,
      port: parseInt(process.env.DBPORT as string),
      username: process.env.DBUSER,
      password: process.env.DBPASSWORD,
      database: process.env.DBNAME,
      entities: [User, Parking],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ParkingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
