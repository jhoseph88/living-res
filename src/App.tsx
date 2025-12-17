import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Github, Linkedin, Mail, Terminal, Sparkles, Code2, Zap, Award, ExternalLink, Send, Bot, User } from 'lucide-react';

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

- Senior Software Engineer at Zapier (Jan 2024 – Present): Working on Chatbots product, led API migration saving $1,477/month, built Private Knowledge integration with Google Docs/Notion serving 3,000+ weekly active users
- Senior Software Engineer at Mailchimp (May 2021 – Dec 2023): Pioneered first generative AI features, led authentication framework between GCP and AWS, saved company $500k/year through data retention improvements
- Manager/Co-founder at Fugue AI (Oct 2022 – January 2024): Built AI art studio with DALL-E 2 and Stable Diffusion, grew to 500+ production users
- Software Engineer at Pindrop Security (Jan 2020 – May 2021): Built Golang and Python microservices on Kubernetes
- Software Engineer at Capital One (Sep 2017 – Jun 2019): Full-stack engineer focusing on Java API development and infrastructure automation
- Education: University of Michigan, BS in Computer Science (May 2017, GPA 3.7)
- Strong skills in: Python, Go, JavaScript/TypeScript, AWS, GCP, Kubernetes, PostgreSQL/MySQL, AI/ML integration
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
          'experience': "Cameron is currently a Senior Software Engineer at Zapier working on the Chatbots product. He's led major API migrations, built Private Knowledge integrations with Google Docs/Notion, and has 7+ years of experience across companies like Mailchimp, Pindrop Security, and Capital One.",
          'skills': "Cameron's technical stack includes Python, Go, JavaScript/TypeScript, AWS, GCP, Kubernetes, PostgreSQL/MySQL, and AI/ML integration. He's AWS Certified and has strong experience in distributed systems and cloud architecture.",
          'contact': "You can reach Cameron via email at ccbarnes88@icloud.com or connect with him on LinkedIn and GitHub. Check the links at the top of this page!",
          'mailchimp': "At Mailchimp, Cameron pioneered the first generative AI features in emails and automations, led authentication framework work between GCP and AWS, and saved the company $500k/year through data retention improvements.",
          'fugue': "Fugue AI is Cameron's side project where he co-founded an AI art studio using models like DALL-E 2 and Stable Diffusion. It's grown to 500+ production users and is deployed on AWS.",
          'default': "That's a great question! Cameron has extensive experience in full-stack development, AI integration, and building scalable systems. He's currently at Zapier working on Chatbots. Feel free to reach out to him directly for more specific details!"
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
    { name: 'Python', level: 95 },
    { name: 'JavaScript/TypeScript', level: 95 },
    { name: 'Go', level: 85 },
    { name: 'AWS/GCP', level: 90 },
    { name: 'PostgreSQL/MySQL', level: 88 },
    { name: 'Kubernetes/Docker', level: 85 },
    { name: 'React', level: 82 },
    { name: 'AI/ML Integration', level: 88 },
  ];

  const colorMap: Record<string, { dotBg: string; ring: string; projectHover: string }> = {
    emerald: { dotBg: 'bg-emerald-400', ring: 'ring-emerald-400/20', projectHover: 'hover:border-emerald-500/50' },
    blue: { dotBg: 'bg-blue-400', ring: 'ring-blue-400/20', projectHover: 'hover:border-blue-500/50' },
    purple: { dotBg: 'bg-purple-400', ring: 'ring-purple-400/20', projectHover: 'hover:border-purple-500/50' },
    orange: { dotBg: 'bg-orange-400', ring: 'ring-orange-400/20', projectHover: 'hover:border-orange-500/50' },
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
          <p className="text-xl text-slate-400 mb-4">Senior Software Engineer @ Zapier</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm">
              🚀 Full-Stack Development
            </span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm">
              🤖 AI Integration
            </span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm">
              ⚡ Developer Tools
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
            Senior software engineer with 7+ years of experience building scalable systems and AI-powered products.
            Proven track record of technical leadership on high-revenue teams, driving cost savings through
            architectural improvements, and delivering customer-focused features leveraging LLMs and generative AI.
            Currently at Zapier working on the Chatbots product, leading API migrations and building integrations
            that serve thousands of users.
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
              { company: 'Zapier', role: 'Senior Software Engineer', period: 'Jan 2024 – Present', color: 'emerald' },
              { company: 'Mailchimp', role: 'Senior Software Engineer', period: 'May 2021 – Dec 2023', color: 'blue' },
              { company: 'Fugue AI', role: 'Manager / Co-founder', period: 'Oct 2022 – Jan 2024', color: 'purple' },
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
                desc: 'Led OpenAPI-backed API modernization saving $1,477/month in Vercel costs for 4,700+ paid accounts',
                tech: ['Python', 'FastAPI', 'OpenAPI'],
                color: 'emerald'
              },
              {
                name: 'Private Knowledge Integration',
                desc: 'Built Google Docs/Notion integration creating ~1,300 connections for 3,000+ weekly active users',
                tech: ['Python', 'LLMs', 'OAuth'],
                color: 'blue'
              },
              {
                name: 'Mailchimp AI Features',
                desc: 'Pioneered first generative AI features in emails and automations with cross-functional team',
                tech: ['Python', 'JavaScript', 'ML'],
                color: 'purple'
              },
              {
                name: 'Fugue AI Art Studio',
                desc: 'Co-developed AI art studio using DALL-E 2 and Stable Diffusion deployed in AWS',
                tech: ['Python', 'AWS', 'AI Models'],
                color: 'orange'
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