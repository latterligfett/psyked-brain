/**
 * PSYKED — Brain Viewer + Interaction
 * Stack: Three.js r162 (CDN via importmap) — no build tools
 */

import * as THREE from 'three';
import { GLTFLoader }      from 'three/addons/loaders/GLTFLoader.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { DRACOLoader }     from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader }      from 'three/addons/loaders/RGBELoader.js';

// ═══════════════════════════════════════════════════════════
// REGION DATA
// ═══════════════════════════════════════════════════════════

const REGIONS = {
  prefrontal: {
    id: 'prefrontal',
    name: 'Prefrontal Cortex',
    abbr: 'PFC',
    badge: 'Willpower & Focus',
    role: 'Willpower, discipline, planning, and impulse control.',
    performance: 'Drives consistency, resists giving up, and makes smart decisions under pressure.',
    protocols: [
      { label: 'Cold exposure', detail: '2–3 min cold shower — activates PFC, suppresses amygdala' },
      { label: 'Meditation', detail: '10 min/day — thickens PFC gray matter over time' },
      { label: 'Limit decision fatigue', detail: 'Batch decisions, simplify daily choices' },
      { label: 'Sleep 7–9h', detail: 'PFC is the most sleep-sensitive region in the brain' },
      { label: 'Progressive overload mindset', detail: 'Treat discipline like a muscle — train it daily' },
    ],
    researchSummary: 'The prefrontal cortex is the brain\'s executive command center, directly governing planning, impulse control, and decision-making under pressure — and reviews confirm it is the region most sensitive to sleep deprivation, with measurable cognitive decline after a single poor night. Deliberate cognitive training and consistent high-quality sleep are the two strongest evidence-based levers for strengthening prefrontal executive performance.',
    topPapers: [
      { title: 'The role of prefrontal cortex in cognitive control and executive function', authors: 'Friedman et al.', year: 2022, pmid: '34408280', url: 'https://pubmed.ncbi.nlm.nih.gov/34408280/' },
      { title: 'Executive Dysfunction and the Prefrontal Cortex', authors: 'Jones et al.', year: 2021, pmid: '34881727', url: 'https://pubmed.ncbi.nlm.nih.gov/34881727/' },
      { title: 'Effects of sleep deprivation on cognition', authors: 'Killgore', year: 2010, pmid: '21075236', url: 'https://pubmed.ncbi.nlm.nih.gov/21075236/' },
    ],

  recommendedBooks: [
    { title: "Atomic Habits", author: "James Clear", year: 2018, asin: "0735211299", url: "https://www.amazon.com/dp/0735211299/?tag=psyked20-20", why: "The definitive guide to building the consistent routines that the PFC governs" },
    { title: "Willpower: Rediscovering the Greatest Human Strength", author: "Roy Baumeister & John Tierney", year: 2011, asin: "1594203075", url: "https://www.amazon.com/dp/1594203075/?tag=psyked20-20", why: "Deep dive into ego depletion and PFC-driven self-control research" },
    { title: "The Organized Mind", author: "Daniel Levitin", year: 2014, asin: "0525954187", url: "https://www.amazon.com/dp/0525954187/?tag=psyked20-20", why: "Neuroscience of decision fatigue and how to protect PFC resources" }
  ],
  supplements: [
    { title: "Omega-3 Fish Oil 2000mg", author: "Nature Made", url: "https://www.amazon.com/dp/B00CQ2LB5Q?tag=psyked20-20", why: "DHA structurally supports prefrontal neural density" },
  ],
  },
  amygdala: {
    id: 'amygdala',
    name: 'Amygdala',
    abbr: '',
    badge: 'Stress & Fear Response',
    role: 'Threat detection, stress response, and fear processing.',
    performance: 'Controls fight-or-flight. Overtrained = anxiety & burnout. Undertrained = recklessness.',
    protocols: [
      { label: 'Box breathing (4-4-4-4)', detail: 'Directly calms amygdala activation within minutes' },
      { label: 'Progressive exposure', detail: 'Do hard things repeatedly to rewire your fear response' },
      { label: 'Limit chronic stress', detail: 'Elevated cortisol literally shrinks the amygdala over time' },
      { label: 'Journaling', detail: 'Externalizes threats, reducing the amygdala\'s processing load' },
      { label: 'Cold/heat contrast', detail: 'Trains stress inoculation and emotional resilience' },
    ],
    researchSummary: 'The amygdala encodes emotionally charged memories with heightened precision, meaning stress and fear experiences are deeply imprinted and shape future threat responses. Research shows chronic stress structurally remodels the amygdala over time, while aerobic exercise and stress-inoculation training can shift its reactivity from impulsive fear toward controlled, adaptive performance.',
    topPapers: [
      { title: 'Stress, memory and the amygdala', authors: 'Roozendaal et al.', year: 2009, pmid: '19469026', url: 'https://pubmed.ncbi.nlm.nih.gov/19469026/' },
      { title: 'Neurobiology of emotional trauma', authors: 'Giotakos', year: 2020, pmid: '32840220', url: 'https://pubmed.ncbi.nlm.nih.gov/32840220/' },
      { title: 'Exercise effects on depression: Possible neural mechanisms', authors: 'Gujral et al.', year: 2017, pmid: '29122145', url: 'https://pubmed.ncbi.nlm.nih.gov/29122145/' },
    ],

  recommendedBooks: [
    { title: "Why Zebras Don't Get Ulcers", author: "Robert Sapolsky", year: 2004, asin: "0805073698", url: "https://www.amazon.com/dp/0805073698/?tag=psyked20-20", why: "The gold standard on stress biology \u2014 amygdala, cortisol, and chronic activation" },
    { title: "The Body Keeps the Score", author: "Bessel van der Kolk", year: 2014, asin: "0143127748", url: "https://www.amazon.com/dp/0143127748/?tag=psyked20-20", why: "How amygdala trauma and fear memories are encoded \u2014 and how to rewire them" },
    { title: "Emotional Intelligence", author: "Daniel Goleman", year: 1995, asin: "055338371X", url: "https://www.amazon.com/dp/055338371X/?tag=psyked20-20", why: "The amygdala hijack concept and emotional regulation under pressure" }
  ],
  supplements: [
    { title: "Magnesium Glycinate", author: "Pure Encapsulations", url: "https://www.amazon.com/dp/B00G8G4EH0?tag=psyked20-20", why: "Clinically shown to reduce amygdala stress reactivity and anxiety" },
  ],
  },
  hippocampus: {
    id: 'hippocampus',
    name: 'Hippocampus',
    abbr: '',
    badge: 'Learning & Memory',
    role: 'Memory formation, learning, and spatial navigation.',
    performance: 'Determines how fast you learn new skills, retain coaching, and adapt tactics.',
    protocols: [
      { label: 'Aerobic exercise', detail: 'Biggest driver of hippocampal neurogenesis via BDNF' },
      { label: 'REM sleep', detail: 'Memory consolidation occurs primarily here during deep sleep' },
      { label: 'Omega-3s (DHA)', detail: 'Structural building block of hippocampal neurons' },
      { label: 'Novel learning', detail: 'New skills, routes, and challenges stimulate hippocampal growth' },
      { label: 'Avoid chronic alcohol', detail: 'Directly and measurably shrinks the hippocampus' },
    ],
    researchSummary: 'Sleep is the hippocampus\'s most powerful optimization window — during NREM sleep, memory traces are replayed and consolidated, transferring newly learned skills from short-term into long-term storage. Aerobic exercise is the single strongest driver of hippocampal neurogenesis, directly growing the region responsible for learning speed, tactical retention, and adaptive thinking.',
    topPapers: [
      { title: 'About sleep\'s role in memory', authors: 'Rasch et al.', year: 2013, pmid: '23589831', url: 'https://pubmed.ncbi.nlm.nih.gov/23589831/' },
      { title: 'Mechanisms of systems memory consolidation during sleep', authors: 'Klinzing et al.', year: 2019, pmid: '31451802', url: 'https://pubmed.ncbi.nlm.nih.gov/31451802/' },
      { title: 'Sleep — A brain-state serving systems memory consolidation', authors: 'Brodt et al.', year: 2023, pmid: '37023710', url: 'https://pubmed.ncbi.nlm.nih.gov/37023710/' },
    ],

  recommendedBooks: [
    { title: "Make It Stick: The Science of Successful Learning", author: "Brown, Roediger & McDaniel", year: 2014, asin: "0674729013", url: "https://www.amazon.com/dp/0674729013/?tag=psyked20-20", why: "Evidence-based encoding strategies \u2014 spaced repetition, retrieval practice, hippocampal consolidation" },
    { title: "Remember: The Science of Memory and the Art of Forgetting", author: "Lisa Genova", year: 2021, asin: "1984879065", url: "https://www.amazon.com/dp/1984879065/?tag=psyked20-20", why: "Clear-headed guide to how the hippocampus builds, stores, and loses memories" },
    { title: "A Mind for Numbers", author: "Barbara Oakley", year: 2014, asin: "039916524X", url: "https://www.amazon.com/dp/039916524X/?tag=psyked20-20", why: "How to work with \u2014 not against \u2014 hippocampal learning cycles" }
  ],
  supplements: [
    { title: "Lion's Mane Mushroom", author: "Host Defense", url: "https://www.amazon.com/dp/B00DXOIKM0?tag=psyked20-20", why: "NGF stimulation — directly drives hippocampal neurogenesis" },
    { title: "Omega-3 Fish Oil 2000mg", author: "Nature Made", url: "https://www.amazon.com/dp/B00CQ2LB5Q?tag=psyked20-20", why: "DHA is the key structural lipid in hippocampal neurons" },
  ],
  },
  cerebellum: {
    id: 'cerebellum',
    name: 'Cerebellum',
    abbr: '',
    badge: 'Motor & Skill',
    role: 'Motor coordination, balance, timing, and muscle memory.',
    performance: 'Controls technical skill, movement efficiency, and athletic precision.',
    protocols: [
      { label: 'Deliberate practice', detail: 'With feedback — cerebellum encodes movement patterns' },
      { label: 'Proprioception training', detail: 'Balance boards, single-leg work, unstable surfaces' },
      { label: 'Visualization', detail: 'Cerebellum activates during mental rehearsal — use it' },
      { label: 'Cross-training', detail: 'Skill variety builds richer, more transferable motor maps' },
      { label: 'Adequate rest', detail: 'Motor consolidation window requires recovery between sessions' },
    ],
    researchSummary: 'The cerebellum is the precision engine of motor learning, housing roughly 80% of the brain\'s neurons in a structure dedicated to encoding movement timing, coordination, and balance with high fidelity. Reviews confirm that deliberate practice with real-time feedback is the primary mechanism for cerebellar motor map refinement, and that mental rehearsal activates the same cerebellar circuits as physical practice.',
    topPapers: [
      { title: 'The human cerebellum: a review of physiologic neuroanatomy', authors: 'Roostaei et al.', year: 2014, pmid: '25439284', url: 'https://pubmed.ncbi.nlm.nih.gov/25439284/' },
      { title: 'Functional Neuroanatomy for Posture and Gait Control', authors: 'Takakusaki', year: 2017, pmid: '28122432', url: 'https://pubmed.ncbi.nlm.nih.gov/28122432/' },
      { title: 'Upper and lower motor neuron neurophysiology and motor control', authors: 'de Carvalho et al.', year: 2023, pmid: '37562869', url: 'https://pubmed.ncbi.nlm.nih.gov/37562869/' },
    ],

  recommendedBooks: [
    { title: "The Talent Code", author: "Daniel Coyle", year: 2009, asin: "055380684X", url: "https://www.amazon.com/dp/055380684X/?tag=psyked20-20", why: "Deep practice, myelin, and cerebellar skill encoding \u2014 essential for athletes" },
    { title: "Peak: Secrets from the New Science of Expertise", author: "Anders Ericsson", year: 2016, asin: "0544947223", url: "https://www.amazon.com/dp/0544947223/?tag=psyked20-20", why: "Deliberate practice theory directly tied to cerebellar motor learning research" },
    { title: "Bounce: The Myth of Talent and the Power of Practice", author: "Matthew Syed", year: 2010, asin: "0007350546", url: "https://www.amazon.com/dp/0007350546/?tag=psyked20-20", why: "How repetition builds cerebellar automaticity \u2014 the science of elite performance" }
  ],
  supplements: [],
  },
  acc: {
    id: 'acc',
    name: 'Anterior Cingulate Cortex',
    abbr: 'ACC',
    badge: 'Pain & Effort',
    role: 'Error detection, motivation, pain tolerance, and effort allocation.',
    performance: 'Pushes through discomfort and keeps focus under fatigue — your mental grit.',
    protocols: [
      { label: 'High-intensity training', detail: 'Trains the ACC to override pain signals repeatedly' },
      { label: 'Mindfulness practice', detail: 'Increases ACC thickness and improves attention regulation' },
      { label: 'Goal-setting rituals', detail: 'Activates the ACC before demanding tasks' },
      { label: 'Caffeine (200–400mg)', detail: 'Boosts ACC activity and reduces perceived effort' },
      { label: 'Iron levels', detail: 'ACC is sensitive to iron deficiency — get your bloods checked' },
    ],
    researchSummary: 'The anterior cingulate cortex sits at the intersection of pain processing, effort allocation, and motivational control — it\'s the region that determines whether you push through discomfort or back off. Research shows the ACC is directly modulated by mindfulness training and repeated high-intensity exposure, making it a trainable "grit circuit" that governs mental toughness under fatigue.',
    topPapers: [
      { title: 'Emotion, motivation, decision-making, the orbitofrontal cortex, anterior cingulate cortex, and the amygdala', authors: 'Rolls', year: 2023, pmid: '37178232', url: 'https://pubmed.ncbi.nlm.nih.gov/37178232/' },
      { title: 'The anatomy of pain and suffering in the brain and its clinical implications', authors: 'De Ridder et al.', year: 2021, pmid: '34411559', url: 'https://pubmed.ncbi.nlm.nih.gov/34411559/' },
    ],

  recommendedBooks: [
    { title: "Can't Hurt Me", author: "David Goggins", year: 2018, asin: "1544512279", url: "https://www.amazon.com/dp/1544512279/?tag=psyked20-20", why: "First-person account of overriding ACC pain signals \u2014 the 40% rule" },
    { title: "Endure: Mind, Body, and the Curiously Elastic Limits of Human Performance", author: "Alex Hutchinson", year: 2018, asin: "0062499238", url: "https://www.amazon.com/dp/0062499238/?tag=psyked20-20", why: "Science of effort perception and the ACC's role in physical performance limits" },
    { title: "Grit: The Power of Passion and Perseverance", author: "Angela Duckworth", year: 2016, asin: "1501111116", url: "https://www.amazon.com/dp/1501111116/?tag=psyked20-20", why: "ACC-driven effort persistence and what separates finishers from quitters" }
  ],
  supplements: [],
  },
  brainstem: {
    id: 'brainstem',
    name: 'Brain Stem',
    abbr: 'Upper Neck Region',
    badge: 'Autonomic Foundation',
    role: 'Autonomic control: heart rate, breathing, sleep cycles, and posture signals.',
    performance: 'The foundation of everything — recovery, stress regulation, and energy.',
    protocols: [
      { label: 'Nasal breathing', detail: 'Activates parasympathetic nervous system via brain stem' },
      { label: 'Neck mobility work', detail: 'Poor posture compresses brain stem arterial blood flow' },
      { label: 'Consistent sleep schedule', detail: 'Anchors circadian rhythm at the brain stem level' },
      { label: 'Magnesium glycinate', detail: '300mg before bed — supports brain stem sleep regulation' },
      { label: 'Diaphragmatic breathing', detail: 'Directly interfaces with vagus nerve (brain stem output)' },
    ],
    researchSummary: 'The brainstem is the master regulator of autonomic functions — controlling heart rate, breathing, sleep architecture, and the stress response — forming the physiological foundation that every other brain region depends on for recovery and performance. Heart rate variability (HRV), a direct measure of brainstem-mediated vagal tone, is now established as one of the best biomarkers of recovery capacity and resilience to stress.',
    topPapers: [
      { title: 'Neural regulation of endocrine and autonomic stress responses', authors: 'Ulrich-Lai et al.', year: 2009, pmid: '19469025', url: 'https://pubmed.ncbi.nlm.nih.gov/19469025/' },
      { title: 'Physiology and Pathophysiology of the Autonomic Nervous System', authors: 'Benarroch', year: 2020, pmid: '31996619', url: 'https://pubmed.ncbi.nlm.nih.gov/31996619/' },
      { title: 'A meta-analysis of heart rate variability and neuroimaging studies: implications for heart rate variability as a marker of stress and health', authors: 'Thayer et al.', year: 2012, pmid: '22178086', url: 'https://pubmed.ncbi.nlm.nih.gov/22178086/' },
    ],

  recommendedBooks: [
    { title: "Why We Sleep", author: "Matthew Walker", year: 2017, asin: "1501144316", url: "https://www.amazon.com/dp/1501144316/?tag=psyked20-20", why: "The most important sleep book ever written \u2014 brainstem sleep regulation, performance, and recovery" },
    { title: "Breath: The New Science of a Lost Art", author: "James Nestor", year: 2020, asin: "0735213615", url: "https://www.amazon.com/dp/0735213615/?tag=psyked20-20", why: "How breathing mechanics interface directly with brainstem autonomic control" },
    { title: "The Vagus Nerve Advantage", author: "Navaz Habib", year: 2019, asin: "1592339816", url: "https://www.amazon.com/dp/1592339816/?tag=psyked20-20", why: "Practical guide to brainstem-vagus nerve activation for recovery and resilience" }
  ],
  supplements: [
    { title: "Magnesium Glycinate", author: "Pure Encapsulations", url: "https://www.amazon.com/dp/B00G8G4EH0?tag=psyked20-20", why: "Supports brainstem sleep cycle regulation and deep recovery" },
    { title: "Manta Sleep Mask", author: "Manta", url: "https://www.amazon.com/dp/B07FNZRZ9G?tag=psyked20-20", why: "Complete blackout — maximises brainstem melatonin production" },
  ],
  },
  basalganglia: {
    id: 'basalganglia',
    name: 'Basal Ganglia',
    abbr: '',
    badge: 'Habits & Dopamine',
    role: 'Habit formation, reward circuits, and movement initiation.',
    performance: 'Automates good habits, drives motivation, and manages your dopamine response.',
    protocols: [
      { label: 'Habit stacking', detail: 'Leverages existing basal ganglia circuits for new behaviors' },
      { label: 'Reward timing', detail: 'Celebrate immediately after the desired behavior to anchor it' },
      { label: 'Dopamine management', detail: 'Avoid cheap dopamine (scrolling, junk food) before training' },
      { label: 'Consistent schedule', detail: 'Basal ganglia thrives on predictable, repeated routines' },
      { label: 'Protein + tyrosine foods', detail: 'Eggs, chicken, almonds — direct dopamine precursors' },
    ],
    researchSummary: 'The basal ganglia are the brain\'s habit automation system, encoding repeated behaviors into dopamine-driven circuits that eventually run without conscious effort or cognitive load. Reviews confirm the cortico-basal ganglia circuit is central to motor skill learning and habit formation, with dopamine acting as the key signal that locks beneficial behaviors into permanent, effortless routines.',
    topPapers: [
      { title: 'Cortico-basal ganglia plasticity in motor learning', authors: 'Roth et al.', year: 2024, pmid: '39002543', url: 'https://pubmed.ncbi.nlm.nih.gov/39002543/' },
      { title: 'The basal ganglia and motor control', authors: 'Groenewegen', year: 2003, pmid: '14640312', url: 'https://pubmed.ncbi.nlm.nih.gov/14640312/' },
      { title: 'The reward circuit: linking primate anatomy and human imaging', authors: 'Haber et al.', year: 2010, pmid: '19812543', url: 'https://pubmed.ncbi.nlm.nih.gov/19812543/' },
    ],

  recommendedBooks: [
    { title: "The Power of Habit", author: "Charles Duhigg", year: 2012, asin: "081298160X", url: "https://www.amazon.com/dp/081298160X/?tag=psyked20-20", why: "The basal ganglia habit loop \u2014 cue, routine, reward \u2014 explained with real science" },
    { title: "Dopamine Nation", author: "Anna Lembke", year: 2021, asin: "1524746746", url: "https://www.amazon.com/dp/1524746746/?tag=psyked20-20", why: "Stanford psychiatrist's guide to dopamine balance \u2014 basal ganglia reward circuits" },
    { title: "Atomic Habits", author: "James Clear", year: 2018, asin: "0735211299", url: "https://www.amazon.com/dp/0735211299/?tag=psyked20-20", why: "Implementation guide for engineering basal ganglia habit loops" }
  ],
  supplements: [],
  },
  temporal: {
    id: 'temporal',
    name: 'Temporal Lobe',
    abbr: '',
    badge: 'Language & Auditory',
    role: 'Language processing, auditory perception, and long-term memory storage.',
    performance: 'Governs how you absorb coaching, communicate under pressure, and store skill knowledge long-term.',
    protocols: [
      { label: 'Active listening', detail: 'Deliberate focus during coaching sharpens temporal lobe encoding' },
      { label: 'Music & rhythm training', detail: 'Musical practice strengthens auditory cortex and motor timing' },
      { label: 'Verbal rehearsal', detail: 'Talking through plays or tactics deepens procedural memory' },
      { label: 'Audiobooks & podcasts', detail: 'Passive learning primes temporal association areas' },
      { label: 'Social interaction', detail: 'Conversation is the richest temporal lobe workout available' },
    ],
    researchSummary: 'The medial temporal lobe — including the hippocampus and surrounding cortex — is essential for declarative memory, storing the conscious knowledge base of facts, events, and learned strategies that underpin skilled performance. Long-term skill knowledge, coaching insights, and tactical understanding are encoded and retrieved through this region, making temporal lobe health a direct determinant of how efficiently you learn and retain new information.',
    topPapers: [
      { title: 'The medial temporal lobe', authors: 'Squire et al.', year: 2004, pmid: '15217334', url: 'https://pubmed.ncbi.nlm.nih.gov/15217334/' },
      { title: 'The neurobiology of semantic memory', authors: 'Binder et al.', year: 2011, pmid: '22001867', url: 'https://pubmed.ncbi.nlm.nih.gov/22001867/' },
      { title: 'How Can Hearing Loss Cause Dementia?', authors: 'Griffiths et al.', year: 2020, pmid: '32871106', url: 'https://pubmed.ncbi.nlm.nih.gov/32871106/' },
    ],

  recommendedBooks: [
    { title: "The Brain: The Story of You", author: "David Eagleman", year: 2015, asin: "0307950166", url: "https://www.amazon.com/dp/0307950166/?tag=psyked20-20", why: "Accessible neuroscience covering temporal lobe language and memory systems" },
    { title: "This Is Your Brain on Music", author: "Daniel Levitin", year: 2006, asin: "0452288525", url: "https://www.amazon.com/dp/0452288525/?tag=psyked20-20", why: "How the temporal auditory cortex processes rhythm, melody, and athletic timing" },
    { title: "Remember: The Science of Memory and the Art of Forgetting", author: "Lisa Genova", year: 2021, asin: "1984879065", url: "https://www.amazon.com/dp/1984879065/?tag=psyked20-20", why: "Temporal lobe's role in long-term memory consolidation and recall" }
  ],
  supplements: [],
  },
  thalamus: {
    id: 'thalamus',
    name: 'Thalamus',
    abbr: '',
    badge: 'Sensory Gateway',
    role: 'Central relay station routing all sensory signals to the correct cortical areas.',
    performance: 'Controls what you pay attention to, filters noise, and regulates the sleep-wake cycle — the gatekeeper of performance.',
    protocols: [
      { label: 'Sleep quality over quantity', detail: 'Thalamic gating during deep sleep clears sensory backlog' },
      { label: 'Sensory training', detail: 'Vision, hearing, and proprioception drills sharpen thalamic relay speed' },
      { label: 'Caffeine timing', detail: 'Caffeine blocks thalamic adenosine receptors — time it to your peak window' },
      { label: 'Mindfulness', detail: 'Trains top-down thalamic filtering — choose where attention lands' },
      { label: 'Limit sensory overload', detail: 'Noisy, cluttered environments tax thalamic filtering capacity' },
    ],
    researchSummary: 'The thalamus acts as the brain\'s central relay hub, routing all sensory information to the appropriate cortical areas and gating conscious awareness through selective filtering — making it the ultimate arbiter of what you pay attention to. Sleep spindles, generated in the thalamus during NREM sleep, are now recognized as a key mechanism for memory consolidation and neural repair, directly linking sleep quality to next-day cognitive and physical performance.',
    topPapers: [
      { title: 'Control of sleep and wakefulness', authors: 'Brown et al.', year: 2012, pmid: '22811426', url: 'https://pubmed.ncbi.nlm.nih.gov/22811426/' },
      { title: 'Sleep Spindles: Mechanisms and Functions', authors: 'Fernandez et al.', year: 2020, pmid: '31804897', url: 'https://pubmed.ncbi.nlm.nih.gov/31804897/' },
      { title: 'Hypothalamic regulation of sleep and circadian rhythms', authors: 'Saper et al.', year: 2005, pmid: '16251950', url: 'https://pubmed.ncbi.nlm.nih.gov/16251950/' },
    ],

  recommendedBooks: [
    { title: "Stolen Focus: Why You Can't Pay Attention", author: "Johann Hari", year: 2022, asin: "0593138511", url: "https://www.amazon.com/dp/0593138511/?tag=psyked20-20", why: "How thalamic attention filtering is disrupted by modern tech \u2014 and how to reclaim it" },
    { title: "Why We Sleep", author: "Matthew Walker", year: 2017, asin: "1501144316", url: "https://www.amazon.com/dp/1501144316/?tag=psyked20-20", why: "Thalamic sleep spindles and their role in memory consolidation during NREM" },
    { title: "Hyperfocus: How to Be More Productive in a World of Distraction", author: "Chris Bailey", year: 2018, asin: "0525522018", url: "https://www.amazon.com/dp/0525522018/?tag=psyked20-20", why: "Practical thalamic attention management \u2014 directing the sensory gateway intentionally" }
  ],
  supplements: [
    { title: "Magnesium Glycinate", author: "Pure Encapsulations", url: "https://www.amazon.com/dp/B00G8G4EH0?tag=psyked20-20", why: "Supports thalamic deep sleep restoration and NREM quality" },
    { title: "Manta Sleep Mask", author: "Manta", url: "https://www.amazon.com/dp/B07FNZRZ9G?tag=psyked20-20", why: "Complete blackout — protects thalamic melatonin gating" },
  ],
  },
  ventricles: {
    id: 'ventricles',
    name: 'Ventricular System',
    abbr: 'Systema Ventriculare',
    badge: 'Brain Fluid Cavities',
    role: 'Systema Ventriculare — Brain fluid cavities — Probably not performance-relevant tissue.',
    performance: 'These hollow chambers produce and circulate cerebrospinal fluid (CSF), which cushions and nourishes the brain. No neurons here — not directly linked to performance training protocols.',
    protocols: [
      { label: 'Note', detail: 'The ventricular system contains cerebrospinal fluid (CSF), not brain tissue. It is shown here for anatomical completeness.' },
    ],
  },
  ofc: {
    id: 'ofc',
    name: 'Orbitofrontal Cortex',
    abbr: 'OFC',
    badge: 'Reward & Decision',
    role: 'The Orbitofrontal Cortex sits at the base of the frontal lobe, directly above the eye sockets. It integrates emotion, reward, and sensory input to guide real-time decision-making.',
    performance: 'The OFC is your internal value calculator — it weighs risk vs. reward in milliseconds and determines whether you follow impulse or strategy. High-performers with a well-trained OFC make better decisions under pressure, resist short-term temptation, and stay motivated through delayed rewards.',
    protocols: [
      { label: 'Delay gratification practice', detail: 'Regularly choosing long-term over short-term rewards physically strengthens OFC circuitry' },
      { label: 'Emotional labeling', detail: 'Naming emotions before decisions reduces OFC-amygdala noise — "I notice I\'m frustrated"' },
      { label: 'Decision journaling', detail: 'Reviewing past decisions trains the OFC to detect reward/risk patterns more accurately' },
      { label: 'Reduce decision fatigue', detail: 'The OFC degrades under cognitive load — protect it with routines and simplification' },
      { label: 'Omega-3s (EPA/DHA)', detail: 'OFC gray matter density is directly linked to omega-3 status — 2g/day minimum' },
    ],
    researchSummary: 'The orbitofrontal cortex integrates signals from the amygdala, sensory cortices, and reward pathways to compute subjective value — making it the hub of impulse control and reward-based decision-making. Damage or chronic stress to the OFC reliably produces impulsive, short-sighted choices. High-level athletes and elite performers show measurably greater OFC activation during pressure situations, reflecting superior reward evaluation and emotional regulation under load.',
    topPapers: [
      { title: 'The orbitofrontal cortex and beyond: from affect to decision-making', authors: 'Kringelbach', year: 2005, pmid: '15957003', url: 'https://pubmed.ncbi.nlm.nih.gov/15957003/' },
      { title: 'Orbitofrontal cortex and its contribution to decision-making', authors: 'Wallis', year: 2007, pmid: '17376236', url: 'https://pubmed.ncbi.nlm.nih.gov/17376236/' },
      { title: 'The role of the orbitofrontal cortex in emotion, reward, and decision-making', authors: 'Rolls', year: 2004, pmid: '15196320', url: 'https://pubmed.ncbi.nlm.nih.gov/15196320/' },
    ],
    recommendedBooks: [
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', year: 2011, asin: '0374533555', url: 'https://www.amazon.com/dp/0374533555/?tag=psyked20-20', why: 'The dual-system model — OFC sits at the intersection of System 1 (fast, emotional) and System 2 (slow, deliberate)' },
      { title: 'The Willpower Instinct', author: 'Kelly McGonigal', year: 2011, asin: '1583334386', url: 'https://www.amazon.com/dp/1583334386/?tag=psyked20-20', why: 'Stanford course on impulse control — directly trains OFC reward evaluation circuits' },
      { title: 'Dopamine Nation', author: 'Anna Lembke', year: 2021, asin: '1524746746', url: 'https://www.amazon.com/dp/1524746746/?tag=psyked20-20', why: 'How modern dopamine overload corrupts OFC reward calibration — and how to reset it' },
    ],
    supplements: [
      { title: 'Nordic Naturals Ultimate Omega', author: 'Nordic Naturals', url: 'https://www.amazon.com/dp/B001LF39S8/?tag=psyked20-20', why: 'High-dose EPA/DHA — OFC gray matter density directly linked to omega-3 status' },
    ],
  },
  fusiform: {
    id: 'fusiform',
    name: 'Fusiform Gyrus',
    abbr: 'FG',
    badge: 'Face & Pattern Recognition',
    role: 'The Fusiform Gyrus runs along the bottom surface of the temporal and occipital lobes. It is the brain\'s dedicated engine for recognising faces, objects, words, and patterns at high speed.',
    performance: 'Pattern recognition at elite level is fusiform performance. Athletes reading the field, traders scanning charts, and executives speed-reading body language all rely on fusiform processing speed. The "fusiform face area" activates within 170ms of seeing a face — faster than conscious thought.',
    protocols: [
      { label: 'Speed reading practice', detail: 'Word-shape recognition trains the visual word form area of the fusiform gyrus' },
      { label: 'Face-name association drills', detail: 'Deliberately linking faces to names strengthens fusiform-hippocampal pathways' },
      { label: 'Pattern recognition training', detail: 'Chess, sport film review, tactical analysis — all directly train fusiform circuits' },
      { label: 'Drawing and visual art', detail: 'Active visual processing (not passive viewing) builds fusiform detail encoding' },
      { label: 'Omega-3s + B12', detail: 'Myelination of the temporal-occipital visual pathways depends on these nutrients' },
    ],
    researchSummary: 'The fusiform gyrus, particularly the fusiform face area (FFA), is one of the most specialised cortical regions — showing selective activation for faces, objects of expertise, and written words. Expert performance in any domain with strong visual pattern demands (sport, chess, surgery) is associated with enhanced fusiform activation and faster recognition latency. Training domain-specific visual pattern recognition produces measurable increases in fusiform grey matter density.',
    topPapers: [
      { title: 'The fusiform face area: a module in human extrastriate cortex specialized for face perception', authors: 'Kanwisher et al.', year: 1997, pmid: '9151747', url: 'https://pubmed.ncbi.nlm.nih.gov/9151747/' },
      { title: 'Expertise for cars and birds recruits brain areas involved in face recognition', authors: 'Gauthier et al.', year: 2000, pmid: '10700147', url: 'https://pubmed.ncbi.nlm.nih.gov/10700147/' },
      { title: 'The visual word form area: expertise for reading in the fusiform gyrus', authors: 'McCandliss et al.', year: 2003, pmid: '12880704', url: 'https://pubmed.ncbi.nlm.nih.gov/12880704/' },
    ],
    recommendedBooks: [
      { title: 'The Tell: The Little Clues That Reveal Big Truths About Who We Are', author: 'Matthew Hertenstein', year: 2013, asin: '0465032079', url: 'https://www.amazon.com/dp/0465032079/?tag=psyked20-20', why: 'How the fusiform face area reads micro-expressions and body language — trainable skill' },
      { title: 'Incognito: The Secret Lives of the Brain', author: 'David Eagleman', year: 2011, asin: '0307389928', url: 'https://www.amazon.com/dp/0307389928/?tag=psyked20-20', why: 'Covers how unconscious visual processing (fusiform) operates below conscious awareness' },
      { title: 'The Art of Learning', author: 'Josh Waitzkin', year: 2007, asin: '0743277465', url: 'https://www.amazon.com/dp/0743277465/?tag=psyked20-20', why: 'Chess champion on pattern mastery — direct account of training fusiform expert recognition' },
    ],
    supplements: [],
  },
  occipital: {
    id: 'occipital',
    name: 'Occipital Lobe',
    abbr: 'OL',
    badge: 'The Visual Cortex',
    role: 'The Occipital Lobe is the brain\'s dedicated visual processing center — located at the very back of the skull.',
    performance: 'Elite performance is visual performance. The occipital lobe processes 80% of sensory input — from reading the field in sport, to pattern recognition in decision-making. Training visual acuity, contrast tracking, and mental imagery all run through here.',
    protocols: [
      { label: 'Vision training', detail: 'Tracking drills, contrast sensitivity work — directly improves occipital throughput' },
      { label: 'Mental imagery / visualization', detail: 'Activates the visual cortex as strongly as real perception — use it daily' },
      { label: 'Screen breaks (20-20-20)', detail: 'Every 20 min, look 20m away for 20s — reduces occipital fatigue' },
      { label: 'Lutein & Zeaxanthin', detail: 'Nutrients that protect visual cortex neurons — found in leafy greens and eggs' },
      { label: 'Sleep for visual memory', detail: 'The occipital lobe consolidates visual patterns during REM sleep' },
    ],
  },
  overview: {
    id: 'overview',
    name: 'Brain Overview',
    abbr: '',
    badge: 'The Full System',
    role: 'Your brain is 2% of your body weight — but uses 20% of your energy.',
    performance: 'Every performance outcome — focus, recovery, skill, grit — is ultimately a brain output.',
    protocols: [
      { label: 'Click any brain region', detail: 'To explore specific protocols for that area' },
      { label: 'Sleep is non-negotiable', detail: '7–9h repairs every region simultaneously' },
      { label: 'Exercise is medicine', detail: 'The single best intervention across all 7 regions' },
      { label: 'Stress is a dial, not a switch', detail: 'Train your stress response — don\'t just manage it' },
      { label: 'Get the full protocol guide', detail: '35 protocols, one per brain region, delivered to your inbox' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// MESH → REGION MAPPING
// ═══════════════════════════════════════════════════════════

function getMeshRegion(name) {
  // Normalise: lowercase + replace underscores with spaces so all checks
  // work regardless of whether the GLB uses "left orbital gyrus" or "left_orbital_gyrus"
  const n = name.toLowerCase().replace(/_/g, ' ');

  // ── Orbitofrontal Cortex (OFC) ────────────────────────────
  // orbital gyri — underside of the frontal lobe, one per hemisphere
  if (n.includes('orbital gyrus'))
    return REGIONS.ofc;

  // ── Prefrontal Cortex ─────────────────────────────────────
  // frontal gyri (inferior/middle/superior/precentral)
  if (n.includes('frontal') || n.includes('precentral'))
    return REGIONS.prefrontal;

  // ── Hippocampus ───────────────────────────────────────────
  if (n.includes('hippocampus') || n.includes('hippocamp') ||
      n.includes('parahippocamp') || n.includes('fornix') ||
      n.includes('commissure'))
    return REGIONS.hippocampus;

  // ── Amygdala ──────────────────────────────────────────────
  if (n.includes('amygdal') || n.includes('basal ganglion of telencephalon'))
    return REGIONS.amygdala;

  // ── Temporal Lobe ─────────────────────────────────────────
  if (n.includes('temporal') || n.includes('fusiform'))
    return REGIONS.temporal;

  // ── Cerebellum ────────────────────────────────────────────
  if (n.includes('cerebell'))
    return REGIONS.cerebellum;

  // ── Fusiform Gyrus ────────────────────────────────────────
  // segment 006 (left) and 007 (right) confirmed by geometry to be fusiform
  // handle both "segment of cerebral hemisphere.006" and "segment of cerebral hemisphere006"
  if (n.includes('segment of cerebral hemisphere') &&
      (n.endsWith('006') || n.endsWith('.006')))
    return REGIONS.fusiform;
  if (n.includes('segment of cerebral hemisphere') &&
      (n.endsWith('007') || n.endsWith('.007')))
    return REGIONS.fusiform;

  // ── Left Occipital Lobe ───────────────────────────────────
  // segment 008 confirmed by geometry to mirror 'right occipital lobe' exactly
  if (n.includes('segment of cerebral hemisphere') &&
      (n.endsWith('008') || n.endsWith('.008')))
    return REGIONS.occipital;

  // ── Anterior Cingulate Cortex (ACC) / Parietal ────────────
  // cingulate gyrus, corpus callosum, parietal cortices,
  // postcentral gyrus, supramarginal, angular, insula
  // (Note: segment-of-cerebral-hemisphere NNN meshes that don't match
  // fusiform (006/007) or occipital (008) are intentionally handled by
  // specific rules above — no catch-all here to avoid priority conflicts)
  if (n.includes('cingulate') || n.includes('corpus callosum') ||
      n.includes('postcentral') || n.includes('parietal') ||
      n.includes('supramarginal') || n.includes('angular gyrus') ||
      n.includes('insula'))
    return REGIONS.acc;

  // ── Brain Stem ────────────────────────────────────────────
  // pons, medulla oblongata, midbrain, colliculi, cardinal segments
  if (n.includes('brain stem') || n.includes('brainstem') ||
      n.includes('medulla') || n.includes('medull') ||
      n.includes('pons') || n.includes('midbrain') ||
      n.includes('hindbrain') || n.includes('cardinal') ||
      n.includes('collicul'))
    return REGIONS.brainstem;

  // ── Thalamus ──────────────────────────────────────────────
  if (n.includes('geniculate') || n.includes('thalamus') ||
      n.includes('stria medullaris'))
    return REGIONS.thalamus;

  // ── Basal Ganglia ─────────────────────────────────────────
  if (n.includes('internal gray matter') || n.includes('basal') ||
      n.includes('ganglia') || n.includes('caudate') ||
      n.includes('putamen'))
    return REGIONS.basalganglia;

  // ── Occipital lobe ────────────────────────────────────────
  if (n.includes('occipital'))
    return REGIONS.occipital;

  // Ventricular system → fluid cavities, not performance tissue
  if (n.includes('ventricular') || n.includes('ventricle'))
    return REGIONS.ventricles;

  return null;
}

// ═══════════════════════════════════════════════════════════
// DOM REFS
// ═══════════════════════════════════════════════════════════

const canvas        = document.getElementById('brainCanvas');
const loader        = document.getElementById('loader');
const brainHint     = document.getElementById('brainHint');
const hoverLabel    = document.getElementById('hoverLabel');
const sidePanel     = document.getElementById('sidePanel');
const panelContent  = document.getElementById('panelContent');
const panelClose    = document.getElementById('panelClose');
const panelOverlay  = document.getElementById('panelOverlay');
const regionsGrid   = document.getElementById('regionsGrid');

// ═══════════════════════════════════════════════════════════
// THREE.JS SETUP
// ═══════════════════════════════════════════════════════════

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.set(0, 0.05, 2.8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// TrackballControls — free 3D rotation on all axes (no locked up-vector)
const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed          = 2.5;
controls.zoomSpeed            = 1.2;
controls.panSpeed             = 0.0;   // no panning
controls.noZoom               = false;
controls.noPan                = true;
controls.staticMoving         = false; // false = momentum preserved on release
controls.dynamicDampingFactor = 0.05;  // low = long spin-out; high = quick stop
controls.minDistance          = 1.0;
controls.maxDistance          = 6.0;

// No auto-tumble — momentum comes purely from the user's last drag velocity.
// Fast flick → keeps spinning. Slow drag to a stop → stays still.

// Suppress context menu on canvas
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// ═══════════════════════════════════════════════════════════
// AXES HELPER (modeling reference — remove for production)
// ═══════════════════════════════════════════════════════════

const axesHelper = new THREE.AxesHelper(1.0); // 1 unit arms: red=X, green=Y, blue=Z
scene.add(axesHelper);

// HTML labels for each axis tip
const axisLabels = (() => {
  const specs = [
    { id: 'axis-x', text: 'X', color: '#ff4444', pos: new THREE.Vector3(1.05, 0, 0) },
    { id: 'axis-y', text: 'Y', color: '#44ff44', pos: new THREE.Vector3(0, 1.05, 0) },
    { id: 'axis-z', text: 'Z', color: '#4488ff', pos: new THREE.Vector3(0, 0, 1.05) },
  ];
  return specs.map(({ id, text, color, pos }) => {
    const el = document.createElement('div');
    el.id = id;
    el.textContent = text;
    Object.assign(el.style, {
      position:   'fixed',
      pointerEvents: 'none',
      fontFamily: 'Space Grotesk, Inter, sans-serif',
      fontWeight: '700',
      fontSize:   '13px',
      color,
      textShadow: '0 0 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)',
      zIndex:     '50',
      transform:  'translate(-50%, -50%)',
    });
    document.body.appendChild(el);
    return { el, pos };
  });
})();

// ═══════════════════════════════════════════════════════════
// REGION LETTER LABELS (modeling reference)
// ═══════════════════════════════════════════════════════════

// Capital letter prefix per region (no duplicates)
const REGION_LETTER = {
  prefrontal:   'P',
  amygdala:     'A',
  hippocampus:  'H',
  cerebellum:   'C',
  acc:          'G',   // Grit / cingulate
  brainstem:    'B',
  basalganglia: 'D',   // Dopamine
  temporal:     'T',
  thalamus:     'S',   // Sensory
  ventricles:   'V',
  occipital:    'O',
  ofc:          'R',   // Reward / OFC
  fusiform:     'F',
};

// Region label system — labels stored in LOCAL model space so they
// rotate with the brain. Each frame we recompute world pos and push
// the label slightly toward the camera so it sits on the visible surface.

const regionCentroids   = {};   // regionId → THREE.Vector3 sum (world, temp)
const regionMeshCounts  = {};   // regionId → mesh count
const regionLabelEls    = {};   // regionId → { el, localPos }
let   modelRef          = null; // reference to loaded GLTF model root

function initRegionLabels() {
  if (!modelRef) return;

  // Step 1 — accumulate world-space centroids
  brainMeshes.forEach(mesh => {
    const region = getMeshRegion(mesh.name);
    if (!region) return;
    const id = region.id;
    mesh.geometry.computeBoundingBox();
    const c = new THREE.Vector3();
    mesh.geometry.boundingBox.getCenter(c);
    c.applyMatrix4(mesh.matrixWorld);
    if (!regionCentroids[id]) { regionCentroids[id] = c.clone(); regionMeshCounts[id] = 1; }
    else { regionCentroids[id].add(c); regionMeshCounts[id]++; }
  });

  // Step 2 — convert world centroid → model LOCAL space so labels rotate with model
  const invModel = new THREE.Matrix4().copy(modelRef.matrixWorld).invert();

  // Short display names for label boxes
  const REGION_SHORT = {
    prefrontal:   'PFC',
    amygdala:     'Amygdala',
    hippocampus:  'Hippocampus',
    cerebellum:   'Cerebellum',
    acc:          'ACC',
    brainstem:    'Brain Stem',
    basalganglia: 'Basal Ganglia',
    temporal:     'Temporal',
    thalamus:     'Thalamus',
    ventricles:   'Ventricles',
    occipital:    'Occipital',
    ofc:          'OFC',
    fusiform:     'Fusiform',
  };

  Object.entries(regionCentroids).forEach(([id, sumVec]) => {
    const worldCentroid = sumVec.divideScalar(regionMeshCounts[id]);
    const localPos = worldCentroid.clone().applyMatrix4(invModel);

    const letter    = REGION_LETTER[id] || id[0].toUpperCase();
    const shortName = REGION_SHORT[id]  || id;
    const el = document.createElement('div');
    el.dataset.letter    = letter;
    el.dataset.shortName = shortName;
    el.textContent = letter; // default: letter-only mode
    Object.assign(el.style, {
      position:      'fixed',
      pointerEvents: 'none',
      fontFamily:    'Space Grotesk, Inter, sans-serif',
      fontWeight:    '700',
      fontSize:      '11px',
      color:         '#ffffff',
      background:    'rgba(0,0,0,0.65)',
      border:        '1px solid rgba(255,255,255,0.30)',
      borderRadius:  '4px',
      padding:       '2px 7px',
      lineHeight:    '1.6',
      letterSpacing: '0.04em',
      whiteSpace:    'nowrap',
      textShadow:    '0 0 4px rgba(0,0,0,0.9)',
      zIndex:        '49',
      transform:     'translate(-50%, -50%)',
      transition:    'opacity 0.15s',
    });
    document.body.appendChild(el);
    regionLabelEls[id] = { el, localPos, letter, shortName };
  });
}

function updateRegionLabels() {
  if (!modelRef || !Object.keys(regionLabelEls).length) return;
  const w   = renderer.domElement.clientWidth;
  const h   = renderer.domElement.clientHeight;
  const mw  = modelRef.matrixWorld;
  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir); // unit vector pointing INTO the scene from camera

  // Brain world-space center (used for back-face culling hemisphere test)
  const brainCenter = new THREE.Vector3().setFromMatrixPosition(mw);

  Object.values(regionLabelEls).forEach(({ el, localPos }) => {
    // Convert label's local position → world space (rotates with the model)
    const worldPos = localPos.clone().applyMatrix4(mw);

    // ── Back-face cull ──────────────────────────────────────
    // Direction from brain center to the label centroid
    const toLabel = worldPos.clone().sub(brainCenter).normalize();
    // If this direction is more-or-less aligned with the camera look direction,
    // the centroid is on the far side of the brain → hide it.
    // dot > 0.15 means the label is behind the "equator" from the camera's view.
    if (toLabel.dot(camDir) > 0.15) {
      el.style.display = 'none';
      return;
    }

    // ── Nudge toward camera ─────────────────────────────────
    // camDir points INTO the scene, so subtract to move toward camera.
    worldPos.addScaledVector(camDir, -0.12);

    // ── Project to screen ───────────────────────────────────
    const v = worldPos.clone().project(camera);
    // NDC z: -1 = near plane, +1 = far plane; outside that = behind camera or clipped
    if (v.z < -1.0 || v.z > 1.0) {
      el.style.display = 'none';
      return;
    }

    el.style.display = labelMode === 2 ? 'none' : 'block';
    el.style.left    = `${( v.x * 0.5 + 0.5) * w}px`;
    el.style.top     = `${(-v.y * 0.5 + 0.5) * h}px`;
  });
}

// Call this each frame to keep labels in sync with camera
function updateAxisLabels() {
  if (!axesVisible) return; // toolbar toggle
  const w = renderer.domElement.clientWidth;
  const h = renderer.domElement.clientHeight;
  const v = new THREE.Vector3();
  axisLabels.forEach(({ el, pos }) => {
    v.copy(pos).project(camera);
    const x = ( v.x * 0.5 + 0.5) * w;
    const y = (-v.y * 0.5 + 0.5) * h;
    el.style.display = v.z > 1 ? 'none' : 'block';
    el.style.left = `${x}px`;
    el.style.top  = `${y}px`;
  });
}

// Lights
// Hemisphere: warm sky above, cool ground below — simulates ambient occlusion
const hemiLight = new THREE.HemisphereLight(0xFFE8D6, 0x1A2A4A, 0.6);
scene.add(hemiLight);

// Key light: warm, slightly above — main illumination with soft shadows
const keyLight = new THREE.DirectionalLight(0xFFF5E8, 1.8);
keyLight.position.set(2, 4, 3);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far  = 20;
keyLight.shadow.bias = -0.0005;
scene.add(keyLight);

// Rim light: cool cyan from behind — gives depth and that "wet tissue" edge glow
const rimLight = new THREE.DirectionalLight(0x00D4FF, 1.2);
rimLight.position.set(-3, 1, -2);
scene.add(rimLight);

// Fill light: soft purple/blue from below — lifts shadows, adds mood
const fillLight = new THREE.DirectionalLight(0x8866FF, 0.5);
fillLight.position.set(0, -3, 2);
scene.add(fillLight);

// Back light: warm from behind-top — separates brain from background
const backLight = new THREE.DirectionalLight(0xFF9955, 0.4);
backLight.position.set(0, 2, -4);
scene.add(backLight);

// ═══════════════════════════════════════════════════════════
// MATERIAL MANAGEMENT
// ═══════════════════════════════════════════════════════════

const originalMaterials  = new Map(); // mesh uuid → original material
const brainMeshes        = [];
let   hoveredMesh        = null;
let   selectedMesh       = null;

const ACCENT_COLOR      = new THREE.Color(0x00D4FF);  // kept for UI elements
const NEUTRAL_COLOR     = new THREE.Color(0xB8C8E8);
const DIM_COLOR         = new THREE.Color(0xA84010);  // dimmed orange (not brown) for unselected
const SELECT_GLOW       = new THREE.Color(0xFF9933);  // warm orange glow for selected
const VENTRICLE_COLOR   = new THREE.Color(0x4A90C8); // CSF blue for ventricular system

// Per-region colors — palette derived from Psyked brand colors:
//   Brain orange #FF7020 · Accent cyan #00D4FF
//   Danger #FF4B6E · Success #00FFA3
// Per-region warm palette — all within the orange/amber/cream/peach family
const REGION_BASE_COLORS = {
  prefrontal:   new THREE.Color(0xFFBB55), // golden amber       — willpower/planning
  amygdala:     new THREE.Color(0xE05A18), // deep burnt orange  — threat/stress
  hippocampus:  new THREE.Color(0xFDD090), // pale warm cream    — memory/learning
  cerebellum:   new THREE.Color(0xF5E098), // light yellow-cream — motor/skill
  acc:          new THREE.Color(0xFF8C30), // bright orange      — effort/pain
  brainstem:    new THREE.Color(0xC46820), // dark amber         — autonomic/deep
  basalganglia: new THREE.Color(0xF0A840), // warm golden        — dopamine/reward
  temporal:     new THREE.Color(0xFFAA70), // peachy-orange      — language/sound
  thalamus:     new THREE.Color(0xE88840), // rich amber         — sensory relay
  ofc:          new THREE.Color(0xFF9933), // deep orange         — orbitofrontal/reward
  fusiform:     new THREE.Color(0xFFB347), // vivid tangerine    — facial/visual
  occipital:    new THREE.Color(0xFF7F50), // coral orange        — visual cortex
};

// Load studio HDRI for environment reflections (gives wet-tissue sheen)
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
new RGBELoader()
  .load(
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr',
    (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    },
    undefined,
    () => {
      // HDRI failed (CORS / offline) — silent fallback, no crash
      pmremGenerator.dispose();
    }
  );

function storeMaterial(mesh) {
  if (!originalMaterials.has(mesh.uuid)) {
    originalMaterials.set(mesh.uuid, mesh.material.clone());
  }
}

function resetMesh(mesh) {
  const orig = originalMaterials.get(mesh.uuid);
  if (!orig) return;
  mesh.material.color.copy(orig.color);
  mesh.material.emissive.set(0x000000);
  mesh.material.emissiveIntensity = 0;
  mesh.material.opacity = orig.opacity !== undefined ? orig.opacity : 1;
}

function highlightMesh(mesh, mode = 'hover') {
  if (!mesh.material) return;
  if (mode === 'hover') {
    // hover does nothing to color
  } else if (mode === 'select') {
    // Brighter shade of the same orange + subtle emissive glow
    mesh.material.color.set(new THREE.Color(0xFFAA40)); // bright warm orange
    mesh.material.emissive.set(new THREE.Color(0xFF6600));
    mesh.material.emissiveIntensity = 0.25;
  }
}

function dimMesh(mesh) {
  if (!mesh.material) return;
  mesh.material.color.copy(DIM_COLOR);
  mesh.material.emissive.set(0x000000);
  mesh.material.emissiveIntensity = 0;
}

// ═══════════════════════════════════════════════════════════
// GLB LOADER
// ═══════════════════════════════════════════════════════════

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://unpkg.com/three@0.162.0/examples/jsm/libs/draco/gltf/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  'public/brain_complete.glb',

  (gltf) => {
    const model = gltf.scene;

    // Center and scale
    const box    = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 1.6 / maxDim;

    model.scale.setScalar(scale);

    // Offset model so its geometric center sits exactly at the pivot's origin (0,0,0)
    // This ensures rotation always happens around the visual center, not an offset point
    model.position.set(
      -center.x * scale,
      -center.y * scale - 0.08,
      -center.z * scale
    );

    // Wrap in pivot group at world origin — rotate the pivot, not the model directly
    const pivot = new THREE.Group();
    pivot.add(model);
    scene.add(pivot);
    modelRef = pivot; // rotate pivot for keyboard controls; labels follow automatically

    // Collect meshes and prep materials
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow    = true;
        node.receiveShadow = true;

        // Ensure MeshStandardMaterial
        if (!node.material.isMeshStandardMaterial) {
          node.material = new THREE.MeshStandardMaterial({
            color: node.material.color || new THREE.Color(0xBFCCDD),
          });
        }

        const meshRegion = getMeshRegion(node.name);

        if (meshRegion === REGIONS.ventricles) {
          // CSF fluid — blue, semi-transparent
          node.material.color.set(VENTRICLE_COLOR);
          node.material.roughness         = 0.2;
          node.material.metalness         = 0.0;
          node.material.transparent       = true;
          node.material.opacity           = 0.72;
          node.material.envMapIntensity   = 1.2;
        } else {
          // Brain tissue — warm orange base, per-region tint within orange/cream palette
          const baseColor = new THREE.Color(0xFF7020);

          // Force both occipital meshes to exactly the same color, roughness, and envMap to eliminate any residual drift
          const nn = node.name.toLowerCase().replace(/_/g, ' ');
          if ((nn.includes('segment of cerebral hemisphere') && (nn.endsWith('008') || nn.endsWith('.008'))) ||
              nn.includes('right occipital lobe')) {
            const occColor = new THREE.Color(0xFF7F50);
            node.material.color.set(occColor);
            node.material.roughness = 0.30;
            node.material.envMapIntensity = 0.0; // no env map — eliminates angle-based sheen difference
          } else {
            node.material.color.set(baseColor);
            const regionColor = meshRegion ? REGION_BASE_COLORS[meshRegion.id] : null;
            if (regionColor) {
              node.material.color.lerp(regionColor, 0.85); // push even harder so region color dominates
            }
          }
          node.material.roughness         = 0.28; // lower roughness = more vivid, less brown
          node.material.metalness         = 0.0;
          node.material.transparent       = false;
          node.material.opacity           = 1.0;
          node.material.envMapIntensity   = 0.6;
        }

        storeMaterial(node);
        brainMeshes.push(node);
      }
    });

    console.log(`Brain loaded: ${brainMeshes.length} meshes`);
    logMeshNames();

    // Hide loader
    loader.classList.add('hidden');
    setTimeout(() => { loader.style.display = 'none'; }, 700);
  },

  (xhr) => {
    const pct = Math.round((xhr.loaded / xhr.total) * 100);
    const txt = document.querySelector('.loader-text');
    if (txt) txt.textContent = `Loading brain… ${pct}%`;
  },

  (err) => {
    console.error('GLB load error:', err);
    const txt = document.querySelector('.loader-text');
    if (txt) txt.textContent = 'Error loading model';
  }
);

