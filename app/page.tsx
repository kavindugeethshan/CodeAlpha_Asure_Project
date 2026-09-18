'use client'

import React, { useState } from 'react'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  CheckCircle2,
  Cloud,
  Code2,
  Container,
  Copy,
  Cpu,
  ExternalLink,
  GitBranch,
  Layers,
  Play,
  Server,
  ShieldCheck,
  Terminal,
  Zap
} from 'lucide-react'

const pipelineStages = [
  {
    id: 'code',
    label: 'Code & Commit',
    time: '0.4s',
    icon: Code2,
    tag: 'Next.js 16',
    title: 'Source Control & Developer Push',
    description:
      'Developers commit changes to GitHub/Azure Repos. Branch protection rules ensure pull requests are validated before merging into main.',
    checklist: [
      'ESLint & TypeScript static checking',
      'Automated pull request validation',
      'Encrypted secrets injection via Azure Key Vault'
    ],
    codeSnippet: `# .github/workflows/deploy.yml or azure-pipelines.yml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'`
  },
  {
    id: 'ci',
    label: 'Azure Pipelines',
    time: '24s',
    icon: GitBranch,
    tag: 'CI Engine',
    title: 'Automated CI Build & Test',
    description:
      'Azure DevOps hosted agent spins up an ephemeral environment, runs automated test suites, and prepares artifacts.',
    checklist: [
      'Node.js 20/22 runtime environment provisioned',
      'Automated unit tests & integration checks',
      'Zero downtime pipeline scheduling'
    ],
    codeSnippet: `- task: NodeTool@0
  inputs:
    versionSpec: '20.x'
- script: |
    npm ci
    npm run build
  displayName: 'Build Next.js Production Bundle'`
  },
  {
    id: 'docker',
    label: 'Docker Build',
    time: '32s',
    icon: Container,
    tag: 'Container',
    title: 'Multi-Stage Docker Packaging',
    description:
      'Creates a lightweight, secure production container image using Docker multi-stage builds to optimize image size and performance.',
    checklist: [
      'Multi-stage build for minimal container footprint',
      'Non-root user configuration for security hardening',
      'Asset caching for ultra-fast incremental builds'
    ],
    codeSnippet: `FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
EXPOSE 3000
CMD ["node", "server.js"]`
  },
  {
    id: 'acr',
    label: 'Azure Registry (ACR)',
    time: '18s',
    icon: Box,
    tag: 'ACR Storage',
    title: 'Secure Container Registry Push',
    description:
      'Pushes the immutable Docker image to a private Azure Container Registry with vulnerability scanning and role-based access control.',
    checklist: [
      'Private enterprise registry with Azure AD authentication',
      'Defender for Cloud automatic vulnerability scan',
      'Semantic tagging (v1.0.0 & commit SHA)'
    ],
    codeSnippet: `- task: Docker@2
  displayName: 'Push to Azure Container Registry'
  inputs:
    containerRegistry: 'AzureACRServiceConnection'
    repository: 'azureflow-app'
    command: 'push'
    tags: |
      $(Build.BuildId)
      latest`
  },
  {
    id: 'appservice',
    label: 'App Service Deploy',
    time: '28s',
    icon: Server,
    tag: 'Cloud Host',
    title: 'Azure App Service Container Runtime',
    description:
      'Azure App Service pulls the new container image from ACR and orchestrates a zero-downtime deployment switch.',
    checklist: [
      'Zero-downtime deployment deployment slot swap',
      'Auto-scaling based on CPU & Memory metrics',
      'Managed TLS/SSL certificate & custom domain'
    ],
    codeSnippet: `- task: AzureWebAppContainer@1
  inputs:
    azureSubscription: 'Azure-Production-Subscription'
    appName: 'azureflow-prod-app'
    imageName: '$(acrLoginServer)/azureflow-app:$(Build.BuildId)'`
  },
  {
    id: 'live',
    label: 'Production Live',
    time: 'Instant',
    icon: Cloud,
    tag: 'Live URL',
    title: 'Global Delivery & Live Monitoring',
    description:
      'Your application is served globally to end users with continuous health checks and Application Insights telemetry.',
    checklist: [
      '99.99% Availability backed by Azure SLA',
      'Application Insights real-time telemetry',
      'Automatic failover & automated alerts'
    ],
    codeSnippet: `# Response from Azure Health Endpoint
GET https://azureflow-prod.azurewebsites.net/api/health
Status: 200 OK
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": "99.99%",
  "region": "East US"
}`
  }
]

