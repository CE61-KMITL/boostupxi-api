import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookClient, EmbedBuilder, Embed, EmbedData } from 'discord.js';

@Injectable()
export class DiscordService {
    private readonly webhookClient: WebhookClient;

    constructor(private configService: ConfigService) {
        this.webhookClient = new WebhookClient({url: this.configService.get<string>('discord.url')});
    }

    async sendMessage(message: string): Promise<void> {
        await this.webhookClient.send(message);
    }

    async sendEmbed(embedData: EmbedData): Promise<void> {
        const embed = new EmbedBuilder(embedData)
        await this.webhookClient.send({ 
            username: "Test",
             embeds: [embed] });
    }

}