function logMeshNames() {
  console.group('Brain mesh names (for mapping):');
  brainMeshes.forEach(m => console.log(m.name || '(unnamed)'));
  console.groupEnd();
}

// ═══════════════════════════════════════════════════════════
// RAYCASTING
// ═══════════════════════════════════════════════════════════

const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2(-9999, -9999);
let   panelOpen = false;

// Toolbar state — declared early so updateRegionLabels / updateAxisLabels can read them
let axesVisible = true;
// labelMode: 0 = letter only (default), 1 = full name, 2 = off
let labelMode = 0;

function getMouseNDC(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX ?? (event.touches?.[0]?.clientX ?? 0);
  const y = event.clientY ?? (event.touches?.[0]?.clientY ?? 0);
  mouse.x =  ((x - rect.left)  / rect.width)  * 2 - 1;
  mouse.y = -((y - rect.top)   / rect.height) * 2 + 1;
  return { x, y };
}

function hitTest() {
  if (!brainMeshes.length) return null;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(brainMeshes, false);
  return hits.length ? hits[0].object : null;
}

// ─── HOVER ──────────────────────────────────────────────────

canvas.addEventListener('mousemove', (e) => {
  const { x, y } = getMouseNDC(e);
  const hit = hitTest();

  if (hit !== hoveredMesh) {
    hoveredMesh = hit;

    if (hoveredMesh) {
      canvas.style.cursor = 'pointer';

      // Show hover label — just the region letter
      const region = getMeshRegion(hoveredMesh.name) || REGIONS.overview;
      hoverLabel.textContent = REGION_LETTER[region.id] || region.name;
      hoverLabel.style.left  = `${x + 14}px`;
      hoverLabel.style.top   = `${y - 28}px`;
      hoverLabel.classList.add('visible');
    } else {
      canvas.style.cursor = 'crosshair';
      hoverLabel.classList.remove('visible');
    }
  } else if (hoveredMesh) {
    // Track mouse position for label
    hoverLabel.style.left = `${x + 14}px`;
    hoverLabel.style.top  = `${y - 28}px`;
  }
});

