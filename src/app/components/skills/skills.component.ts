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
      title: 'Deep Learning & Foundation Models',
      subtitle: 'Custom architectures, fine-tuning (LoRA / PEFT) & evaluation',
      icon: 'brain',
      description: 'Designing custom deep neural network architectures in PyTorch, parameter-efficient fine-tuning (LoRA, QLoRA, PEFT) on open foundation models, attention mechanisms, loss formulation, model evaluation benchmarks, and scalable training pipelines.',
      skills: ['PyTorch', 'Fine-Tuning (LoRA / PEFT)', 'Custom Architectures', 'Transformers & Hugging Face', 'Model Evaluation & Benchmarking', 'Distributed Training (DDP)', 'Weights & Biases']
    },
    {
      title: 'Applied AI & Autonomous Agents',
      subtitle: 'Agent orchestration, hierarchical RAG, streaming voice & tool use',
      icon: 'bot',
      description: 'Architecting deterministic multi-agent workflows, structured function calling, sub-250ms streaming voice AI, hierarchical RAG with semantic reranking, and MCP tool protocols.',
      skills: ['LLM Orchestration', 'Multi-Agent Workflows', 'Streaming Voice AI (<250ms)', 'Hierarchical RAG', 'Vector Search & Embeddings', 'MCP Tool Protocol']
    },
    {
      title: 'Computer Vision & Multimodal AI',
      subtitle: 'Document intelligence, OCR pipelines, image & video models',
      icon: 'eye',
      description: 'Developing end-to-end visual document intelligence, text detection & recognition (OCR), table extraction, multimodal embeddings, frame interpolation, and deep visual representation learning.',
      skills: ['Computer Vision', 'Document Layout Analysis', 'OCR Pipelines', 'OpenCV', 'Multimodal Embeddings', 'Frame Interpolation', 'Image Enhancement']
    },
    {
      title: 'MLOps & Inference Infrastructure',
      subtitle: 'High-throughput serving, async APIs, local-first tooling',
      icon: 'terminal',
      description: 'Deploying low-latency inference microservices (vLLM, ONNX), async worker architectures, REST & WebSocket APIs, telemetry profiling, and robust local-first experiment tracking catalogs.',
      skills: ['Inference Serving (vLLM / ONNX)', 'FastAPI & Async Python', 'Docker & Containerization', 'PostgreSQL & ChromaDB', 'WebRTC & WebSockets', 'Telemetry & Profiling']
    }
  ];

  technologies = [
    'Python', 'PyTorch', 'Transformers', 'Hugging Face', 'vLLM', 'CUDA', 
    'FastAPI', 'Docker', 'PostgreSQL', 'ChromaDB', 'OpenCV', 'LangChain', 
    'ONNX', 'Linux', 'Weights & Biases', 'TypeScript', 'Node.js', 'WebSockets', 
    'WebRTC', 'Git', 'C++'
  ];
}

