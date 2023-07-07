import { Injectable, Logger } from '@nestjs/common';
import { ClusterDto, Deployment } from './common/dto';

import _ from 'lodash';
import os from 'os';

@Injectable()
export class AppService {
  private cluster: ClusterDto;
  private readonly logger = new Logger(AppService.name);

  private DisplayMode = {
    dev: 'Development Mode',
    prod: 'Production Mode',
  };

  async onModuleInit() {
    await this.getBackendInfo();
    this.logger.log(`Package name: ${this.cluster.name}`);
    this.logger.log(`Package version: ${this.cluster.version}`);
    this.logger.log(`Package description: ${this.cluster.description}`);
    this.logger.log(`Package author: ${this.cluster.author}`);
    this.logger.log(`Cluster name: ${this.cluster.hostname}`);
    this.logger.log(`Cluster mode: ${this.DisplayMode[this.cluster.mode]}`);
  }

  async getBackendInfo(): Promise<ClusterDto> {
    if (this.cluster) return this.cluster;

    const packageFile = await import('../package.json');
    const packageInfo = _.pick(
      packageFile,
      'name',
      'version',
      'description',
      'author',
    );

    const hostname = os.hostname();
    const mode = (process.env.NODE_ENV as Deployment) || 'prod';

    this.cluster = { ...packageInfo, hostname, mode };
  }
}