canvas.addEventListener('mouseleave', () => {
  hoveredMesh = null;
  hoverLabel.classList.remove('visible');
});

// ─── CLICK (two-click to open panel) ────────────────────────
// First click  → highlight region + show name label
// Second click → open full panel
// Click elsewhere → deselect

let primedMesh = null; // mesh highlighted on first click, waiting for second

canvas.addEventListener('click', (e) => {
  getMouseNDC(e);
  const hit = hitTest();

  // 🔍 DEBUG: log every click
  if (hit) {
    const region = getMeshRegion(hit.name);
    console.log(`[CLICK] mesh="${hit.name}" → region="${region ? region.id : 'NULL (→ Brain Overview)'}"`)
  } else {
    console.log('[CLICK] no mesh hit (empty space)')
  }


  // Clicked empty space → clear primed selection
  if (!hit) {
    if (primedMesh) {
      resetMesh(primedMesh);
      primedMesh = null;
    }
    hoverLabel.classList.remove('visible');
    return;
  }

  const region = getMeshRegion(hit.name) || REGIONS.overview;

  if (hit === primedMesh) {
    // ── Second click on same mesh → open panel ──
    primedMesh = null;
    hoverLabel.classList.remove('visible');
    openPanel(region, hit);
    brainHint.classList.add('hidden');
  } else {
    // ── First click → highlight and show region name prominently ──
    // Reset previously primed mesh
    if (primedMesh && primedMesh !== selectedMesh) resetMesh(primedMesh);

    primedMesh = hit;
    // Reset all others to full orange — no dimming
    brainMeshes.forEach(m => { if (m !== hit) resetMesh(m); });
    highlightMesh(hit, 'select');

    // Show a persistent label centred on screen (not cursor-following)
    hoverLabel.textContent = region.name;
    hoverLabel.style.left  = `${e.clientX + 14}px`;
    hoverLabel.style.top   = `${e.clientY - 28}px`;
    hoverLabel.classList.add('visible');

    brainHint.classList.add('hidden');
  }
});

