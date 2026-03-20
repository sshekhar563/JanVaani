import { Brain, Mic, Shield, LayoutDashboard, Hammer } from 'lucide-react';

export const pipelineSteps = [
  {
    key: 'intake',
    label: 'Citizen Intake',
    description: 'Voice / Text / Image received',
    icon: Mic,
    color: 'amber',
  },
  {
    key: 'whisper',
    label: 'Whisper ASR',
    description: 'Speech-to-text transcription',
    icon: Brain,
    color: 'blue',
  },
  {
    key: 'nlp',
    label: 'GPT NLP Engine',
    description: 'Category, sentiment, urgency',
    icon: Brain,
    color: 'purple',
  },
  {
    key: 'verify',
    label: 'Reality Check',
    description: 'Cross-verify & dedup',
    icon: Shield,
    color: 'teal',
  },
  {
    key: 'dashboard',
    label: 'Leader Dashboard',
    description: 'Routed to local authority',
    icon: LayoutDashboard,
    color: 'navy',
  },
  {
    key: 'action',
    label: 'Action & Proof',
    description: 'Resolved with verified proof',
    icon: Hammer,
    color: 'teal',
  },
];
