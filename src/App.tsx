import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Github, Linkedin, Mail, Terminal, Sparkles, Code2, Zap, Award, ExternalLink, Send, Bot, User, Rocket } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Skill {
  name: string;
  level: number;
}

interface Job {
  company: string;
  role: string;
  period: string;
  color: string;
}

interface Project {
  name: string;
  desc: string;
  tech: string[];
  color: string;
}

export default function LivingReadme() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [llmReady, setLlmReady] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engineRef = useRef<any>(null);

  // Initialize WebLLM
  useEffect(() => {
    const initLLM = async () => {
      try {
        setLoadingStatus('Loading AI assistant...');
        const { CreateMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');

        const engine = await CreateMLCEngine('Llama-3.2-1B-Instruct-q4f16_1-MLC', {
          initProgressCallback: (progress: { text: string }) => {
            setLoadingStatus(progress.text);
          }
        });
        
        engineRef.current = engine;
        setLlmReady(true);
        setLoadingStatus('');
        setMessages([{
          role: 'assistant',
          content: "👋 Hi! I'm an AI assistant with knowledge about Cameron's experience. Ask me anything about his work, skills, or projects!"
        }]);
      } catch (error) {
        console.error('Failed to load WebLLM:', error);
        setLoadingStatus('AI assistant unavailable. Chat will work without local AI.');
        setMessages([{
          role: 'assistant',
          content: "👋 Hi! I'm here to help answer questions about Cameron's experience. (Note: Local AI couldn't load, but I can still help!)"
        }]);
      }
    };

    initLLM();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const systemPrompt = `You are an AI assistant embedded in Cameron Barnes' portfolio website. You have detailed knowledge about his professional experience:

- Senior Fullstack Engineer at Zapier (Jan 2024 – Present): DRI for 8-person Chatbots team (1.6M ARR, 4,700+ paid accounts). Led API migration and architecture modernization to OpenAPI-backed, API-first Fastify architecture saving $1,477.50/month in Vercel costs. Built in-house document conversion API saving >$100k/year. Built Private Knowledge integration with Google Docs/Notion (~1,300 connections, ~700 users) and web-scraped knowledge sources for 3,000+ weekly active users. Enhanced system reliability with background jobs architecture and Zapier events integration. Mentored junior engineers. Established testing infrastructure with SRE team.
- Senior Software Engineer at Mailchimp (May 2021 – Dec 2023): Pioneered first generative AI features in emails and automations. Led authentication framework between Mailchimp GCP and Intuit AWS. Partnered with data science for ML-powered content generation. Saved $500k/year through data retention policies. SME/lead for Creative Assistant scraper microservices (Python, JavaScript, GCP). Reduced API failures by ~80% through hardening and refactoring.
- Co-founder / Engineer at Fugue Auto (Aug 2023 – Jan 2024): Side project. Built multi-modal AI-assisted vehicle diagnostic and repair app leveraging LLMs and vehicle sensor data for fleet management and connected operations.
- Co-founder / Engineer at Fugue AI (Oct 2022 – Jan 2024): Side project. Co-developed AI art studio using DALL-E 2 and Stable Diffusion deployed on AWS Sagemaker, grew to 500+ production users.
- Software Engineer at Pindrop Security (Jan 2020 – May 2021): Built Golang and Python microservices for RabbitMQ-driven distributed system on Kubernetes/AWS with Elasticsearch, Redis, and Datadog.
- Software Engineer at Capital One (Sep 2017 – Jun 2019): Full-stack engineer on consumer-facing app, led cloud migration, built PySpark ETL pipelines, drove DevOps culture.
- Education: University of Michigan - Ann Arbor, BS in Computer Science (May 2017, GPA 3.7)
- Skills: TypeScript, Python, JavaScript, Go, SQL, Node.js, React, Fastify, tRPC, Express, LLMs, RAG, vector databases, agentic systems, OpenAI/Anthropic APIs, Vercel AI SDK, AWS, GCP, Docker, Kubernetes, PostgreSQL, Redis, Elasticsearch, Git, Datadog, PagerDuty, OpenAPI
- AWS Certified Solutions Architect – Associate (2018)

Answer questions concisely and enthusiastically. If asked about specific projects or technical details not provided, acknowledge you'd need Cameron to provide more specifics but give thoughtful general answers based on his background. Keep responses under 100 words.`;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (engineRef.current) {
        const conversationHistory = [
          { role: 'system', content: systemPrompt },
          ...messages.filter(m => m.role !== 'system'),
          userMessage
        ];

        const reply = await engineRef.current.chat.completions.create({
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 150,
        });

        const assistantMessage: Message = {
          role: 'assistant',
          content: reply.choices[0].message.content
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback responses when WebLLM isn't available
        const fallbackResponses = {
          'experience': "Cameron is currently a Senior Fullstack Engineer at Zapier, serving as DRI for the 8-person Chatbots team (1.6M ARR). He's led API migrations, built RAG pipelines, LLM integrations, and knowledge sync features for 3,000+ weekly active users. Previously he pioneered generative AI features at Mailchimp and has 7+ years of experience.",
          'skills': "Cameron's technical stack includes TypeScript, Python, JavaScript, Go, SQL, Node.js, React, Fastify, tRPC, plus AI/ML tools like LLMs, RAG, vector databases, agentic systems, and OpenAI/Anthropic APIs. Infrastructure: AWS, GCP, Docker, Kubernetes, PostgreSQL, Redis, Elasticsearch. He's AWS Certified Solutions Architect.",
          'contact': "You can reach Cameron via email at ccbarnes88@icloud.com or connect with him on LinkedIn and GitHub. Check the links at the top of this page!",
          'mailchimp': "At Mailchimp, Cameron pioneered the first generative AI features in emails and automations, led authentication framework work between Mailchimp GCP and Intuit AWS, saved $500k/year through data retention policies, and reduced API failures by ~80% through service hardening.",
          'fugue': "Cameron co-founded two ventures: Fugue AI, an AI art studio using DALL-E 2 and Stable Diffusion (500+ users, deployed on AWS Sagemaker), and Fugue Auto, a multi-modal AI-assisted vehicle diagnostic and repair app leveraging LLMs and vehicle sensor data.",
          'zapier': "At Zapier, Cameron is DRI for the Chatbots team (1.6M ARR, 4,700+ paid accounts). He led API migration to OpenAPI-backed Fastify architecture saving $1,477.50/month, built in-house document conversion saving >$100k/year, and built Private Knowledge integration with Google Docs/Notion for 3,000+ weekly active users.",
          'default': "That's a great question! Cameron has 7+ years of experience building AI-powered products and backend infrastructure. He's currently at Zapier leading the Chatbots team, working on RAG pipelines, LLM integrations, and agentic APIs. Feel free to reach out to him directly for more specific details!"
        };

        const response = Object.entries(fallbackResponses).find(([key]) => 
          input.toLowerCase().includes(key)
        )?.[1] || fallbackResponses.default;

        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I encountered an error. Please try rephrasing your question!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const skills: Skill[] = [
    { name: 'TypeScript/JavaScript', level: 95 },
    { name: 'Python', level: 95 },
    { name: 'Go', level: 85 },
    { name: 'Node.js/React/Fastify', level: 90 },
    { name: 'LLMs/RAG/Agentic AI', level: 92 },
    { name: 'AWS/GCP/Docker/K8s', level: 90 },
    { name: 'PostgreSQL/Redis/Elasticsearch', level: 88 },
    { name: 'Datadog/PagerDuty/OpenAPI', level: 85 },
  ];

  const colorMap: Record<string, { dotBg: string; ring: string; projectHover: string }> = {
    emerald: { dotBg: 'bg-emerald-400', ring: 'ring-emerald-400/20', projectHover: 'hover:border-emerald-500/50' },
    blue: { dotBg: 'bg-blue-400', ring: 'ring-blue-400/20', projectHover: 'hover:border-blue-500/50' },
    purple: { dotBg: 'bg-purple-400', ring: 'ring-purple-400/20', projectHover: 'hover:border-purple-500/50' },
    orange: { dotBg: 'bg-orange-400', ring: 'ring-orange-400/20', projectHover: 'hover:border-orange-500/50' },
    cyan: { dotBg: 'bg-cyan-400', ring: 'ring-cyan-400/20', projectHover: 'hover:border-cyan-500/50' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-mono">
      {/* Header - GitHub style */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-bold">cameronbarnes / <span className="text-emerald-400">portfolio</span></span>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/jhoseph88" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors" aria-label="GitHub Profile">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/cameron-barnes-923a9a188/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors" aria-label="LinkedIn Profile">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:ccbarnes88@icloud.com" className="hover:text-emerald-400 transition-colors" aria-label="Email Contact">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* README Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="animate-pulse">👋</span> Hi, I'm Cameron Barnes
          </h1>
          <p className="text-xl text-slate-400 mb-4">Senior Fullstack Engineer @ Zapier</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm">
              🚀 Full-Stack Development
            </span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm">
              🤖 AI Integration
            </span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm">
              ⚡ RAG & Agentic Systems
            </span>
            <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm">
              📍 Atlanta, GA
            </span>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-emerald-400" />
            ## About Me
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Senior software engineer with 7+ years of experience building AI-powered products and backend infrastructure.
            At Zapier, led architecture and development of a chatbot platform serving 3,000+ weekly active users and $1.6M ARR
            — including RAG pipelines, LLM integrations, knowledge sync, and agentic APIs. Previously pioneered generative AI
            features at Mailchimp. Comfortable owning work end-to-end across the full stack, from product concept to production.
            Looking for roles at the intersection of AI and real user impact.
          </p>
        </section>

        {/* Experience Timeline */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            ## Experience
          </h2>
          <div className="space-y-4">
            {([
              { company: 'Zapier', role: 'Senior Fullstack Engineer', period: 'Jan 2024 – Present', color: 'emerald' },
              { company: 'Mailchimp', role: 'Senior Software Engineer', period: 'May 2021 – Dec 2023', color: 'blue' },
              { company: 'Pindrop Security', role: 'Software Engineer', period: 'Jan 2020 – May 2021', color: 'orange' },
              { company: 'Capital One', role: 'Software Engineer', period: 'Sep 2017 – Jun 2019', color: 'emerald' },
            ] as Job[]).map((job, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className={`w-3 h-3 rounded-full mt-2 ring-4 ${colorMap[job.color].dotBg} ${colorMap[job.color].ring} group-hover:ring-8 transition-all`} />
                <div className="flex-1 p-4 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{job.role}</h3>
                      <p className="text-slate-400">{job.company}</p>
                    </div>
                    <span className="text-sm text-slate-500">{job.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack with Progress Bars */}
        <section className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-400" />
            ## Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-300">{skill.name}</span>
                  <span className="text-sm text-slate-500">{skill.level}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            ## Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              {
                name: 'Zapier Chatbots API Migration',
                desc: 'Led OpenAPI-backed architecture modernization as DRI for 8-person team (1.6M ARR), saving $1,477.50/month in Vercel costs for 4,700+ paid accounts',
                tech: ['TypeScript', 'Fastify', 'OpenAPI', 'tRPC'],
                color: 'emerald'
              },
              {
                name: 'Private Knowledge Integration',
                desc: 'Built Google Docs/Notion integration (~1,300 connections, ~700 users) and web-scraped knowledge sources for 3,000+ weekly active users',
                tech: ['Python', 'LLMs', 'RAG', 'OAuth'],
                color: 'blue'
              },
              {
                name: 'Mailchimp AI Features',
                desc: 'Pioneered first generative AI features in emails and automations; saved $500k/year through data retention policies',
                tech: ['Python', 'JavaScript', 'ML', 'GCP'],
                color: 'purple'
              },
            ] as Project[]).map((project, i) => (
              <div key={i} className={`p-5 bg-slate-800/50 rounded-lg border border-slate-700 ${colorMap[project.color].projectHover} transition-all group`}>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  {project.name}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-slate-400 text-sm mb-3">{project.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tech.map((t, j) => (
                    <span key={j} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Side Projects */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-emerald-400" />
            ## Side Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              {
                name: 'Fugue Auto',
                desc: 'Multi-modal AI-assisted vehicle diagnostic and repair app leveraging LLMs and vehicle sensor data for fleet management and connected operations',
                tech: ['Python', 'LLMs', 'AI Models'],
                color: 'cyan'
              },
              {
                name: 'Fugue AI Art Studio',
                desc: 'AI art studio using DALL-E 2 and Stable Diffusion deployed on AWS Sagemaker; grew to 500+ production users',
                tech: ['Python', 'AWS Sagemaker', 'Stable Diffusion'],
                color: 'purple'
              },
            ] as Project[]).map((project, i) => (
              <div key={i} className={`p-5 bg-slate-800/50 rounded-lg border border-slate-700 ${colorMap[project.color].projectHover} transition-all group`}>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  {project.name}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-slate-400 text-sm mb-3">{project.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tech.map((t, j) => (
                    <span key={j} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Assistant CTA */}
        <section className="mb-8 p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/30">
          <div className="flex items-start gap-4">
            <Bot className="w-8 h-8 text-emerald-400 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">💬 Ask Me Anything (Powered by Local AI)</h3>
              <p className="text-slate-300 mb-4">
                This portfolio features a local AI assistant powered by WebLLM. It runs entirely in your browser -
                no data sent to servers! Ask about my experience, skills, or projects.
              </p>
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                {chatOpen ? 'Close Chat' : 'Open AI Assistant'}
              </button>
              {loadingStatus && (
                <p className="text-sm text-slate-400 mt-2 animate-pulse">{loadingStatus}</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Floating Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Chat Header */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <span className="font-bold">AI Assistant</span>
              {llmReady && <span className="text-xs text-emerald-400">● Local AI Active</span>}
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-slate-900' 
                    : 'bg-slate-800 text-slate-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div className="bg-slate-800 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask about Cameron's experience..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}