// Touch tap support
// Detect touch device — suppress hover label, adjust hint text
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (isTouchDevice) {
  hoverLabel.style.display = 'none';
  const hintP = brainHint?.querySelector('p');
  if (hintP && hintP.textContent.includes('hover')) {
    hintP.textContent = hintP.textContent.replace(/hover/gi, 'tap');
  }
}

let touchStartPos = null;
let touchStartTime = 0;

canvas.addEventListener('touchstart', (e) => {
  touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  touchStartTime = Date.now();
  // Don't call preventDefault here — let OrbitControls handle pinch/rotate
}, { passive: true });

canvas.addEventListener('touchend', (e) => {
  if (!touchStartPos) return;
  const dx = e.changedTouches[0].clientX - touchStartPos.x;
  const dy = e.changedTouches[0].clientY - touchStartPos.y;
  const dt = Date.now() - touchStartTime;
  // Only treat as tap if: moved < 8px AND held < 300ms (not a swipe/rotate)
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && dt < 300) {
    const touch = e.changedTouches[0];
    const rect  = canvas.getBoundingClientRect();
    mouse.x =  ((touch.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((touch.clientY - rect.top)  / rect.height) * 2 + 1;
    const hit = hitTest();

    if (!hit) {
      // Tapped empty space — clear primed
      if (primedMesh) { resetMesh(primedMesh); primedMesh = null; }
    } else {
      const region = getMeshRegion(hit.name) || REGIONS.overview;
      if (hit === primedMesh) {
        // Second tap → open panel
        primedMesh = null;
        openPanel(region, hit);
      } else {
        // First tap → highlight
        if (primedMesh && primedMesh !== selectedMesh) resetMesh(primedMesh);
        brainMeshes.forEach(m => { if (m !== hit) resetMesh(m); });
        highlightMesh(hit, 'hover');
        primedMesh = hit;
      }
      brainHint.classList.add('hidden');
    }
  }
  touchStartPos = null;
}, { passive: true });

// ═══════════════════════════════════════════════════════════
// PANEL
// ═══════════════════════════════════════════════════════════

function openPanel(region, mesh = null) {
  // Update selection
  if (selectedMesh) resetMesh(selectedMesh);
  selectedMesh = mesh;

  // Keep all orange, highlight selected only
  if (mesh) {
    brainMeshes.forEach(m => {
      if (m !== mesh) resetMesh(m);
    });
    highlightMesh(mesh, 'select');
  }

  // Dampen any residual spin when panel opens
  controls.dynamicDampingFactor = 0.25;

  // Render panel content
  panelContent.innerHTML = buildPanelHTML(region);

  // Open panel
  sidePanel.classList.add('open');
  sidePanel.setAttribute('aria-hidden', 'false');
  panelOverlay.classList.add('visible');
  panelOpen = true;
}

function closePanel() {
  sidePanel.classList.remove('open');
  sidePanel.setAttribute('aria-hidden', 'true');
  panelOverlay.classList.remove('visible');
  panelOpen = false;

  // Restore all meshes
  brainMeshes.forEach(m => resetMesh(m));
  selectedMesh = null;
  hoveredMesh  = null;

  // Restore normal momentum damping after panel closes
  setTimeout(() => { controls.dynamicDampingFactor = 0.05; }, 400);
}

panelClose.addEventListener('click', closePanel);
panelOverlay.addEventListener('click', closePanel);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && panelOpen) closePanel();
});

