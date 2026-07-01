import React, { useMemo, useRef, useState } from 'react';
import { getGenerativeModel } from 'firebase/ai';
import { Link } from 'react-router-dom';
import { ai } from './firebase-init';
import { useSettings } from './SettingsContext';
import { useContentCollection } from './useContentCollection';
import { useFirestoreCollection } from './useFirestoreCollection';

const CHAT_MODEL = 'gemini-3.5-flash';

const NAVIGATION_GUIDE = [
  { label: 'Admissions', path: '/admission', keywords: ['admission', 'apply', 'fee', 'fees', 'payment', 'tc', 'prospectus'] },
  { label: 'Academics', path: '/academics', keywords: ['academic', 'class', 'cbse', 'curriculum', 'exam', 'learning'] },
  { label: 'News', path: '/news', keywords: ['news', 'update', 'announcement'] },
  { label: 'Events', path: '/events', keywords: ['event', 'program', 'celebration'] },
  { label: 'Achievements', path: '/achievements', keywords: ['achievement', 'award', 'winner'] },
  { label: 'Mandatory Disclosure', path: '/mandatory-public-disclosure', keywords: ['disclosure', 'document', 'public', 'mandatory'] },
  { label: 'Ansar Times', path: '/ansar-times', keywords: ['magazine', 'newsletter', 'ansar times'] },
  { label: 'Contact', path: '/contact', keywords: ['contact', 'phone', 'email', 'location', 'address', 'whatsapp'] }
];

const QUICK_QUESTIONS = [
  'How can I contact the school?',
  'Guide me for admission',
  'Show latest news',
  'Where can I find fee details?'
];

const SCHOOL_PROFILE_CONTEXT = [
  'History: Ansar English School was founded in 1980/1982 as the flagship educational institution of Ansari Charitable Trust in Perumpilavu. It grew from a humble initiative into a respected CBSE Senior Secondary school in Kerala.',
  'Milestones: Ansari Charitable Trust got registered in 1979. The school got registered in 1982, received CBSE affiliation in 1988, became Senior Secondary in 1990, sent its first Class XII batch in 1992, received NABET accreditation in 2024, and marked 2026 as the Year of Sustainability.',
  'Trust and service: The school is shaped by Ansari Charitable Trust, whose wider service ecosystem includes education, healthcare, social welfare, an orphanage, a special school, and women\'s education initiatives.',
  'Scale: The campus serves over 4,600 students with 270+ educators/staff members and has 40+ years of service in value-based education.',
  'Affiliation and accreditation: Ansar English School is affiliated with CBSE, New Delhi, and is NABET accredited. The site presents it as the first school in Thrissur accredited by NABET.',
  'Facilities: CCTV-enabled safety, spacious classrooms with smart boards, qualified support staff, digital classrooms, special play area, advanced labs, multi-sports play area, Wi-Fi enabled learning environment, safe school transport, ATL tinkering/innovation spaces, science and computer labs, language enrichment, exam preparation support, and a library with more than 34,000 books and learning resources.',
  'Academic pathway: Ansar Sprouts for foundational early learning, Primary School for literacy/numeracy/environmental awareness, Middle School for concept clarity and analytical thinking, and Senior Secondary for subject depth, practical work, projects, and CBSE exam preparation.',
  'Campus life: The school supports sports, arts, innovation, entrepreneurship, environmental stewardship, community engagement, Student Police Cadet, NSS, clubs, NIOS, life skills, leadership, and co-curricular programmes.',
  'Ansar Media and Production: An in-house media unit for photography, videography, drone videography, podcast production, graphic designing, editing, event documentation, social media creatives, reels, institutional presentations, and communication support for school activities.',
  'Virtual tour: A 360 degree virtual campus tour is linked from the About page at https://www.p4panorama.com/360-virtual-tour/ansar-school/.'
].join('\n');

