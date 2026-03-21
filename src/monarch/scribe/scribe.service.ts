import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectChronicle } from './entities/chronicle.entity';
import { Project } from '../entities/project.entity';
import { CartographerService } from '../cartographer/cartographer.service';
import { AuditService } from '../../system/audit/audit.service';

@Injectable()
export class ScribeService {
  constructor(
    @InjectRepository(ProjectChronicle)
    private chronicleRepository: Repository<ProjectChronicle>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private cartographerService: CartographerService,
    private auditService: AuditService
  ) {}

  async generateChronicle(projectId: string, role: string = 'OVERSEER') {
    const project = await this.projectRepository.findOneBy({ id: projectId === 'HOUSE_OF_QUI_CORE' ? undefined : projectId });
    const projectName = projectId === 'HOUSE_OF_QUI_CORE' ? 'House of Qui' : (project?.name || 'Unknown Project');

    // 1. Get Code Graph
    const codeGraph = await this.cartographerService.getProjectCodeGraph(projectId, role);

    // 2. Generate Markdown Content
    let markdown = `# 📜 Imperial Chronicle: ${projectName}\n\n`;
    markdown += `**Project ID:** \`${projectId}\`\n`;
    markdown += `**Last Chronicled:** ${new Date().toLocaleString()}\n\n`;
    markdown += `## 🛠️ Technical Overview\n\n`;
    markdown += `The Imperial Scribe has identified ${codeGraph.nodes.length} primary modules within this project.\n\n`;
    
    markdown += `### 📦 Module Inventory\n\n`;
    codeGraph.nodes.forEach((node: any) => {
        markdown += `- **${node.label}**: source file detected.\n`;
    });

    // 3. Generate Mermaid Diagram
    let mermaid = `graph TD\n`;
    codeGraph.links.forEach((link: any) => {
        // Sanitize labels for mermaid
        const s = link.source.replace(/\//g, '_').replace(/\./g, '_');
        const t = link.target.replace(/\//g, '_').replace(/\./g, '_');
        mermaid += `  ${s} --> ${t}\n`;
    });

    if (codeGraph.links.length === 0) {
        mermaid += `  Root --> ${projectName.replace(/\s/g, '_')}\n`;
    }

    // 4. Save or Update Chronicle
    let chronicle = null;
    if (projectId === 'HOUSE_OF_QUI_CORE') {
        chronicle = await this.chronicleRepository.findOne({ where: { project: null as any } });
    } else {
        chronicle = await this.chronicleRepository.findOne({ where: { project: { id: projectId } } });
    }

    if (!chronicle) {
        chronicle = this.chronicleRepository.create({ 
            project: projectId === 'HOUSE_OF_QUI_CORE' ? null : { id: projectId } as any,
            content: markdown,
            diagram: mermaid,
            metadata: { nodeCount: codeGraph.nodes.length, linkCount: codeGraph.links.length }
        });
    } else {
        chronicle.content = markdown;
        chronicle.diagram = mermaid;
        chronicle.metadata = { nodeCount: codeGraph.nodes.length, linkCount: codeGraph.links.length };
    }

    const saved = await this.chronicleRepository.save(chronicle);

    await this.auditService.recordAction({
        action: 'CHRONICLE_GENERATED',
        actor: 'IMPERIAL_SCRIBE',
        targetId: projectId,
        metadata: { nodeCount: codeGraph.nodes.length },
        level: 'info'
    });

    return saved;
  }

  async getChronicle(projectId: string) {
      return this.chronicleRepository.findOne({
          where: { project: { id: projectId } },
          relations: ['project']
      });
  }

  async getAllChronicles() {
      return this.chronicleRepository.find({ relations: ['project'] });
  }
}