// Region ID → brain highlight image filename
const REGION_BRAIN_IMAGES = {
  prefrontal:   'brain_prefrontal.png',
  acc:          'brain_acc.png',
  basalganglia: 'brain_basalganglia.png',
  hippocampus:  'brain_hippocampus.png',
  temporal:     'brain_temporal.png',
  cerebellum:   'brain_cerebellum.png',
  amygdala:     'brain_amygdala.png',
  brainstem:    'brain_brainstem.png',
  thalamus:     'brain_thalamus.png',
};

function buildPanelHTML(region) {
  const protocols = region.protocols.map((p, i) => `
    <li class="protocol-item">
      <span class="protocol-num">${i + 1}</span>
      <span class="protocol-text"><strong>${p.label}</strong> — ${p.detail}</span>
    </li>
  `).join('');

  const brainImg = REGION_BRAIN_IMAGES[region.id];
  const brainImageHTML = brainImg ? `
    <div class="panel-brain-image-wrap">
      <img src="public/${brainImg}" alt="${region.name} highlighted in brain" class="panel-brain-image" loading="lazy" />
      <p class="panel-brain-image-caption">🟠 Orange = active region</p>
    </div>
  ` : '';

  return `
    <div class="panel-region-badge">${region.badge}</div>
    <h2 class="panel-region-name">${region.name}</h2>
    ${region.abbr ? `<p class="panel-region-abbr">${region.abbr}</p>` : ''}
    ${brainImageHTML}

    <div class="panel-section">
      <div class="panel-section-label">What it does</div>
      <p class="panel-section-text">${region.role}</p>
    </div>

    <div class="panel-section">
      <div class="panel-section-label">Performance link</div>
      <p class="panel-section-text">${region.performance}</p>
    </div>

    <p class="panel-protocols-title">Protocols</p>
    <ul class="protocol-list">
      ${protocols}
    </ul>

    ${region.researchSummary ? `
      <div class="panel-section panel-research">
        <div class="panel-section-label">📖 Research basis</div>
        <p class="panel-section-text">${region.researchSummary}</p>
        <ul class="research-papers-list">
          ${region.topPapers.map(p => `
            <li><a href="${p.url}" target="_blank" rel="noopener" class="paper-link">${p.title} — ${p.authors}, ${p.year}</a></li>
          `).join('')}
        </ul>
      </div>
    ` : ''}

    ${region.recommendedBooks && region.recommendedBooks.length ? `
      <div class="panel-section panel-books">
        <div class="panel-section-label">📚 Recommended reading</div>
        <ul class="books-list">
          ${region.recommendedBooks.map(b => `
            <li class="book-item">
              <a href="${b.url}" target="_blank" rel="noopener sponsored" class="book-link">
                <span class="book-title">${b.title}</span>
                <span class="book-author">${b.author}</span>
              </a>
            </li>
          `).join('')}
        </ul>
        <p class="books-disclosure">As an Amazon Associate I earn from qualifying purchases.</p>
      </div>
    ` : ''}

    ${region.supplements && region.supplements.length ? `
      <div class="panel-section panel-books">
        <div class="panel-section-label">💊 Supplements & tools</div>
        <ul class="books-list">
          ${region.supplements.map(s => `
            <li class="book-item">
              <a href="${s.url}" target="_blank" rel="noopener sponsored" class="book-link">
                <span class="book-title">${s.title}</span>
                <span class="book-author">${s.author} — ${s.why}</span>
              </a>
            </li>
          `).join('')}
        </ul>
        <p class="books-disclosure">As an Amazon Associate I earn from qualifying purchases.</p>
      </div>
    ` : ''}
  `;
}

