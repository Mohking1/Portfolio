import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html'
})
export class ExperienceComponent {
  experiences = [
    {
      role: 'AI Engineer Intern',
      company: 'Avinashi AI (Avinashi Group of Companies)',
      companyUrl: 'https://www.avinashi.ai/',
      period: 'Aug 2025 – Jan 2026',
      location: 'Surat, Gujarat',
      type: 'Internship',
      points: [
        'Built a bidirectional voice agent for live PSTN calls with streaming STT → LLM → TTS, 20 ms audio chunks, WebRTC/WebSockets and interruption handling, achieving sub-250 ms measured response latency.',
        'Designed a document retrieval pipeline using hierarchical semantic chunking, vector retrieval, lexical search and reranking for dense business documents.',
        'Built a financial document intelligence pipeline combining layout and table detection, preprocessing, OCR and structured post-processing for scanned statements, invoices and receipts.',
        'Designed a shared AI platform around authentication, organization-level access, quotas, storage and an API gateway for multiple AI services.'
      ],
      tags: ['Voice AI', 'WebRTC', 'RAG / Retrieval', 'Document Intelligence', 'OCR', 'API Gateway']
    },
    {
      role: 'AI/ML Intern',
      company: 'Seepossible Innovative Solutions LLP',
      companyUrl: 'https://www.seepossible.com/',
      period: 'Jun 2024',
      location: 'Surat, Gujarat',
      type: 'Internship',
      points: [
        'Built an internal image-upscaling API with configurable inference parameters and authentication, intended for reuse as an AI microservice.',
        'Adapted a frame-interpolation workflow for jewelry rendering, allowing roughly half the frames to be rendered directly and reducing rendering/processing time by about 50%.'
      ],
      tags: ['Computer Vision', 'Microservices', 'Frame Interpolation', 'FastAPI', 'PyTorch']
    }
  ];

  beyondAi = {
    title: 'Demonictl — Community Novel Platform',
    role: 'Co-creator & Platform Engineering',
    period: '~2 Years',
    highlight: '500K+ Documented Views',
    description: 'Helped build and operate a public novel-translation platform that accumulated 500K+ documented views across published titles over roughly two years (verified via Wayback Machine archive records).'
  };
}


