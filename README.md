# 🚀 Programa de Optimización en Computación Cuántica

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-success)](https://carlosandp.github.io/Cronograma.github.io/)
[![Duración](https://img.shields.io/badge/Duración-4%20Meses-blue)]()
[![Nivel](https://img.shields.io/badge/Nivel-Avanzado-red)]()

## 📋 Descripción

Cronograma completo de estudio de **4 meses** para dominar los procesos de optimización en computación cuántica, diseñado específicamente para **ingenieros físicos** con dedicación de **4 horas semanales**.

### 🎯 Objetivos del Programa

- Dominar los fundamentos matemáticos y físicos de la computación cuántica
- Implementar algoritmos cuánticos de optimización (QAOA, VQE, Quantum Annealing)
- Desarrollar soluciones híbridas clásico-cuánticas para problemas industriales
- Evaluar la ventaja cuántica en aplicaciones reales

## 🌐 Acceso al Programa

### [📚 Ver Cronograma Completo](https://carlosandp.github.io/Cronograma.github.io/)

### Enlaces Rápidos:
- [📖 Cronograma Interactivo](https://carlosandp.github.io/Cronograma.github.io/index.html)
- [📊 Dashboard de Progreso](https://carlosandp.github.io/Cronograma.github.io/progress.html)
- [📚 Biblioteca de Recursos](https://carlosandp.github.io/Cronograma.github.io/resources.html)
- [💻 Notebooks de Código](https://github.com/Carlosandp/Cronograma.github.io/tree/main/notebooks)

## 📂 Estructura del Repositorio

```
Cronograma.github.io/
│
├── 📄 index.html              # Cronograma principal interactivo
├── 📊 progress.html           # Dashboard de seguimiento
├── 📚 resources.html          # Biblioteca de recursos y papers
├── 🎨 assets/
│   ├── css/
│   │   └── styles.css        # Estilos principales
│   ├── js/
│   │   ├── main.js          # Funcionalidad principal
│   │   └── progress.js      # Sistema de tracking
│   └── img/                 # Imágenes y diagramas
│
├── 📓 notebooks/             # Jupyter notebooks por semana
│   ├── mes1/
│   │   ├── semana1_lagrangiano.ipynb
│   │   ├── semana2_hamiltoniano.ipynb
│   │   ├── semana3_simetrias.ipynb
│   │   └── semana4_hilbert.ipynb
│   ├── mes2/
│   ├── mes3/
│   └── mes4/
│
├── 📑 docs/                  # Documentación adicional
│   ├── bibliografia.md       # Referencias completas
│   ├── proyectos.md         # Guías de proyectos
│   └── evaluacion.md        # Criterios de evaluación
│
└── 🔧 config/
    └── _config.yml          # Configuración GitHub Pages
```

## 🗓️ Estructura del Programa

### **Mes 1: Mecánica Analítica** 🎯
- Formulación Lagrangiana y Hamiltoniana
- Principios variacionales
- Simetrías y conservación
- Espacios de Hilbert

### **Mes 2: Mecánica Cuántica Computacional** 🔬
- Postulados y qubits
- Puertas cuánticas y circuitos
- Estados entrelazados
- Medición y decoherencia

### **Mes 3: Optimización y Estadística** 📊
- Optimización clásica (convexa/no convexa)
- Métodos estocásticos
- Monte Carlo y MCMC
- Machine Learning cuántico

### **Mes 4: Algoritmos Cuánticos** 🚀
- QAOA (Quantum Approximate Optimization Algorithm)
- VQE (Variational Quantum Eigensolver)
- Quantum Annealing
- Aplicaciones industriales

## 🛠️ Tecnologías y Herramientas

### Frameworks Principales
- **[Qiskit](https://qiskit.org/)** - IBM Quantum Framework
- **[PennyLane](https://pennylane.ai/)** - Quantum Machine Learning
- **[D-Wave Ocean](https://ocean.dwavesys.com/)** - Quantum Annealing
- **[Cirq](https://quantumai.google/cirq)** - Google Quantum AI

### Plataformas de Hardware
- **[IBM Quantum Experience](https://quantum-computing.ibm.com/)** - Acceso a hardware real
- **[D-Wave Leap](https://cloud.dwavesys.com/)** - Quantum annealing cloud
- **[Amazon Braket](https://aws.amazon.com/braket/)** - Multi-platform access

## 📚 Recursos Esenciales

### Libros de Texto
1. **Nielsen & Chuang** - [Quantum Computation and Quantum Information](http://mmrc.amss.cas.cn/tlb/201702/W020170224608149940643.pdf)
2. **Hidary** - [Quantum Computing: An Applied Approach](https://link.springer.com/book/10.1007/978-3-030-23922-0)
3. **Boyd & Vandenberghe** - [Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf)

### Papers Fundamentales
- Farhi et al. (2014) - [A Quantum Approximate Optimization Algorithm](https://arxiv.org/abs/1411.4028)
- Peruzzo et al. (2014) - [A variational eigenvalue solver](https://arxiv.org/abs/1304.3061)
- Preskill (2018) - [Quantum Computing in the NISQ era](https://arxiv.org/abs/1801.00862)
- Cerezo et al. (2021) - [Variational Quantum Algorithms](https://arxiv.org/abs/2012.09265)

## 💻 Instalación y Configuración

### Requisitos Previos
```bash
# Python 3.8 o superior
python --version

# Crear ambiente virtual
python -m venv quantum_env
source quantum_env/bin/activate  # Linux/Mac
# o
quantum_env\Scripts\activate  # Windows
```

### Instalación de Dependencias
```bash
# Clonar el repositorio
git clone https://github.com/Carlosandp/Cronograma.github.io.git
cd Cronograma.github.io

# Instalar dependencias
pip install -r requirements.txt
```

### requirements.txt
```txt
qiskit==0.45.0
qiskit-optimization==0.6.0
pennylane==0.33.0
dwave-ocean-sdk==6.4.0
cirq==1.3.0
numpy==1.24.0
scipy==1.11.0
matplotlib==3.7.0
jupyter==1.0.0
cvxpy==1.4.0
```

## 📊 Sistema de Evaluación

| Componente | Peso | Descripción |
|------------|------|-------------|
| **Proyectos Semanales** | 30% | Implementaciones prácticas |
| **Presentaciones** | 25% | 2 presentaciones grupales |
| **Proyecto Final** | 25% | Solución industrial completa |
| **Participación** | 20% | Trabajo colaborativo |

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Add: Nueva característica'`)
4. Push a la branch (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📧 Contacto

**Carlos A.** - [@carlosandp](https://github.com/Carlosandp)

Proyecto Link: [https://github.com/Carlosandp/Cronograma.github.io](https://github.com/Carlosandp/Cronograma.github.io)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🙏 Agradecimientos

- IBM Quantum Network
- Qiskit Community
- D-Wave Systems
- Google Quantum AI
- Microsoft Quantum

---

### ⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!

[![GitHub stars](https://img.shields.io/github/stars/Carlosandp/Cronograma.github.io?style=social)](https://github.com/Carlosandp/Cronograma.github.io)