// ═══════════════════════════════════════════════════════════
// REGION GRID (below fold)
// ═══════════════════════════════════════════════════════════

function buildRegionGrid() {
  const cards = Object.values(REGIONS)
    .filter(r => r.id !== 'overview' && r.id !== 'ventricles')
    .map((r, i) => `
      <div class="region-card" data-region="${r.id}" tabindex="0" role="button" aria-label="Learn about ${r.name}">
        <div class="card-number">0${i + 1}</div>
        <div class="card-name">${r.name}</div>
        <div class="card-role">${r.role}</div>
        <div class="card-tag">View protocols</div>
      </div>
    `).join('');

  regionsGrid.innerHTML = cards;

  // Click handlers for grid cards
  regionsGrid.querySelectorAll('.region-card').forEach(card => {
    const handler = () => {
      const region = REGIONS[card.dataset.region];
      if (region) openPanel(region, null);
      // Scroll back up to brain
      document.getElementById('brain-viewer').scrollIntoView({ behavior: 'smooth' });
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

buildRegionGrid();

// ═══════════════════════════════════════════════════════════
// VIEWER TOOLBAR TOGGLES
// ═══════════════════════════════════════════════════════════

const btnAxes   = document.getElementById('btnAxes');
const btnLabels = document.getElementById('btnLabels');

btnAxes?.addEventListener('click', () => {
  axesVisible = !axesVisible;
  btnAxes.classList.toggle('active', axesVisible);

  // Toggle Three.js axes helper
  axesHelper.visible = axesVisible;

  // Toggle HTML axis labels (X / Y / Z)
  axisLabels.forEach(({ el }) => {
    el.style.display = axesVisible ? 'block' : 'none';
  });
});

function applyLabelMode() {
  // Mode 0: letter only | Mode 1: full name | Mode 2: off
  const MODES = [
    { icon: 'A',   label: 'Letter', active: true  },
    { icon: 'Abc', label: 'Names',  active: true  },
    { icon: '—',   label: 'Labels', active: false },
  ];
  const m = MODES[labelMode];
  if (btnLabels) {
    btnLabels.querySelector('.toolbar-icon').textContent = m.icon;
    btnLabels.querySelector('.toolbar-label').textContent = m.label;
    btnLabels.classList.toggle('active', m.active);
  }

  Object.values(regionLabelEls).forEach(({ el, letter, shortName }) => {
    if (labelMode === 2) {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
      el.textContent = labelMode === 0 ? letter : shortName;
    }
  });
}

btnLabels?.addEventListener('click', () => {
  labelMode = (labelMode + 1) % 3;
  applyLabelMode();
});

// ═══════════════════════════════════════════════════════════
// EMAIL FORM
// ═══════════════════════════════════════════════════════════

document.getElementById('emailForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form    = e.target;
  const data    = new FormData(form);
  const success = document.getElementById('formSuccess');

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    });
    form.style.display    = 'none';
    success.style.display = 'flex';
  } catch {
    // Fallback: just show success (Netlify Forms handles on deploy)
    form.style.display    = 'none';
    success.style.display = 'flex';
  }
});

