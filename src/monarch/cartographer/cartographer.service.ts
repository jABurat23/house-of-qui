import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ImperialEvent } from '../../modules/communication/entities/event.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CartographerService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ImperialEvent)
    private eventRepository: Repository<ImperialEvent>
  ) {}

  async getUniverseGraph(role: string = 'OPERATOR') {
    const projects = await this.projectRepository.find();
    
    // Always include the House of Qui (Core)
    const coreNode = {
      id: 'HOUSE_OF_QUI_CORE',
      label: '🏛️ House of Qui',
      type: 'core',
      requiredRole: 'OVERSEER',
      val: 20
    };

    const nodes = projects.map(p => ({
      id: p.id,
      label: p.name,
      type: p.isShadow ? 'shadow' : 'standard',
      requiredRole: p.requiredRole,
      val: 10
    }));

    nodes.unshift(coreNode);

    const edgeMap = new Map<string, number>();

    // Connect all projects to the core by default
    projects.forEach(p => {
        const key = `${p.id}->HOUSE_OF_QUI_CORE`;
        edgeMap.set(key, 1);
    });

    const events = await this.eventRepository.find({
      where: { targetType: 'direct' },
      order: { createdAt: 'DESC' },
      take: 500
    });

    events.forEach(event => {
      if (event.targetProjectId) {
        const key = `${event.sourceProjectId}->${event.targetProjectId}`;
        edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
      }
    });

    const links = Array.from(edgeMap.entries()).map(([key, value]) => {
      const [source, target] = key.split('->');
      return { source, target, weight: value };
    });

    return { nodes, links };
  }

  async getProjectCodeGraph(projectId: string, role: string) {
    // Permission check
    let requiredRole = 'OPERATOR';
    if (projectId === 'HOUSE_OF_QUI_CORE') {
        requiredRole = 'OVERSEER';
    } else {
        const project = await this.projectRepository.findOneBy({ id: projectId });
        if (project) requiredRole = project.requiredRole;
    }

    if (!this.checkRole(role, requiredRole)) {
        throw new ForbiddenException(`Insufficient Imperial Mandate. Required: ${requiredRole}`);
    }

    // Scan source code
    // For "House of Qui", we scan the current src directory
    // For others, we mock it for now
    if (projectId === 'HOUSE_OF_QUI_CORE') {
        return this.scanDirectory(path.join(process.cwd(), 'src'));
    }

    return this.noCodeGraph(projectId);
  }

  private checkRole(userRole: string, requiredRole: string): boolean {
    const hierarchy = ['VISITOR', 'OPERATOR', 'ARCHIVIST', 'OVERSEER'];
    return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
  }

  private scanDirectory(dir: string, baseDir: string = dir): any {
    const nodes: any[] = [];
    const links: any[] = [];

    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(baseDir, fullPath);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !fullPath.includes('node_modules')) {
        const sub = this.scanDirectory(fullPath, baseDir);
        nodes.push(...sub.nodes);
        links.push(...sub.links);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        nodes.push({
          id: relativePath,
          label: file,
          type: 'source_file',
          fullPath: fullPath,
          content: fs.readFileSync(fullPath, 'utf8').substring(0, 500) + '...' // excerpt
        });

        // Simple relationship discovery: look for imports of other local files
        const content = fs.readFileSync(fullPath, 'utf8');
        const importMatches = content.match(/from\s+['"]\.\.?\/([^'"]+)['"]/g);
        if (importMatches) {
            importMatches.forEach(match => {
                const imported = match.split(/['"]/)[1];
                // Resolve relative path roughly
                links.push({
                    source: relativePath,
                    target: imported, // This is a rough match
                    type: 'import'
                });
            });
        }
      }
    });

    return { nodes, links };
  }

  private noCodeGraph(projectId: string) {
      return {
          nodes: [],
          links: [],
          message: `Source graph not available for external project: ${projectId}`
      };
  }

  async getFileContent(filePath: string) {
      if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, 'utf8');
      }
      return 'File not found in archive.';
  }
}
