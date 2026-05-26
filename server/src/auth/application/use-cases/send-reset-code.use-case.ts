import { BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

export interface IMailService {
    sendResetCode(email: string, code: string): Promise<void>;
}

export class SendResetCodeUseCase {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly mailer: IMailService,
    ) { }

    async execute(email: string): Promise<void> {
        const user = await this.userRepo.findByEmail(email);

        if (!user) {
            return;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await this.userRepo.saveResetCode(email, code, expiresAt);
        await this.mailer.sendResetCode(email, code);
    }
}