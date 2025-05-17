import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Local Codebase Search Engine',
      description: [
        'Created a local code search engine to navigate large codebases efficiently without relying on external tools or services.',
        'Wrote a custom OS-level file crawler with support for regex and semantic chunking to break code into meaningful segments.',
        'Used MiniLM embeddings with ChromaDB to implement fast, vector-based code similarity search.',
        'Added language-aware static analysis using tree parsing to improve search accuracy with symbol recognition and context-aware results.'
      ],
      techStack: ['React', 'Flask', 'ChromDB', 'Python'],
      image: '/assets/codequery.png',
      aosImage: 'fade-right',
      demoLink: null ,
      githubLink: 'https://github.com/Mohking1/Code-Query'
    },
    {
      title: 'Local ML Experiment Tracker',
      description: [
        'Built a full-stack, offline ML experiment tracker like ML FLow to log, visualize, and compare training metrics, configurations, and results.',
        'Developed a RESTful Node.js API for handling versioned uploads, metadata storage, and log processing, with a React dashboard using Recharts for real-time visualization.',
        'Created a custom Python SDK for logging directly from script and CLI automatically without manual adding.',
        'Implemented backend logic for config comparisons, metric aggregation, and automatic plot handling (Matplotlib/CSV/JSON), storing data in MongoDB and on local disk.'
      ],
      techStack: ['Node.js', 'Python', 'MongoDB', 'Recharts', 'React','tailwind CSS', 'typescript','vite' , 'express'],
      image: '/assets/experiment.png',
      aosImage: 'fade-left',
      demoLink: null,
      githubLink: null
    },
    {
      title: 'Billing and Inventory Management System',
      description: [
        'Developed a complete billing and inventory system with features like product cataloging, discount rules, stock management, and invoice generation.',
        'Deployed at a local retail store and used daily for handling sales, inventory updates, and reports.',
        'Built real-time inventory sync and role-based access (admin/cashier), with modular components for managing products,customers, and sales data.',
        'Integrated thermal receipt printing and barcode generation from the UI to work smoothly with standard retail hardware.'
      ],
      techStack: ['Node.js', 'Express', 'MongoDB', 'React', 'Tailwind CSS', 'javascript', 'shadcn-ui', 'vite'],
      image: '/assets/billing.png',
      aosImage: 'fade-right',
      demoLink: null,
      githubLink: null
    },
    {
      title: 'End to End OCR Pipeline',
      description: [
        'Integrates CRAFT for precise text detection and CRNN for accurate text recognition, enabling comprehensive scene text extraction.',
        'Achieves inference times as low as 60ms per image using PyTorch, making it suitable for applications requiring quick processing .',
        'Employs CRAFT\'s character-level detection to effectively identify text in complex layouts, including curved and multi-oriented text .',
        'Outputs results in structured JSON format, detailing bounding box coordinates and recognized text, facilitating seamless integration into various applications.'
      ],
      techStack: ['Pyhton', 'Pytorch', 'OpenCV', 'torchvision', 'pillow'],
      image: '/assets/ocr.webp',
      aosImage: 'fade-left',
      demoLink: null,
      githubLink: 'https://github.com/Mohking1/CRAFT-CRNN-OCR'
    }
  ];
}
