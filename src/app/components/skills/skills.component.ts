import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styles: ['invert  { filter: invert(1) }']
})
export class SkillsComponent {

  frontends = [
    { name: 'Angular', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/angular/angular-original.svg', isInvertLogo: false },
    { name: 'HTML', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/html5/html5-original.svg', isInvertLogo: false },
    { name: 'CSS', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/css3/css3-original.svg', isInvertLogo: false },
    { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/javascript/javascript-original.svg', isInvertLogo: false },
    { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/typescript/typescript-original.svg', isInvertLogo: false },
    { name: 'Tailwind', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/tailwindcss/tailwindcss-original.svg', isInvertLogo: false },
    { name: 'React', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/react/react-original.svg', isInvertLogo: false },
    { name: 'streamlit', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/streamlit/streamlit-original.svg', isInvertLogo: false },
    { name: 'Shadcn', logo: 'https://avatars.githubusercontent.com/u/139895814?v=4', isInvertLogo: false }
  ];

  backends = [
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/python/python-original.svg', isInvertLogo: false },
    { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/nodejs/nodejs-original.svg', isInvertLogo: false },
    { name: 'Express.js', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/express/express-original.svg', isInvertLogo: true },
    { name: 'Flask', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/flask/flask-original.svg', isInvertLogo: true },
    { name: 'fastAPI', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/fastapi/fastapi-original.svg', isInvertLogo: true },
    { name: 'Jquery', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/jquery/jquery-original.svg', isInvertLogo: false },
    { name: 'vite', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/vitejs/vitejs-original.svg', isInvertLogo: false },
  ];

  databases = [
    { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/mongodb/mongodb-original.svg', isInvertLogo: false },
    { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/postgresql/postgresql-original.svg', isInvertLogo: false },
    { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/mysql/mysql-original.svg', isInvertLogo: false },
    { name: 'SQLite', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/sqlite/sqlite-original.svg', isInvertLogo: false },
    { name: 'ChromaDB', logo: 'https://www.trychroma.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fchroma.d840f629.png&w=1920&q=75&dpl=dpl_63vj3ekNm3DAErsqegA9kwZkPzAT', isInvertLogo: false }
  ];

  opss = [
    { name: 'Git', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/git/git-original.svg', isInvertLogo: false },
    { name: 'Vercel', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/vercel/vercel-original.svg', isInvertLogo: true },
    { name: 'Netlify', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/netlify/netlify-original.svg', isInvertLogo: false },
    { name: 'Weight & Bias', logo: 'https://wandb.ai/logo.png', isInvertLogo: false }
  ];

  ais = [
    { name: 'c++', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/cplusplus/cplusplus-original.svg', isInvertLogo: false },
    { name: 'Tensorflow', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/tensorflow/tensorflow-original.svg', isInvertLogo: false },
    { name: 'Pytorch', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/pytorch/pytorch-original.svg', isInvertLogo: false },
    { name: 'Keras', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/keras/keras-original.svg', isInvertLogo: false },
    { name: 'OpenCV', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/opencv/opencv-original.svg', isInvertLogo: false },
    { name: 'Scikit-learn', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg', isInvertLogo: false },
    { name: 'Pandas', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/pandas/pandas-original.svg', isInvertLogo: false },
    { name: 'NumPy', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/numpy/numpy-original.svg', isInvertLogo: false },
  ];
}