const TRUSTEES_CONTEXT = [
  'Chairman: MAMMUNNI K K',
  'Acting Chairman: V T ABDULLAH KOYA THANGAL',
  'Vice Chairman: MOHAMMED K V',
  'Secretary: E A KUNJAHAMMU',
  'Assistant Secretary: SHAJU MOHAMEDUNNI',
  'Trust/Managing Committee members listed on the website include NAJEEB P, MOHAMMED AMEEN E M, MOOSA V, NOOR MOHAMMED KAMALUDHEEN, MUHAMMED SHEREEF E V, ABDUL HAMEED, K K SHANAVAS, MOHAMED KUTTY KAYINGIL, ISMAIL KASIM, SHOUKATH ALI KOROTH, T A MOIDEEN ALIAS MOIDUTTY, M I ABDUL AZEEZ, A USMAN, ANWAR ABDUL MAJEED, MUJEEB RAHMAN P, Dr. MOHAMED BADEEUZZAMAN, Dr. MOHAMMED ALI MAMPPILLY (KOOTTIL), and P I NOUSHAD.'
].join('\n');

function stripHtml(value = '') {
  return String(value)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function trimText(value = '', limit = 220) {
  const text = stripHtml(value);
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function formatItems(items, fields) {
  return items
    .filter(item => item && item.published !== false)
    .slice(0, 6)
    .map(item => fields.map(field => item[field]).filter(Boolean).join(' - '))
    .filter(Boolean)
    .join('\n');
}

function buildSiteContext({ settings, updates, achievements, disclosures, ansarTimes, pages, leadership }) {
  const news = updates.filter(item => item.published !== false && (item.category === 'News' || !item.category));
  const events = updates.filter(item => item.published !== false && item.category === 'Events');
  const pageSummaries = pages
    .filter(page => page?.published !== false)
    .slice(0, 8)
    .map(page => `${page.title || page.slug}: ${trimText(page.bodyHtml || page.content || page.description, 180)}`)
    .join('\n');
  const leadershipSummary = leadership
    .filter(person => person?.published !== false)
    .slice(0, 14)
    .map(person => [person.role || person.section, person.name, person.qualification || person.qualifications].filter(Boolean).join(' - '))
    .filter(Boolean)
    .join('\n');
  const juniorPrincipals = Array.isArray(settings?.juniorPrincipals)
    ? settings.juniorPrincipals
        .filter(person => person?.name || person?.section)
        .map(person => [person.section || 'Junior Principal', person.name, person.qualification || person.qualifications].filter(Boolean).join(' - '))
        .join('\n')
    : '';

  return [
    'School: Ansar English School, Perumpilavu, Thrissur, Kerala. CBSE-affiliated and NABET accredited.',
    SCHOOL_PROFILE_CONTEXT,
    TRUSTEES_CONTEXT,
    'Contact: Phone +91 81298 08051. Email hr@ansar.in. Address Ansar English School, Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519.',
    'Admission: Applications are open annually from Jan 01 to March 31. Above LKG requires a language proficiency and diagnostic assessment. Admission and payment portal: https://ansartrust.atcampussolutions.com/school/.',
    `Fee structure: ${settings?.feeStructureTitle || 'Fee Structure'} - ${settings?.feeStructurePdfUrl || 'available on the Admission page'}.`,
    `Vision: ${trimText(settings?.visionText, 240)}`,
    `Mission: ${trimText(settings?.missionText, 360)}`,
    `Director: ${settings?.directorName || 'Dr. Najeeb Mohamad'} ${settings?.directorQualifications || ''}.`,
    `Principal: ${settings?.principalName || 'Ms. Sajidha Razak'} ${settings?.principalQualifications || ''}.`,
    `Leadership and staff from admin/settings:\n${leadershipSummary || juniorPrincipals || 'Director, Principal, Junior Principals, teachers, and support staff are represented on the website/admin panel.'}`,
    `Junior Principals from settings:\n${juniorPrincipals || 'Junior principal details are available on the home page when configured.'}`,
    `Latest news:\n${formatItems(news, ['date', 'title', 'description']) || 'No published news currently loaded.'}`,
    `Latest events:\n${formatItems(events, ['date', 'title', 'description']) || 'No published events currently loaded.'}`,
    `Achievements:\n${formatItems(achievements, ['date', 'title', 'studentName', 'description']) || 'No published achievements currently loaded.'}`,
    `Public disclosure documents:\n${formatItems(disclosures, ['section', 'title']) || 'No public disclosure documents currently loaded.'}`,
    `Ansar Times:\n${formatItems(ansarTimes, ['year', 'month']) || 'No magazine issues currently loaded.'}`,
    `Admin-managed pages:\n${pageSummaries || 'No extra admin pages currently loaded.'}`,
    `Navigation map: ${NAVIGATION_GUIDE.map(item => `${item.label}=${item.path}`).join(', ')}, Ansar Media and Production=/ansar-media-production, Sports=/sports-page, ATL=/atl, Ansar Sprouts=/ansar-sprouts, Life at Ansar=/life-at-ansar.`
  ].join('\n\n');
}

function findNavigationMatches(question) {
  const normalized = question.toLowerCase();
  return NAVIGATION_GUIDE.filter(item => item.keywords.some(keyword => normalized.includes(keyword))).slice(0, 3);
}

function getFallbackAnswer(question, context) {
  const matches = findNavigationMatches(question);
  const lower = question.toLowerCase();

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('location')) {
    return 'You can contact Ansar English School at +91 81298 08051 or email hr@ansar.in. The campus is at Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519. Please open the Contact page for the map and inquiry form.';
  }

  if (lower.includes('admission') || lower.includes('fee') || lower.includes('payment')) {
    return 'For admissions, visit the Admission page. Applications are open annually from Jan 01 to March 31, and fee details are available there. The online admission and payment portal is also linked from that page.';
  }

  if (lower.includes('history') || lower.includes('founded') || lower.includes('started') || lower.includes('trust')) {
    return 'Ansar English School is the flagship educational institution of Ansari Charitable Trust in Perumpilavu. The Trust was registered in 1979, the school was registered in 1982, received CBSE affiliation in 1988, became Senior Secondary in 1990, and received NABET accreditation in 2024. Please open the About page for the full timeline and trustee details.';
  }

  if (lower.includes('leader') || lower.includes('principal') || lower.includes('director') || lower.includes('staff')) {
    return `The school leadership shown on the website includes ${context.includes('Director:') ? 'the Director, Principal, Junior Principals, trustees, teachers, and support staff' : 'the Director, Principal, Junior Principals, trustees, teachers, and support staff'}. Ansar has 270+ educators/staff members supporting over 4,600 students. Please open the About or home page for profile details.`;
  }

  if (lower.includes('facility') || lower.includes('facilities') || lower.includes('lab') || lower.includes('library') || lower.includes('sports') || lower.includes('transport')) {
    return 'Ansar facilities include smart/digital classrooms, CCTV-enabled safety, advanced science and computer labs, ATL innovation space, language enrichment, a library with 34,000+ resources, multi-sports play areas, Wi-Fi enabled learning, special play areas, qualified support staff, and safe school transport.';
  }

  if (lower.includes('media') || lower.includes('production') || lower.includes('photography') || lower.includes('videography') || lower.includes('podcast')) {
    return 'Ansar Media and Production is the school\'s in-house media unit. It supports photography, videography, drone videography, podcasts, graphic designing, editing, event documentation, reels, social media creatives, and institutional presentations. You can find it under Explore > Ansar Media and Production.';
  }

  if (lower.includes('news') || lower.includes('event') || lower.includes('achievement')) {
    return 'The latest school updates are available in News, Events, and Achievements. I can guide you to the relevant page from the shortcuts below.';
  }

  return matches.length
    ? `I can guide you to ${matches.map(match => match.label).join(', ')}. Please choose one of the links below.`
    : 'Good day. I can help with admissions, fee details, academics, news, events, achievements, public disclosure documents, Ansar Times, and contact information. Please ask your question in a little more detail.';
}

export default function SchoolChatbot() {
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Good day. Welcome to Ansar English School. I can guide you through admissions, academics, news, events, achievements, public disclosures, Ansar Times, and contact details. How may I assist you?'
    }
  ]);
  const conversationRef = useRef([]);

  const { data: updates } = useContentCollection('updates', 'createdAt', 'desc', { limit: 18 });
  const { data: achievements } = useContentCollection('achievements', 'date', 'desc', { limit: 8 });
  const { data: disclosures } = useContentCollection('publicDisclosure', 'order', 'asc', { limit: 12 });
  const { data: ansarTimes } = useContentCollection('ansarTimes', 'year', 'desc', { limit: 8 });
  const { data: leadership } = useContentCollection('leadership', 'order', 'asc', { firestoreOnly: true });
  const { data: pages } = useFirestoreCollection('pages', 'createdAt', 'desc');

  const siteContext = useMemo(
    () => buildSiteContext({ settings, updates, achievements, disclosures, ansarTimes, pages, leadership }),
    [settings, updates, achievements, disclosures, ansarTimes, pages, leadership]
  );

  const suggestedLinks = useMemo(() => {
    const lastUserMessage = [...messages].reverse().find(message => message.role === 'user')?.text || '';
    const matches = findNavigationMatches(lastUserMessage);
    return matches.length ? matches : NAVIGATION_GUIDE.slice(0, 4);
  }, [messages]);

  const sendQuestion = async (questionText) => {
    const question = questionText.trim();
    if (!question || loading) return;

    const userMessage = { role: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = getGenerativeModel(ai, {
        model: CHAT_MODEL,
        generationConfig: { maxOutputTokens: 420 }
      });
      const conversation = [...conversationRef.current, userMessage].slice(-8);
      const prompt = [
        'You are the formal, helpful website assistant for Ansar English School.',
        'Answer only from the provided website/admin/sheet context. If information is missing, say so and guide the visitor to Contact.',
        'Keep replies concise, polite, and navigation-oriented. Mention relevant page names and paths when useful.',
        'Do not invent dates, fees, phone numbers, or policies.',
        `Website context:\n${siteContext}`,
        `Conversation:\n${conversation.map(message => `${message.role}: ${message.text}`).join('\n')}`,
        `Visitor question: ${question}`
      ].join('\n\n');

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const assistantMessage = { role: 'assistant', text: text || getFallbackAnswer(question, siteContext) };
      conversationRef.current = [...conversation, assistantMessage].slice(-8);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.warn('AI assistant unavailable, using guided fallback.', error);
      const assistantMessage = { role: 'assistant', text: getFallbackAnswer(question, siteContext) };
      conversationRef.current = [...conversationRef.current, userMessage, assistantMessage].slice(-8);
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendQuestion(input);
  };

  return (
    <div className="fixed bottom-5 left-5 z-[9998]">
      {isOpen && (
        <section className="mb-4 flex h-[min(76vh,38rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-emerald-950 px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-400 text-emerald-950">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 16v-2m6-6h2M4 12h2m9.9-5.9 1.4-1.4M6.7 17.3l1.4-1.4m9.2 1.4-1.4-1.4M6.7 6.7l1.4 1.4M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-extrabold">Ansar AI Assistant</h2>
                <p className="truncate text-xs text-emerald-100">Website guidance</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close assistant">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                Preparing a response
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestedLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {QUICK_QUESTIONS.slice(0, 4).map(question => (
                <button key={question} type="button" onClick={() => sendQuestion(question)} className="rounded-lg bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200">
                  {question}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about the school..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-400 focus:bg-white"
              />
              <button type="submit" disabled={loading || !input.trim()} className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-2xl ring-4 ring-white transition-all hover:-translate-y-1 hover:bg-emerald-800"
        aria-label={isOpen ? 'Close Ansar AI Assistant' : 'Open Ansar AI Assistant'}
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-3l-4 4v-4H9Z" />
        </svg>
      </button>
    </div>
  );
}
