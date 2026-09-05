import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html'
})
export class SkillsComponent {
  capabilities = [
    {
      title: 'ML Systems',
      subtitle: 'Reinforcement learning, model training, experimentation',
      icon: 'brain',
      description: 'Developing custom RL environments, policy optimization (PPO/SAC), reward shaping, physics simulations, and reproducible experiment tracking pipelines.',
      skills: ['Reinforcement Learning', 'PyTorch', 'Gymnasium', 'Box2D Physics', 'PPO / SAC', 'W&B', 'Hyperparameter Tuning']
    },
    {
      title: 'AI Applications',
      subtitle: 'Agents, retrieval, multimodal workflows, automation',
      icon: 'bot',
      description: 'Architecting multi-agent workflows, real-time voice streaming agents (<250ms latency), MCP servers, hierarchical RAG, and document intelligence pipelines.',
      skills: ['AI Agents & Tool Use', 'MCP Protocol', 'Streaming Voice AI', 'Hierarchical RAG', 'Vector DBs', 'Multimodal Pipelines']
    },
    {
      title: 'Computer Vision',
      subtitle: 'OCR, document intelligence, image processing',
      icon: 'eye',
      description: 'Building end-to-end text detection and recognition pipelines, complex layout parsing, table extraction, frame interpolation, and super-resolution models.',
      skills: ['CRAFT & CRNN', 'Document Layout OCR', 'OpenCV', 'Table Detection', 'Frame Interpolation', 'Image Enhancement']
    },
    {
      title: 'Engineering',
      subtitle: 'Python, APIs, backend systems, ML tooling',
      icon: 'terminal',
      description: 'Designing low-latency inference microservices, async worker architectures, REST/WebSocket APIs, CLI developer tools, and scalable ML platform infrastructure.',
      skills: ['Python', 'FastAPI & Flask', 'Node.js & Express', 'WebRTC & WebSockets', 'PostgreSQL & ChromaDB', 'Docker & Git']
    }
  ];

  technologies = [
    'Python', 'PyTorch', 'C++', 'Gymnasium', 'Box2D', 'OpenCV', 'FastAPI', 'Flask', 
    'ChromaDB', 'PostgreSQL', 'MongoDB', 'Node.js', 'TypeScript', 'WebSockets', 'WebRTC', 
    'FFmpeg', 'Docker', 'Git', 'Weights & Biases', 'LangChain'
  ];
}

