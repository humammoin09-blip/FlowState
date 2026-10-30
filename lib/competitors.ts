export interface CompetitorComparison {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  whatItDoesWell: string;
  coreLimitation: string;
  hasWebsiteBlocker: string;
  flowStateBlocker: string;
  keyFeatures: {
    feature: string;
    competitor: string;
    flowstate: string;
  }[];
  whyStudentsSwitch: string[];
  verdict: string;
}

export const COMPETITOR_SLUGS = [
  "notion",
  "todoist",
  "rescuetime",
  "freedom",
  "focusmate",
  "trello",
  "asana",
  "toggl",
  "clockify",
  "habitica",
  "notion-calendar",
  "google-calendar",
  "forest",
  "pomofocus",
  "cold-turkey",
] as const;

export type CompetitorSlug = (typeof COMPETITOR_SLUGS)[number];

export const COMPETITORS_DATA: Record<CompetitorSlug, CompetitorComparison> = {
  notion: {
    slug: "notion",
    name: "Notion",
    category: "Workspace & Knowledge Management",
    tagline: "The all-in-one modular workspace for notes and project wikis",
    whatItDoesWell:
      "Notion is arguably the most versatile modular workspace ever created. It gives students and teams blank-slate freedom to build relational assignment trackers, semester course wikis, notes databases, and intricate aesthetic dashboards.",
    coreLimitation:
      "While Notion is great at organizing information, it creates an illusion of productivity. Students often spend 4 hours tweaking templates, colors, and relational properties instead of doing deep work. Crucially, Notion lacks any website blocker, Pomodoro focus protocol, or proactive AI coach to stop you from opening YouTube or Instagram.",
    hasWebsiteBlocker: "No (Open browser with infinite distractions)",
    flowStateBlocker: "Yes (Hard browser extension blocks Shorts, Reels, Reddit)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Tabs remain open and unblocked)",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No (Generic text assistant only)",
        flowstate: "Yes (Proactive real-time discipline partner)",
      },
      {
        feature: "Daily Focus Blueprint",
        competitor: "Manual setup required via databases",
        flowstate: "Yes (Structured 90-minute high-leverage blocks)",
      },
      {
        feature: "Context-Aware Allowlist",
        competitor: "No",
        flowstate: "Yes (Watch lectures, block algorithmic feeds)",
      },
      {
        feature: "Setup Friction",
        competitor: "High (Hours spent tweaking templates)",
        flowstate: "Zero (Instant 1-click focus workspace)",
      },
    ],
    whyStudentsSwitch: [
      "Spending more time designing Notion dashboards than actually studying",
      "Getting derailed by YouTube Shorts and Instagram tabs in the same browser window",
      "Lack of real-time accountability when energy and willpower drop during long study sessions",
      "Template fatigue and complex database maintenance",
    ],
    verdict:
      "Notion is fantastic as a second brain for storing class notes and project wikis. However, for actual study sessions where you must sit down, eliminate tabs, and execute without getting distracted by endless template organization, FlowState provides the hard enforcement and AI coaching that Notion completely lacks.",
  },
  todoist: {
    slug: "todoist",
    name: "Todoist",
    category: "To-Do List & Task Management",
    tagline: "Simple, intuitive task tracking and daily lists",
    whatItDoesWell:
      "Todoist is widely acclaimed for its frictionless natural language task creation ('read chapter 4 every monday at 9am'), clean interface, and reliable multi-platform sync across desktop and mobile devices.",
    coreLimitation:
      "Todoist is purely a passive repository of tasks. Listing an assignment on a screen doesn't help you resist dopamine temptations when opening a browser. Without website blocking or focused execution modes, tasks sit unchecked on the list while hours are lost to social media feeds.",
    hasWebsiteBlocker: "No (Passive to-do list without tab protection)",
    flowStateBlocker: "Yes (Closes distracting feeds automatically)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Zero browser blocking)",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No",
        flowstate: "Yes (Psychological nudges & friction diagnosis)",
      },
      {
        feature: "Daily Focus Blueprint",
        competitor: "Basic checklist without focus blocks",
        flowstate: "Yes (90-minute structured deep work blocks)",
      },
      {
        feature: "Integrated Pomodoro Timer",
        competitor: "Requires 3rd-party integrations",
        flowstate: "Yes (Custom OLED focus intervals)",
      },
      {
        feature: "Streak Protection Protocol",
        competitor: "Strict counter that resets on missed days",
        flowstate: "Yes (Psychological streak saver & heatmap)",
      },
    ],
    whyStudentsSwitch: [
      "Staring at a growing list of tasks without the discipline to start",
      "No protection against switching tabs to TikTok or YouTube during study blocks",
      "Frustration when uncompleted tasks pile up and induce guilt",
      "Need for a system that actively protects focus rather than just recording tasks",
    ],
    verdict:
      "Todoist tells you what you need to do, but provides zero defense against the internet when you try to do it. FlowState bridges the gap by turning your blueprint into a locked-in deep work session with built-in site blocking and an AI coach.",
  },
  rescuetime: {
    slug: "rescuetime",
    name: "RescueTime",
    category: "Automatic Screen Time Tracking",
    tagline: "Passive screen time monitoring and productivity scoring",
    whatItDoesWell:
      "RescueTime pioneered automated desktop activity tracking. It quietly runs in the background, categorizing websites and software into productive versus distracting buckets, and generates detailed weekly productivity charts.",
    coreLimitation:
      "RescueTime is retroactive guilt software. It tells you on Sunday that you wasted 14 hours scrolling Twitter and watching YouTube, but did nothing in the moment on Tuesday afternoon to stop you. For students, passive analytics don't break compulsive scrolling.",
    hasWebsiteBlocker: "No (Limited focus sessions in paid tiers only)",
    flowStateBlocker: "Yes (Real-time active tab protection)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Focus sessions are easily bypassed)",
        flowstate: "Yes (Hard browser extension blocker)",
      },
      {
        feature: "Intervention Timing",
        competitor: "Retroactive (Reports after you wasted time)",
        flowstate: "Proactive (Blocks distractions in real-time)",
      },
      {
        feature: "AI Discipline Coach",
        competitor: "No (Automated scores only)",
        flowstate: "Yes (Interactive AI guidance when stuck)",
      },
      {
        feature: "Daily Action Blueprint",
        competitor: "No (Analytics only)",
        flowstate: "Yes (Prioritized daily cognitive goals)",
      },
      {
        feature: "Student Usability",
        competitor: "Complex enterprise-focused reports",
        flowstate: "Streamlined OLED focus dashboard",
      },
    ],
    whyStudentsSwitch: [
      "Tired of looking at depressing charts of lost hours after the fact",
      "Need an active barrier that prevents opening distracting websites",
      "Want actionable focus guidance rather than passive data surveillance",
      "Complex configuration of productivity scores",
    ],
    verdict:
      "Looking at colorful charts of lost time doesn't fix procrastination. FlowState acts proactively in real-time: hard blocking distracting URLs before you waste time and offering an AI coach when your focus falters.",
  },
  freedom: {
    slug: "freedom",
    name: "Freedom",
    category: "Cross-Platform Website Blocker",
    tagline: "Scheduled distraction blocking across multiple devices",
    whatItDoesWell:
      "Freedom has been a trusted blocking utility for years. It allows users to set scheduled blocking sessions that synchronize across Mac, Windows, iOS, and Android.",
    coreLimitation:
      "Freedom is a blunt instrument without intelligence. It blocks URLs on a schedule, but lacks an integrated task workspace, focus blueprints, or psychological accountability. Furthermore, its rigid blocking frequently breaks legitimate academic research (e.g. blocking all of YouTube when a student needs a university lecture).",
    hasWebsiteBlocker: "Yes (Rigid / All-or-nothing domain block)",
    flowStateBlocker: "Yes (Precision allowlist & smart blocker)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "Yes (All-or-nothing domain blocking)",
        flowstate: "Yes (Precision allowlist: permits lectures, blocks feeds)",
      },
      {
        feature: "Integrated Task Blueprint",
        competitor: "No (Blocker only)",
        flowstate: "Yes (Prioritized daily deep work blueprint)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No",
        flowstate: "Yes (Real-time psychological intervention)",
      },
      {
        feature: "Discipline Analytics",
        competitor: "Basic session history",
        flowstate: "Yes (Consistency heatmap & streak saver)",
      },
      {
        feature: "Workflow Flexibility",
        competitor: "Breaks when you need educational video research",
        flowstate: "Built for students who need documentation & lectures",
      },
    ],
    whyStudentsSwitch: [
      "Freedom blocks all of YouTube, making it impossible to watch necessary lectures",
      "Having to stitch together separate timer, to-do, and blocker apps",
      "Lack of motivation or AI guidance when starting tough assignments",
      "High subscription cost for a standalone blocker without a workspace",
    ],
    verdict:
      "Freedom is just a blocker, requiring you to stitch together separate timer and task apps. FlowState is an all-in-one Deep Work OS: combining precision video allowlisting with an AI discipline partner and daily focus blueprints.",
  },
  focusmate: {
    slug: "focusmate",
    name: "Focusmate",
    category: "Virtual Coworking & Body Doubling",
    tagline: "Live 1-on-1 video accountability with strangers",
    whatItDoesWell:
      "Focusmate provides effective body doubling by pairing you with real people around the world for 25, 50, or 75-minute webcam sessions where you state your goal and work in silence.",
    coreLimitation:
      "Focusmate requires high social energy, webcam readiness, and rigid calendar scheduling. Introverted students or those studying in public libraries, late at night, or with inconsistent bandwidth often find scheduling video calls with strangers exhausting. Moreover, your camera partner cannot stop you from opening distracting tabs in another window.",
    hasWebsiteBlocker: "No (Relies solely on social pressure)",
    flowStateBlocker: "Yes (Hard browser tab enforcement)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Partner cannot monitor your tabs)",
        flowstate: "Yes (Hard browser extension enforcement)",
      },
      {
        feature: "Social Energy Required",
        competitor: "High (Webcam on, talking with strangers)",
        flowstate: "Zero (Private AI accountability on demand)",
      },
      {
        feature: "On-Demand Availability",
        competitor: "Must book calendar slots ahead of time",
        flowstate: "Instant 24/7 access at any second",
      },
      {
        feature: "Integrated Focus Blueprint",
        competitor: "No (You write goals in chat)",
        flowstate: "Yes (Structured 90-minute high-leverage blocks)",
      },
      {
        feature: "Distraction Defense",
        competitor: "Vulnerable to covert tab scrolling",
        flowstate: "Impossible to access Reels, Shorts or Reddit",
      },
    ],
    whyStudentsSwitch: [
      "Webcam fatigue and social anxiety when meeting strangers",
      "Cannot book sessions at irregular hours or in quiet study halls",
      "Realizing you can still secretly scroll social media off-camera",
      "Wanting an instant focus tool without appointment bookings",
    ],
    verdict:
      "FlowState gives you the accountability of Focusmate on-demand 24/7 without the awkwardness of turning on a webcam with strangers. With an instant AI coach and browser-level tab blocking, you stay locked in wherever you are.",
  },
  trello: {
    slug: "trello",
    name: "Trello",
    category: "Kanban Board & Visual Management",
    tagline: "Visual board, list, and card workflow tracking",
    whatItDoesWell:
      "Trello made Kanban accessible to everyone with its tactile drag-and-drop cards, colorful labels, and intuitive board layouts for assignments and team projects.",
    coreLimitation:
      "Kanban boards are planning tools, not focus tools. Moving a card to 'In Progress' doesn't stop Reddit, TikTok, or YouTube from consuming your study time. There is no session timer, site blocker, or streak discipline tracker.",
    hasWebsiteBlocker: "No (Visual board with zero distraction controls)",
    flowStateBlocker: "Yes (Automated tab blocker & focus timer)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Zero blocking capability)",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No",
        flowstate: "Yes (Proactive guidance for tough assignments)",
      },
      {
        feature: "Deep Work Session Timer",
        competitor: "No (Requires Power-Ups)",
        flowstate: "Yes (Built-in OLED focus timer)",
      },
      {
        feature: "Focus Optimization",
        competitor: "Project planning & team handoffs",
        flowstate: "Individual high-intensity cognitive execution",
      },
      {
        feature: "Consistency Tracking",
        competitor: "No streak analytics",
        flowstate: "Yes (Daily discipline heatmap & streak saver)",
      },
    ],
    whyStudentsSwitch: [
      "Cards stay in 'Doing' column for days due to online distractions",
      "Spending too much time arranging boards instead of working",
      "Lack of integrated Pomodoro timer and site blocker",
      "No assistance when hitting study road blocks",
    ],
    verdict:
      "Trello is great for visualizing group project stages, but it does nothing to protect your focus during solitary study. FlowState gives students a battle-tested daily focus blueprint paired with a hard website blocker.",
  },
  asana: {
    slug: "asana",
    name: "Asana",
    category: "Enterprise Project Management",
    tagline: "Collaborative project orchestration and timeline management",
    whatItDoesWell:
      "Asana is an industry leader for corporate teams, providing Gantt charts, workload balancing, sprint milestones, and complex multi-department task dependencies.",
    coreLimitation:
      "For individual students and deep workers, Asana is extreme overkill. Its heavy interface creates administrative fatigue, and it possesses zero capabilities to stop digital distractions or cultivate daily study streaks.",
    hasWebsiteBlocker: "No (Enterprise software without focus controls)",
    flowStateBlocker: "Yes (Designed for distraction-free execution)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No",
        flowstate: "Yes (Hard browser extension blocker)",
      },
      {
        feature: "Complexity & Overhead",
        competitor: "High (Enterprise boards, sub-tasks & milestones)",
        flowstate: "Minimal (3 daily high-impact focus blocks)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No (Enterprise summaries only)",
        flowstate: "Yes (Real-time student discipline coach)",
      },
      {
        feature: "Execution Focus",
        competitor: "Corporate project coordination",
        flowstate: "Solo deep work and study consistency",
      },
      {
        feature: "Affordability for Students",
        competitor: "Expensive enterprise pricing tiers",
        flowstate: "Built specifically for students & deep workers",
      },
    ],
    whyStudentsSwitch: [
      "Overwhelmed by corporate project management clutter",
      "No mechanism to prevent browsing social media during study sessions",
      "Complex setups that take hours to maintain",
      "Need a tool built for solo execution, not company syncs",
    ],
    verdict:
      "Students don't need enterprise project management software; they need to sit down and finish their coursework. FlowState eliminates the clutter and provides real-time distraction protection and psychological coaching.",
  },
  toggl: {
    slug: "toggl",
    name: "Toggl Track",
    category: "Time Tracking & Billable Hours",
    tagline: "Frictionless time tracking and client billing reports",
    whatItDoesWell:
      "Toggl Track offers one of the best time-tracking interfaces with one-click timers, tag organization, and comprehensive client billing summaries for freelancers and agencies.",
    coreLimitation:
      "Toggl simply tracks elapsed time. Starting a timer does not prevent you from switching tabs to Instagram Reels. It provides no blocking, no task sequencing, and no AI intervention when you drift off task.",
    hasWebsiteBlocker: "No (Passive time recorder)",
    flowStateBlocker: "Yes (Enforces uninterrupted deep work)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Records time spent, but doesn't block)",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No",
        flowstate: "Yes (Intervenes before you procrastinate)",
      },
      {
        feature: "Actionable Blueprint",
        competitor: "Time logs and timesheets",
        flowstate: "Structured daily focus blueprints",
      },
      {
        feature: "Educational Allowlist",
        competitor: "No",
        flowstate: "Yes (Watch lectures safely without dopamine traps)",
      },
      {
        feature: "Discipline Protection",
        competitor: "Passive charts",
        flowstate: "Active streak saver & discipline heatmap",
      },
    ],
    whyStudentsSwitch: [
      "Forgetting to stop timers or timing sessions where you ended up scrolling",
      "Realizing that counting hours doesn't make you more focused",
      "Needing a strict blocker to shut down algorithmic video rabbit holes",
      "Desiring AI help to structure difficult study days",
    ],
    verdict:
      "Toggl is built for freelancers tracking client hours, not for students trying to conquer procrastination. FlowState combines a focus timer with a strict website blocker and AI coach to protect your hours, not just count them.",
  },
  clockify: {
    slug: "clockify",
    name: "Clockify",
    category: "Timesheet & Hours Tracker",
    tagline: "Free timesheets and team attendance tracking",
    whatItDoesWell:
      "Clockify is popular because of its generous free tier for tracking work hours, generating timesheets, and auditing team productivity across projects.",
    coreLimitation:
      "Like other timesheet tools, Clockify is passive. It records how long a task took, but has no tools to defend your cognitive focus from algorithms engineered to distract you.",
    hasWebsiteBlocker: "No (Timesheet logger with zero blocking)",
    flowStateBlocker: "Yes (Closes distracting feeds automatically)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Zero site blocking)",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "AI Discipline Coach",
        competitor: "No",
        flowstate: "Yes (24/7 cognitive reframing partner)",
      },
      {
        feature: "Daily Planning System",
        competitor: "Retroactive timesheet entries",
        flowstate: "Proactive 90-minute daily blueprint",
      },
      {
        feature: "Student Deep Work Workflow",
        competitor: "Geared towards payroll & client billing",
        flowstate: "Tailored for exam prep and deep focus",
      },
      {
        feature: "Distraction Defense",
        competitor: "None",
        flowstate: "Built-in smart allowlist for research",
      },
    ],
    whyStudentsSwitch: [
      "Clockify feels like logging hours for a corporate boss",
      "No tab blocking or protection against compulsive browsing",
      "Zero coaching or guidance when motivation drops",
      "Wanting an inspiring OLED focus environment",
    ],
    verdict:
      "Tracking your time without blocking distractions is like measuring a leak without patching the pipe. FlowState stops digital leaks at the browser level and helps students build unbreakable daily consistency.",
  },
  habitica: {
    slug: "habitica",
    name: "Habitica",
    category: "Gamified Habit Tracker & RPG",
    tagline: "Gamified productivity with 8-bit avatars and quests",
    whatItDoesWell:
      "Habitica successfully incorporates retro RPG elements—health points, gold, gear, pets, and boss fights—into everyday habit formation.",
    coreLimitation:
      "Gamification wears off quickly or becomes a distraction itself as users spend time micromanaging equipment and party chats. Furthermore, in-game penalties don't physically stop you from doomscrolling when willpower is low.",
    hasWebsiteBlocker: "No (RPG game layer without browser protection)",
    flowStateBlocker: "Yes (Hard browser extension enforcement)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Doesn't block any websites)",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "Distraction Risk",
        competitor: "High (Micromanaging pet gear and party chat)",
        flowstate: "Zero (Clean OLED interface optimized for deep work)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No (Static game rules only)",
        flowstate: "Yes (Adaptive AI discipline coaching)",
      },
      {
        feature: "Focus Protocol",
        competitor: "Daily task check-boxes",
        flowstate: "High-leverage 90-minute study sessions",
      },
      {
        feature: "Willpower Support",
        competitor: "Losing 5 virtual HP when procrastinating",
        flowstate: "Physical tab block & psychological reframing",
      },
    ],
    whyStudentsSwitch: [
      "Spending 30 minutes managing 8-bit equipment instead of studying",
      "In-game HP loss doesn't stop the impulse to watch TikTok",
      "Outgrowing novelty gamification and needing serious focus tools",
      "Need for a hard browser blocker during study hours",
    ],
    verdict:
      "Pixel art rewards can't compete with the multi-billion-dollar recommendation algorithms of YouTube and TikTok. FlowState uses hard browser enforcement and cognitive reframing from an AI coach for genuine deep work.",
  },
  "notion-calendar": {
    slug: "notion-calendar",
    name: "Notion Calendar",
    category: "Modern Calendar & Time Blocking",
    tagline: "Sleek time-blocking calendar integrated with Notion",
    whatItDoesWell:
      "Notion Calendar (formerly Cron) provides an exceptionally fast, minimalist calendar interface with global menu bar access and direct bi-directional sync to Notion databases.",
    coreLimitation:
      "Placing a 2-hour 'Study Bio' block on a calendar is easy; executing it when notifications ping and YouTube is one click away is where students fail. Notion Calendar offers no tab restrictions or focus enforcement.",
    hasWebsiteBlocker: "No (Calendar scheduling without tab control)",
    flowStateBlocker: "Yes (Enforces focus during scheduled blocks)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No",
        flowstate: "Yes (Guides you through procrastination blocks)",
      },
      {
        feature: "Execution System",
        competitor: "Event time-slots on a calendar grid",
        flowstate: "Structured daily focus blueprints + timer",
      },
      {
        feature: "Context-Aware Allowlist",
        competitor: "No",
        flowstate: "Yes (Allows lecture videos, blocks feeds)",
      },
      {
        feature: "Discipline Consistency",
        competitor: "Passive calendar entries",
        flowstate: "Discipline heatmap & streak protection",
      },
    ],
    whyStudentsSwitch: [
      "Calendar looks pretty, but study blocks constantly get eaten by scrolling",
      "No active mechanism to bridge planning and actual execution",
      "Having to switch between a calendar, timer, and separate blockers",
      "Lack of real-time AI coaching when struggling with difficult course material",
    ],
    verdict:
      "Time-blocking on a calendar is only step one. FlowState turns your scheduled blueprint into an airtight focus zone by blocking distracting feeds and keeping you accountable with an AI discipline coach.",
  },
  "google-calendar": {
    slug: "google-calendar",
    name: "Google Calendar",
    category: "Digital Calendar & Event Scheduling",
    tagline: "Universal calendar scheduling and event management",
    whatItDoesWell:
      "Google Calendar is the undisputed standard for scheduling lectures, exams, appointments, and syncs across every device and platform effortlessly.",
    coreLimitation:
      "A calendar grid has no teeth. It cannot keep you from opening distracting websites during an assigned study slot, nor does it provide psychological intervention when procrastination strikes.",
    hasWebsiteBlocker: "No (Pure calendar with zero blocking)",
    flowStateBlocker: "Yes (Physical browser-level feed blocking)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Zero tab blocking)",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No",
        flowstate: "Yes (Proactive guidance for tough assignments)",
      },
      {
        feature: "Deep Focus Workspace",
        competitor: "Event scheduling grid",
        flowstate: "All-in-one focus dashboard with Pomodoro & blueprint",
      },
      {
        feature: "Distraction Protection",
        competitor: "Passive notification reminders",
        flowstate: "Active browser extension tab enforcement",
      },
      {
        feature: "Streak Tracking",
        competitor: "None",
        flowstate: "Consistency heatmap & streak saver",
      },
    ],
    whyStudentsSwitch: [
      "Ignoring calendar notifications and continuing to browse social media",
      "Realizing a calendar schedules your day, but doesn't protect your attention",
      "Needing a strict blocker during scheduled study hours",
      "Wanting an AI coach to keep you on track throughout the day",
    ],
    verdict:
      "Google Calendar manages your schedule, but FlowState manages your focus. Use Google Calendar for your timetable, and enter FlowState when it's time to actually do the hard cognitive work.",
  },
  forest: {
    slug: "forest",
    name: "Forest",
    category: "Gamified Mobile Focus Timer",
    tagline: "Grow virtual trees to stay off your smartphone",
    whatItDoesWell:
      "Forest is a beloved mobile app that turns staying off your phone into growing a virtual forest. If you leave the app, your tree withers and dies.",
    coreLimitation:
      "Forest is primarily designed for smartphones. For students studying on laptops and desktops, Forest's desktop presence is minimal, easily bypassed, and cannot handle complex desktop workflows like watching a university lecture while blocking YouTube Shorts.",
    hasWebsiteBlocker: "Mobile App Only (Easily bypassed on desktop)",
    flowStateBlocker: "Yes (Desktop-grade browser extension)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "Mobile-centric (Weak desktop extension)",
        flowstate: "Yes (Hard browser extension for desktop)",
      },
      {
        feature: "Context-Aware Allowlist",
        competitor: "No (Blocks whole sites or none)",
        flowstate: "Yes (Allows lecture videos, kills Shorts & feeds)",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No",
        flowstate: "Yes (Real-time student discipline coach)",
      },
      {
        feature: "Daily Planning System",
        competitor: "Timer only",
        flowstate: "Structured daily focus blueprints",
      },
      {
        feature: "Discipline Protocol",
        competitor: "Gamified virtual trees",
        flowstate: "System-driven consistency & streak protection",
      },
    ],
    whyStudentsSwitch: [
      "Forest only keeps you off your phone; your laptop browser remains full of distractions",
      "Trees die if you need to quickly look up something for your essay",
      "No support for complex research tasks requiring specific allowed URLs",
      "Desire for an integrated AI coach and daily task blueprint",
    ],
    verdict:
      "While growing virtual trees on your phone is cute, serious academic work happens on a computer with a browser full of distractions. FlowState provides desktop-grade browser blocking, an AI coach, and high-intensity Pomodoro workflows.",
  },
  pomofocus: {
    slug: "pomofocus",
    name: "Pomofocus",
    category: "Web-Based Pomodoro Timer",
    tagline: "Clean, zero-install 25/5 Pomodoro timer in your browser",
    whatItDoesWell:
      "Pomofocus offers instant simplicity. You navigate to the site and immediately get a clean 25-minute countdown timer with custom alarm sounds and basic task lists.",
    coreLimitation:
      "Pomofocus has zero blocking power. The moment a 25-minute timer starts, a student can still open a new tab and watch YouTube Shorts for 40 minutes while the timer rings silently in the background.",
    hasWebsiteBlocker: "No (Stopwatch timer without blocking)",
    flowStateBlocker: "Yes (Locks down distracting tabs during sessions)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "No (Zero blocking capability)",
        flowstate: "Yes (Hard blocker for Shorts, Reels & Reddit)",
      },
      {
        feature: "Distraction Defense",
        competitor: "None (Timer rings in background while scrolling)",
        flowstate: "Hard tab closure & real-time blocker",
      },
      {
        feature: "AI Discipline Coach",
        competitor: "No",
        flowstate: "Yes (Cognitive reframing & motivation)",
      },
      {
        feature: "Daily Focus Blueprint",
        competitor: "Simple scratchpad checklist",
        flowstate: "Prioritized 90-minute deep work blocks",
      },
      {
        feature: "Streak Tracking",
        competitor: "Local browser storage counter",
        flowstate: "Cloud-synced discipline heatmap & streak saver",
      },
    ],
    whyStudentsSwitch: [
      "Starting a Pomodoro timer and immediately opening Twitter in another tab",
      "No consequences for abandoning sessions",
      "No AI support when struggling with difficult assignments",
      "Wanting a complete focus operating system rather than just a clock",
    ],
    verdict:
      "A timer without a blocker is just a stopwatch. FlowState pairs customizable deep focus intervals with hard browser tab blocking and an AI coach to ensure you actually work during your work intervals.",
  },
  "cold-turkey": {
    slug: "cold-turkey",
    name: "Cold Turkey",
    category: "Strict Desktop System Blocker",
    tagline: "Nuclear-level desktop website and application blocker",
    whatItDoesWell:
      "Cold Turkey is legendary for its strict desktop blocking capabilities. Once you start a locked block, you cannot turn it off, change system settings, or uninstall it until the timer expires.",
    coreLimitation:
      "Cold Turkey is excessively rigid and blunt. If you need to watch a 2-hour university lecture on YouTube or access Reddit for an engineering problem, Cold Turkey's blanket domain block shuts down your legitimate workflow, forcing students to uninstall or disable it entirely.",
    hasWebsiteBlocker: "Yes (Rigid / Blanket domain blocks only)",
    flowStateBlocker: "Yes (Smart allowlist & feeds blocker)",
    keyFeatures: [
      {
        feature: "Website & Feed Blocker",
        competitor: "Yes (Nuclear blanket block on entire domains)",
        flowstate: "Yes (Precision allowlist: permits lectures, kills Shorts)",
      },
      {
        feature: "Educational Video Support",
        competitor: "Blocks all of YouTube completely",
        flowstate: "Allows lectures & tutorials while killing Shorts feed",
      },
      {
        feature: "AI Accountability Coach",
        competitor: "No",
        flowstate: "Yes (Real-time student discipline coach)",
      },
      {
        feature: "Integrated Focus Workspace",
        competitor: "Desktop background utility only",
        flowstate: "Complete dashboard with timer & blueprint",
      },
      {
        feature: "Workflow Flexibility",
        competitor: "Zero flexibility (forces complete lockout)",
        flowstate: "Flexible deep work blocks with streak protection",
      },
    ],
    whyStudentsSwitch: [
      "Cold Turkey blocked YouTube entirely when they legitimately needed to watch a class lecture",
      "No daily focus blueprint or priority planning",
      "No AI coaching or psychological support when encountering study roadblocks",
      "Rigid lockout model often causes users to abandon the software",
    ],
    verdict:
      "Cold Turkey treats the entire web like a toxic wasteland. FlowState offers smart contextual blocking: allowlisting educational videos and documentation while slamming the door on hyper-distracting feeds like Shorts and Reels, backed by an AI accountability coach.",
  },
};

export function getCompetitor(slug: string): CompetitorComparison | undefined {
  return COMPETITORS_DATA[slug as CompetitorSlug];
}

export function getAllCompetitors(): CompetitorComparison[] {
  return COMPETITOR_SLUGS.map((slug) => COMPETITORS_DATA[slug]);
}