const technologies = [
  {
    name: 'Next.js & React 19',
    category: 'Frontend Framework',
    detail: 'Modern React server components, Turbopack bundling, and blazing fast routing.',
    badge: 'v16.3',
    icon: Code2
  },
  {
    name: 'Docker Containers',
    category: 'Containerization',
    detail: 'Reproducible, isolated runtime packaging ensuring identical behavior from dev to cloud.',
    badge: 'Alpine Linux',
    icon: Container
  },
  {
    name: 'Azure Pipelines',
    category: 'CI/CD Automation',
    detail: 'Declarative YAML pipelines that test, build, and orchestrate releases on every git push.',
    badge: 'DevOps',
    icon: GitBranch
  },
  {
    name: 'Azure Container Registry',
    category: 'Private Registry',
    detail: 'Enterprise-grade private Docker registry with Geo-replication and security scans.',
    badge: 'ACR',
    icon: Box
  },
  {
    name: 'Azure App Service',
    category: 'Cloud Runtime',
    detail: 'Fully managed platform for web applications with auto-scaling and zero-downtime swaps.',
    badge: 'PaaS',
    icon: Server
  },
  {
    name: 'Tailwind CSS 4',
    category: 'Modern Styling',
    detail: 'Next-generation utility-first styling for a clean, light, and hyper-responsive UI.',
    badge: 'v4.3',
    icon: Layers
  }
]

const deploymentSpecs = [
  { key: 'Deployment Status', value: 'Healthy & Running', isStatus: true },
  { key: 'Cloud Provider', value: 'Microsoft Azure' },
  { key: 'Compute Service', value: 'Azure App Service (Linux)' },
  { key: 'Container Image', value: 'azureflow.azurecr.io/web:v1.0.0' },
  { key: 'Registry Tier', value: 'Azure Container Registry (Premium)' },
  { key: 'Deployment Strategy', value: 'Zero-downtime Slot Swap' },
  { key: 'Target Region', value: 'East US 2 (Virginia)' },
  { key: 'SSL / Security', value: 'Enforced TLS 1.3 / HTTPS' },
  { key: 'Health Probe', value: 'HTTP 200 (/api/health)' }
]