// ═══════════════════════════════════════════════════════════
// KEYBOARD ROTATION
// ═══════════════════════════════════════════════════════════

const keysDown = new Set();
const _xAxis   = new THREE.Vector3(1, 0, 0);  // tilt up/down
const _zAxis   = new THREE.Vector3(0, 0, 1);  // spin left/right (Z = superior axis)
// ── Keyboard rotation: model spins on its own local Z-axis ──
// 60 degrees/second, delta-time based, stops immediately on keyup
const MODEL_ROT_SPEED = (60 * Math.PI) / 180; // radians per second

// Z-axis (LEFT/RIGHT): -1 = counterclockwise, +1 = clockwise, 0 = stopped
let modelRotationDirZ = 0;
// X-axis (UP/DOWN):    -1 = forward (up key), +1 = backward (down key), 0 = stopped
let modelRotationDirX = 0;

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); e.stopPropagation(); modelRotationDirZ = -1; keysDown.add(e.key); }
  if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); modelRotationDirZ =  1; keysDown.add(e.key); }
  if (e.key === 'ArrowUp')    { e.preventDefault(); e.stopPropagation(); modelRotationDirX = -1; keysDown.add(e.key); }
  if (e.key === 'ArrowDown')  { e.preventDefault(); e.stopPropagation(); modelRotationDirX =  1; keysDown.add(e.key); }
}, { capture: true });

