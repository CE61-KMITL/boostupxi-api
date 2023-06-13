import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookClient, EmbedBuilder, EmbedData } from 'discord.js';

@Injectable()
export class DiscordService {
  private readonly webhookClient: WebhookClient;

  constructor(private configService: ConfigService) {
    this.webhookClient = new WebhookClient({
      url: this.configService.get<string>('discord.url'),
    });
  }

  async sendEmbed(embedData: EmbedData): Promise<void> {
    await this.webhookClient.send({
      username: this.configService.get<string>('discord.username'),
      embeds: [new EmbedBuilder(embedData)],
    });
  }
}