export default function Page() {
  const [activeStage, setActiveStage] = useState(0)
  const [copied, setCopied] = useState(false)
  const [deployTriggered, setDeployTriggered] = useState(false)

  const copyCommand = () => {
    navigator.clipboard.writeText('git push origin main')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const triggerSimulatedDeploy = () => {
    setDeployTriggered(true)
    let stage = 0
    const interval = setInterval(() => {
      stage += 1
      if (stage < pipelineStages.length) {
        setActiveStage(stage)
      } else {
        clearInterval(interval)
        setTimeout(() => setDeployTriggered(false), 2500)
      }
    }, 800)
  }

  const currentStage = pipelineStages[activeStage]
  const StageIcon = currentStage.icon

  return (
    <main>
      {/* Sticky Frosted Glass Navigation */}
      <header className="nav-wrapper">
        <div className="container">
          <nav className="nav" aria-label="Main navigation">
            <a href="#top" className="brand" aria-label="AzureFlow Home">
              <div className="brand-icon-box">
                <Cloud size={20} />
              </div>
              <span>
                Azure<span className="brand-accent">Flow</span>
              </span>
            </a>

            <div className="nav-links">
              <a href="#workflow" className="nav-item">Pipeline Flow</a>
              <a href="#stack" className="nav-item">Architecture</a>
              <a href="#deployment" className="nav-item">Cloud Specs</a>
              <a href="#quickstart" className="nav-item">Quick Start</a>
            </div>

            <div className="nav-actions">
              <div className="status-badge">
                <span className="pulse-dot" />
                <span>Production Live</span>
              </div>
              <a
                href="#workflow"
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Explore Flow <ArrowRight size={14} />
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container">
        <section id="top" className="hero-section">
          <div>
            <div className="hero-pill">
              <Zap size={14} /> Automated CI/CD with Azure DevOps & App Service
            </div>
            <h1 className="hero-title">
              Ship with confidence.<br />
              <span className="hero-title-gradient">Deploy on Azure.</span>
            </h1>
            <p className="hero-description">
              A clean, modern reference architecture demonstrating end-to-end continuous deployment.
              From your local git push through Azure Pipelines, Docker build, ACR private registry,
              and live Azure App Service.
            </p>

            <div className="hero-buttons">
              <button
                onClick={triggerSimulatedDeploy}
                className="btn-primary"
                disabled={deployTriggered}
              >
                {deployTriggered ? (
                  <>
                    <Activity className="animate-spin" size={16} /> Deploying Pipeline...
                  </>
                ) : (
                  <>
                    <Play size={16} /> Run Pipeline Demo
                  </>
                )}
              </button>
              <a href="#workflow" className="btn-secondary">
                Inspect Workflow <ArrowDownRightIcon />
              </a>
            </div>
          </div>

          {/* Hero Live Pipeline Visualizer */}
          <div className="hero-card">
            <div className="hero-card-header">
              <div className="mac-dots">
                <span className="mac-dot mac-dot-red" />
                <span className="mac-dot mac-dot-yellow" />
                <span className="mac-dot mac-dot-green" />
              </div>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: '#64748b',
                  fontWeight: 600
                }}
              >
                Azure Pipelines • Build #1042
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#059669',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600
                }}
              >
                <CheckCircle2 size={13} /> Passing
              </div>
            </div>

            <div className="hero-card-body">
              <div className="pipeline-live-stream">
                <div className="stream-step active">
                  <div className="step-info">
                    <CheckCircle2 size={16} color="#0078d4" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px' }}>
                        Lint & Unit Tests
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        TypeScript 5.7 & ESLint 9
                      </span>
                    </div>
                  </div>
                  <span className="step-badge">14.2s</span>
                </div>

                <div className="stream-step active">
                  <div className="step-info">
                    <CheckCircle2 size={16} color="#0078d4" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px' }}>
                        Docker Multi-stage Build
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        alpine:3.19 node-standalone
                      </span>
                    </div>
                  </div>
                  <span className="step-badge">31.8s</span>
                </div>

                <div className="stream-step active">
                  <div className="step-info">
                    <CheckCircle2 size={16} color="#0078d4" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px' }}>
                        Push to Azure Container Registry
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        azureflow.azurecr.io/web:latest
                      </span>
                    </div>
                  </div>
                  <span className="step-badge">18.5s</span>
                </div>

                <div className="stream-step active">
                  <div className="step-info">
                    <CheckCircle2 size={16} color="#0078d4" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px' }}>
                        Release to Azure App Service
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Zero-downtime swap verified
                      </span>
                    </div>
                  </div>
                  <span className="step-badge">24.1s</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#10b981" /> Container Security Scan
                </span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>0 Vulnerabilities</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Ribbon */}
        <section className="stats-ribbon">
          <div className="stat-box">
            <div className="stat-label">Pipeline Duration</div>
            <div className="stat-value">1m 24s</div>
            <div className="stat-sub">
              <Zap size={14} color="#0078d4" /> 40% faster with Turbopack
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Uptime SLA</div>
            <div className="stat-value">99.99%</div>
            <div className="stat-sub">
              <CheckCircle2 size={14} color="#10b981" /> Azure App Service
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Image Footprint</div>
            <div className="stat-value">84.2 MB</div>
            <div className="stat-sub">
              <Container size={14} color="#6366f1" /> Alpine Multi-stage
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Deploy Strategy</div>
            <div className="stat-value">Zero Downtime</div>
            <div className="stat-sub">
              <Activity size={14} color="#10b981" /> Auto health validation
            </div>
          </div>
        </section>

        {/* Workflow Section with Interactive Stage Explorer */}
        <section id="workflow" className="section">
          <div className="section-header">
            <span className="section-badge">01 / The Pipeline Flow</span>
            <h2 className="section-title">From Local Commit to Cloud</h2>
            <p className="section-subtitle">
              Click on any stage below to inspect the exact execution logs, scripts, and Azure cloud
              services involved.
            </p>
          </div>

          <div className="pipeline-flow-container">
            {/* Stepper Buttons */}
            <div className="pipeline-stepper">
              {pipelineStages.map((stage, idx) => {
                const Icon = stage.icon
                const isActive = activeStage === idx
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(idx)}
                    className={`stage-btn ${isActive ? 'active' : ''}`}
                    type="button"
                  >
                    <div className="stage-icon-circle">
                      <Icon size={22} />
                    </div>
                    <span className="stage-name">{stage.label}</span>
                    <span className="stage-time">{stage.time}</span>
                  </button>
                )
              })}
            </div>

            {/* Active Stage Details */}
            <div className="stage-detail-box">
              <div className="stage-detail-content">
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#0078d4',
                    background: '#e0f2fe',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }}
                >
                  Step {activeStage + 1} of {pipelineStages.length} • {currentStage.tag}
                </span>
                <h3>
                  <StageIcon size={22} color="#0078d4" />
                  {currentStage.title}
                </h3>
                <p>{currentStage.description}</p>

                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#475569',
                    marginBottom: '12px'
                  }}
                >
                  Key Verifications:
                </h4>
                <ul className="checklist">
                  {currentStage.checklist.map((item, i) => (
                    <li key={i}>
                      <CheckCircle2 className="checklist-icon" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Snippet */}
              <div className="stage-code-card">
                <div className="code-header">
                  <span>Configuration / Log Preview</span>
                  <span>YAML / Docker</span>
                </div>
                <pre className="code-pre">
                  <code>{currentStage.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Stack & Architecture Section */}
        <section id="stack" className="section">
          <div className="section-header">
            <span className="section-badge">02 / Cloud Architecture</span>
            <h2 className="section-title">Built on Enterprise Standards</h2>
            <p className="section-subtitle">
              Every layer of AzureFlow is built using modern cloud native technologies designed for
              reliability and scale.
            </p>
          </div>

          <div className="tech-grid-modern">
            {technologies.map((tech) => {
              const Icon = tech.icon
              return (
                <article key={tech.name} className="tech-card-modern">
                  <div>
                    <div className="tech-card-top">
                      <div className="tech-icon-wrapper">
                        <Icon size={22} />
                      </div>
                      <span className="tech-badge">{tech.badge}</span>
                    </div>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#0078d4',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {tech.category}
                    </span>
                    <h3>{tech.name}</h3>
                    <p>{tech.detail}</p>
                  </div>
                  <div className="tech-card-footer">
                    <span>Azure Certified</span>
                    <ArrowUpRight size={16} />
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Cloud Specifications & Deployment Section */}
        <section id="deployment" className="section">
          <div className="section-header">
            <span className="section-badge">03 / Production Specs</span>
            <h2 className="section-title">Verified Cloud Environment</h2>
            <p className="section-subtitle">
              Continuous delivery configuration running actively on Microsoft Azure.
            </p>
          </div>

          <div className="deploy-overview-panel">
            <div className="deploy-overview-left">
              <div>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#0078d4',
                    letterSpacing: '0.1em'
                  }}
                >
                  INFRASTRUCTURE OVERVIEW
                </span>
                <h2>Predictable, Scalable, Frictionless.</h2>
                <p>
                  When code is pushed to the repository, Azure Pipelines automatically takes over:
                  running tests, building an optimized multi-stage Docker image, publishing to Azure
                  Container Registry, and swapping production slots without missing a single user
                  request.
                </p>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <ShieldCheck size={24} color="#16a34a" />
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#166534' }}>
                    Zero-Downtime Deployment Guarantee
                  </strong>
                  <span style={{ fontSize: '12px', color: '#15803d' }}>
                    Deployment slots pre-warm containers prior to live traffic redirection.
                  </span>
                </div>
              </div>
            </div>

            <div className="deploy-overview-right">
              {deploymentSpecs.map((spec) => (
                <div key={spec.key} className="spec-row">
                  <span className="spec-key">{spec.key}</span>
                  <span className={`spec-val ${spec.isStatus ? 'active-green' : ''}`}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CLI Trigger Box */}
          <div id="quickstart" className="cli-box">
            <div className="cli-content">
              <Terminal size={20} color="#38bdf8" />
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>
                  TRIGGER AZURE CI/CD PIPELINE VIA GIT
                </div>
                <div>
                  <span className="cli-prompt">$ </span>
                  <span className="cli-command">git commit -m &quot;feat: update app&quot; &amp;&amp; git push origin main</span>
                </div>
              </div>
            </div>

            <button onClick={copyCommand} className="copy-btn" type="button">
              {copied ? (
                <>
                  <Check size={14} color="#4ade80" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Command
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      {/* Modern Light Footer */}
      <footer className="footer-modern">
        <div className="container">
          <div className="footer-top">
            <a href="#top" className="brand">
              <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
                <Cloud size={18} />
              </div>
              <span>
                Azure<span className="brand-accent">Flow</span>
              </span>
            </a>

            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#475569' }}>
              <a href="#workflow" className="nav-item">Pipeline</a>
              <a href="#stack" className="nav-item">Tech Stack</a>
              <a href="#deployment" className="nav-item">Production</a>
              <a href="#quickstart" className="nav-item">Documentation</a>
            </div>

            <div className="status-badge">
              <span className="pulse-dot" />
              <span>Azure App Service: Operational</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 AzureFlow Demo • Azure CI/CD Learning Project</span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span>Engineered by <strong style={{ color: '#0f172a', fontWeight: 600 }}>Kavindu Geethshan</strong></span>
              <span>•</span>
              <a
                href="#top"
                style={{ color: '#0078d4', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Back to top <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function ArrowDownRightIcon() {
  return <ArrowRight size={16} style={{ transform: 'rotate(45deg)' }} />
}