window.addEventListener('keyup', (e) => {
  keysDown.delete(e.key);
  if (e.key === 'ArrowLeft'  && modelRotationDirZ === -1) modelRotationDirZ = 0;
  if (e.key === 'ArrowRight' && modelRotationDirZ ===  1) modelRotationDirZ = 0;
  if (e.key === 'ArrowUp'    && modelRotationDirX === -1) modelRotationDirX = 0;
  if (e.key === 'ArrowDown'  && modelRotationDirX ===  1) modelRotationDirX = 0;
}, { capture: true });

// ═══════════════════════════════════════════════════════════
// RESIZE
// ═══════════════════════════════════════════════════════════

function onResize() {
  // Use visualViewport on mobile to get true visible area (excludes browser chrome)
  const w = window.visualViewport ? window.visualViewport.width  : window.innerWidth;
  const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

window.addEventListener('resize', onResize);
// Also listen to visualViewport resize (mobile URL bar show/hide)
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', onResize);
}

// ═══════════════════════════════════════════════════════════
// RENDER LOOP
// ═══════════════════════════════════════════════════════════

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // eslint-disable-line no-unused-vars

  controls.update();

  // ── Keyboard rotation ───────────────────────────────────────
  // All four arrows rotate the model on its own local axis (pivot = visual center)
  // LEFT/RIGHT → Z-axis  |  UP/DOWN → X-axis
  // 60°/s, delta-time based, stops immediately on keyup
  if (modelRef) {
    if (modelRotationDirZ !== 0)
      modelRef.rotateOnAxis(_zAxis, modelRotationDirZ * MODEL_ROT_SPEED * delta);
    if (modelRotationDirX !== 0)
      modelRef.rotateOnAxis(_xAxis, modelRotationDirX * MODEL_ROT_SPEED * delta);
  }

  updateAxisLabels();

  // Selected mesh stays at clean normal orange — no pulse, no emissive

  renderer.render(scene, camera);
}

animate();
