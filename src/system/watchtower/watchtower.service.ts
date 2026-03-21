import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertChannel } from './entities/channel.entity';
import { AuditService } from '../audit/audit.service';
import { TelemetryBroadcaster } from '../../modules/observatory/telemetryBroadcaster';
import { logger } from '../../core/logger';
import { IsaService } from '../security/isa.service';

@Injectable()
export class WatchtowerService implements OnModuleInit {
  constructor(
    @InjectRepository(AlertChannel)
    private channelRepository: Repository<AlertChannel>,
    private telemetryBroadcaster: TelemetryBroadcaster,
    private isaService: IsaService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultChannels();
  }

  private async seedDefaultChannels() {
      // Manual channel configuration required for production.
  }

  async triggerAlert(eventType: string, metadata: any) {
    logger.system(`Watchtower processing alert: ${eventType}`);

    const channels = await this.channelRepository.find({ where: { enabled: true } });
    
    for (const channel of channels) {
      if (channel.subscribedEvents.includes(eventType)) {
        await this.dispatchToChannel(channel, eventType, metadata);
      }
    }

    // Create Security Mandate
    const mandate = {
      eventType,
      metadata,
      timestamp: new Date().toISOString()
    };
    const signature = this.isaService.signMandate(mandate);

    // Broadcast to UI
    this.telemetryBroadcaster.broadcastAlert({
      ...mandate,
      signature,
      sealed: true
    });
  }

  private async dispatchToChannel(channel: AlertChannel, eventType: string, metadata: any) {
    logger.system(`Dispatching ${eventType} mandate to ${channel.name} (${channel.type})`);
    
    // In a real world, we would call axios.post(channel.endpoint, { ... })
    try {
        // Mocking the external call
        const payload = {
            embeds: [{
                title: `🏛️ Imperial Alert: ${eventType}`,
                description: JSON.stringify(metadata, null, 2),
                color: 15158332, // Red
                timestamp: new Date().toISOString()
            }]
        };
    } catch (err: any) {
        logger.error(`Watchtower failed to dispatch to ${channel.name}`, err);
    }
  }

  async getChannels() {
    return this.channelRepository.find();
  }

  async createChannel(data: Partial<AlertChannel>) {
    const channel = this.channelRepository.create(data);
    return this.channelRepository.save(channel);
  }
}
