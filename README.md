# ✈️ SkyWings Academy - Flight School Student Record Management System

[![GitHub Spark](https://img.shields.io/badge/Built%20with-GitHub%20Spark-blue.svg)](https://spark.github.com)
[![Coded by](https://img.shields.io/badge/Coded%20by-GitHub%20Copilot-purple.svg)](https://github.com/features/copilot)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A.svg?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A secure, role-aware web application enabling flight school stakeholders to manage training progress, lesson records, endorsements, and regulatory compliance while improving transparency and operational efficiency.

## 🌟 Features

### 🔐 **Role-Based Authentication**
- **Student Dashboard**: Track personal progress and view lessons
- **Instructor Dashboard**: Manage students, record lessons, and issue endorsements  
- **Admin Dashboard**: Oversee all operations and user management

### 📚 **Training Management**
- **Student Profiles**: Comprehensive student information with training objectives
- **Lesson Recording**: Detailed flight and ground lesson documentation
- **Progress Tracking**: Visual progress indicators and milestone tracking
- **Endorsement System**: Digital endorsements with tamper-proof validation

### 📊 **Compliance & Reporting**
- **Regulatory Compliance**: Maintain FAA-required training records
- **Audit Trail**: Complete logging of all critical actions
- **Progress Reports**: Visual dashboards for training advancement

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jspoelstra/flight-school-studen.git
   cd flight-school-studen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5001` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS4
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Phosphor Icons & Lucide React
- **Charts**: Recharts
- **State Management**: React Context + React Query
- **Development**: GitHub Spark framework

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Role-specific dashboards
│   ├── lessons/        # Lesson management
│   ├── endorsements/   # Endorsement system
│   ├── layout/         # App layout components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── styles/             # Global styles and themes
```

## 🤝 Contributing

We welcome contributions to improve the Flight School Student Record Management System!

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and commit them
   ```bash
   git commit -m "Add your descriptive commit message"
   ```
5. **Push to your fork** and create a Pull Request

### Development Guidelines

- Follow the existing code style and TypeScript conventions
- Ensure your code builds without errors: `npm run build`
- Test your changes thoroughly in the browser
- Update documentation if needed
- Keep commits focused and atomic

### Code Style

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Tailwind CSS classes for styling
- Maintain consistent naming conventions

## 🏫 User Roles

| Role | Permissions |
|------|-------------|
| **Student** | View personal progress, lessons, and endorsements |
| **Instructor** | Manage assigned students, record lessons, issue endorsements |
| **Admin** | Full system access, user management, reports |

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Built with [GitHub Spark](https://spark.github.com)** - The AI-powered app development platform
- **Coded by [GitHub Copilot](https://github.com/features/copilot)** - AI pair programmer assistance
- Icons provided by [Phosphor Icons](https://phosphoricons.com/) and [Lucide](https://lucide.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)

## 📞 Support

For questions, issues, or suggestions:

- 📧 Create an issue in this repository
- 💬 Join the discussions in the GitHub Discussions tab
- 🐛 Report bugs through GitHub Issues

---

**SkyWings Academy** - Empowering the next generation of aviators through efficient training management and regulatory compliance.