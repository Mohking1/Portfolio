import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('creatureCanvas') creatureCanvasRef!: ElementRef<HTMLCanvasElement>;
  private isBrowser: boolean;
  private viewportObserver: IntersectionObserver | null = null;
  private hasStartedPlayback = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Active flagship demo tab/state
  activeTab: 'creature' | 'tracker' | 'maildoc' = 'creature';

  // ==========================================
  // 1. CREATURE RL DEMO STATE & TELEMETRY
  // ==========================================
  creatures = [
    { id: 'spider', name: 'Hexapod Spider', joints: 12, mass: '18.0 kg', reward: '+4355.0', speed: '1.85 m/s', hasTelemetry: true },
    { id: 'biped', name: 'Biped Chicken', joints: 4, mass: '12.4 kg', reward: '+1840.2', speed: '3.4 m/s', hasTelemetry: false },
    { id: 'hound', name: 'Quadruped Hound', joints: 8, mass: '24.1 kg', reward: '+2410.8', speed: '5.2 m/s', hasTelemetry: false },
    { id: 'hopper', name: 'Single-Leg Hopper', joints: 2, mass: '6.5 kg', reward: '+1120.0', speed: '2.1 m/s', hasTelemetry: false },
    { id: 'humanoid', name: 'Humanoid Runner', joints: 10, mass: '65.0 kg', reward: '+2890.4', speed: '4.6 m/s', hasTelemetry: false }
  ];
  selectedCreature = this.creatures[0]; // Default to Spider with real telemetry

  terrains = [
    { id: 'unified', name: '100m Championship', friction: 'Multi-Zone', trackRange: '0m - 100m', roughness: 'Full Course' },
    { id: 'flat', name: 'Flat Runway', friction: '1.2 μ', trackRange: '0m - 25m', roughness: 'Low' },
    { id: 'variable_friction', name: 'Ice & Mud', friction: '0.05 - 2.5 μ', trackRange: '25m - 45m', roughness: 'Variable' },
    { id: 'slopes', name: 'Slopes & Ramps', friction: '1.2 μ', trackRange: '45m - 65m', roughness: '15° Incline' },
    { id: 'stairs', name: 'Stairs & Terraces', friction: '1.2 μ', trackRange: '65m - 80m', roughness: 'Stepped' },
    { id: 'hurdles', name: 'Procedural Hurdles', friction: '1.2 μ', trackRange: '85m - 100m', roughness: 'Obstacles' }
  ];
  selectedTerrain = this.terrains[0]; // 100m Championship is default!

  isPlaying = false; // Starts paused at frame 0 until user reaches viewing screen
  playbackSpeed = 1.0;
  showLidar = true;
  showContacts = true;
  showStrain = true;
  showTelemetry = true;
  simDistance = 0.0;
  simTrackX = 0.0;
  simTime = 0.0;
  simSpeed = 0.0;
  simReward = 4355.0;
  currentFrameIdx = 0;
  totalFrames = 0;
  private animFrameId: number | null = null;
  private telemetryData: any = null;
  private telemetryCache: { [key: string]: any } = {};
  isLoadingTelemetry = false;
  private sdkInterval: any = null;

  // ==========================================
  // 2. LOCAL ML EXPERIMENT TRACKER DEMO STATE
  // ==========================================
  sdkState: 'idle' | 'running' | 'completed' = 'completed';
  sdkPhase = 'Run Indexed & Telemetry Streamed';
  sdkProgress = 100;
  currentEpoch = 20;
  liveMetrics = {
    loss: 0.0984,
    accuracy: '92.75%',
    lr: '0.0001',
    gradNorm: '1.266',
    stepTime: '34ms'
  };
  terminalLogs: string[] = [
    '⚡ Initialized ExperimentTracker (Storage: ~/.experiment_tracker/)',
    '✓ SQLite run catalog initialized (Catalog version 2.0)',
    '✓ 5 PyTorch backward gradient hooks registered via run.watch(model)',
    'Epoch 20/20 [==============================] - 34ms/step - loss: 0.0984 - acc: 0.9275',
    '✓ Serialized best_model_weights.pt (50.2 KB)',
    '✓ Computed multi-class ROC AUC = 0.9249 (High Risk Tier)',
    '✓ Logged 3x3 Confusion Matrix artifact (run_id: a8c3af2b)'
  ];

  confusionLabels = ['Low Risk', 'Medium Risk', 'High Risk'];
  hoveredCell: { row: string; col: string; count: number; percentage: string } | null = null;

  experiments = [
    {
      id: 'a8c3af2b',
      name: 'PyTorch Deep Residual MLP',
      framework: 'PyTorch 2.6.0',
      status: 'Completed',
      duration: '6.88s',
      epochs: 20,
      accuracy: '92.75%',
      auc: '0.9249',
      loss: 0.0984,
      lr: '0.0030 → 0.0001',
      batchSize: 64,
      optimizer: 'AdamW (CosineAnneal)',
      lossPoints: '0,108 15,96 30,82 45,68 60,54 75,44 90,36 105,30 120,25 135,21 150,18 165,15 180,13 195,12 210,11 225,10 240,9 255,9 270,8 300,8',
      accPoints: '0,20 15,35 30,50 45,62 60,72 75,80 90,86 105,90 120,93 135,96 150,98 165,100 180,102 195,104 210,106 225,108 240,109 255,110 270,111 300,112',
      matrix: [
        [1420, 45, 15],
        [38, 380, 42],
        [12, 28, 520]
      ],
      codeSnippet: `import experiment_tracker as et
from experiment_tracker.integrations.pytorch import watch

# 1. Initialize local-first run
with et.init(project="fraud-benchmark", name="deep_residual_mlp") as run:
    # 2. Attach backward hooks for gradient health
    watch(model, log_gradients=True)
    
    # 3. Train & stream real-time metrics
    for epoch in range(20):
        loss, acc = train_step(batch)
        run.log({
            "loss": loss.item(),
            "accuracy": acc.item(),
            "learning_rate": scheduler.get_last_lr()[0]
        })
    
    # 4. Version artifacts & model weights
    run.log_artifact("confusion_matrix", matrix=cm_data)
    run.save_model(model, "best_model_weights.pt")`,
      gradients: [
        { layer: 'Input Linear (20->64)', norm: '1.266', mean: '0.0227', min: '0.000009', status: 'Healthy' },
        { layer: 'LayerNorm 1 (dim=64)', norm: '0.155', mean: '0.0132', min: '0.000047', status: 'Healthy' },
        { layer: 'Residual Linear 1 (64->64)', norm: '1.081', mean: '0.0092', min: '0.000001', status: 'Healthy' },
        { layer: 'Residual Linear 2 (64->64)', norm: '0.485', mean: '0.0046', min: '0.000001', status: 'Healthy' },
        { layer: 'Output Logits Head (32->3)', norm: '0.082', mean: '0.0074', min: '0.000197', status: 'Healthy' },
      ],
      artifacts: [
        { name: 'best_model_weights.pt', type: 'PyTorch Weights', size: '50 KB' },
        { name: 'confusion_matrix.json', type: '3x3 Matrix', size: '1.2 KB' },
        { name: 'roc_curve_high_risk.json', type: 'ROC Profile (AUC=0.925)', size: '3.4 KB' },
      ]
    },
    {
      id: '0f43af47',
      name: 'XGBoost Tree Ensemble',
      framework: 'XGBoost 2.1.4',
      status: 'Completed',
      duration: '1.85s',
      epochs: 100,
      accuracy: '85.50%',
      auc: '0.8513',
      loss: 0.3412,
      lr: '0.10 (Newton Step)',
      batchSize: 1600,
      optimizer: 'Hist Gradient Boosting',
      lossPoints: '0,105 30,78 60,56 90,42 120,32 150,25 180,20 210,17 240,15 270,14 300,13',
      accPoints: '0,30 30,55 60,70 90,82 120,89 150,94 180,98 210,101 240,103 270,104 300,105',
      matrix: [
        [1360, 85, 35],
        [52, 340, 68],
        [25, 45, 490]
      ],
      codeSnippet: `import experiment_tracker as et
from experiment_tracker.integrations.xgboost import track_booster

with et.init(project="fraud-benchmark", name="xgboost_trees") as run:
    booster = xgb.train(params, dtrain, num_boost_round=100,
                        evals=[(dval, "val")],
                        callbacks=[track_booster(run)])
    
    run.log_artifact("feature_importance", booster.get_score())
    run.log_artifact("roc_curve_high_risk", roc_data)`,
      gradients: [],
      artifacts: [
        { name: 'xgboost_model.json', type: 'Booster Dump', size: '124 KB' },
        { name: 'feature_importance.json', type: 'Feature Gain Array', size: '2.1 KB' },
        { name: 'roc_curve_high_risk.json', type: 'ROC Profile (AUC=0.851)', size: '3.1 KB' },
      ]
    },
    {
      id: '8c8c23ae',
      name: 'Scikit-Learn Random Forest',
      framework: 'Scikit-Learn 1.6.1',
      status: 'Completed',
      duration: '0.82s',
      epochs: 100,
      accuracy: '84.00%',
      auc: '0.7786 (F1)',
      loss: 0.3890,
      lr: 'N/A (Bagging)',
      batchSize: 1600,
      optimizer: 'Gini Impurity Forest',
      lossPoints: '0,100 30,68 60,48 90,36 120,28 150,22 180,18 210,16 240,15 270,14 300,14',
      accPoints: '0,35 30,60 60,75 90,85 120,92 150,96 180,99 210,101 240,102 270,102 300,102',
      matrix: [
        [1340, 100, 40],
        [65, 320, 75],
        [35, 55, 470]
      ],
      codeSnippet: `import experiment_tracker as et
from experiment_tracker.integrations.sklearn import autolog

# Automatic model & parameter tracking
autolog()

with et.init(project="fraud-benchmark", name="sklearn_rf") as run:
    clf = RandomForestClassifier(n_estimators=100, max_depth=8)
    clf.fit(X_train, y_train)
    
    run.log({"test_accuracy": clf.score(X_test, y_test)})
    run.log_artifact("confusion_matrix", confusion_matrix(y_test, y_pred))`,
      gradients: [],
      artifacts: [
        { name: 'confusion_matrix.json', type: '3-Class Matrix', size: '1.1 KB' },
        { name: 'feature_importance.json', type: 'MDI Importance', size: '1.9 KB' },
      ]
    }
  ];
  selectedExp = this.experiments[0];
  trackerActiveTab: 'sdk' | 'matrix' | 'charts' | 'gradients' | 'benchmark' = 'sdk';

  // ==========================================
  // 4. ARGUS OS (FORMERLY MAILDOC AI) — MULTI-AGENT EXECUTIVE SYSTEM DEMO
  // ==========================================
  argusGoal = "Review Acme Cloud's annual renewal email and proposal PDF, extract 2026 compute pricing & SLA terms with TableFormer, cross-reference against budget limits in Cognitive Memory, research market price benchmarks on the Web, and stage a cited counter-negotiation draft under Supervised Autonomy.";
  argusActiveView: 'dag' | 'email' | 'doc' | 'memory' | 'web' | 'telemetry' = 'dag';
  isArgusRunning = false;
  argusCurrentStep = 0;
  argusPlaybackSpeed: 1 | 2 = 1;
  private argusTimer: any = null;

  // Topological DAG execution steps with variable resolution & telemetry
  argusSteps = [
    {
      stepId: 'step_1',
      agent: 'mail_agent',
      agentLabel: 'Mail Agent',
      badge: 'IMAP Protocol',
      title: 'IMAP Search & PDF Extraction',
      description: "Scan priority thread from licensing-renewals@acme-cloud.io and download 'Acme_Enterprise_Renewal_2026.pdf' to Document Vault.",
      toolCall: "mail_agent.fetch_attachment(uid=4492, save_to='data/vault/')",
      variables: ["$step_1.saved_paths -> 'data/vault/Acme_Enterprise_Renewal_2026.pdf'"],
      durationMs: 320,
      status: 'pending' as 'pending' | 'running' | 'completed',
      receipt: "Downloaded 1 attachment (2.8 MB PDF, SHA256: c8f92a10) to vault."
    },
    {
      stepId: 'step_2a',
      agent: 'doc_agent',
      agentLabel: 'Doc Agent',
      badge: 'Docling + TableFormer',
      title: 'Docling & TableFormer Extraction [Parallel A]',
      description: "Parse '$step_1.saved_paths' via IBM TableFormer (ACCURATE mode). Extracts compute pricing matrix & SLA clauses.",
      toolCall: "doc_agent.parse_and_extract_tables(file_path=$step_1.saved_paths)",
      variables: ["$step_2a.tables -> 3 pricing matrices", "$step_2a.clauses -> 2 SLA policies"],
      durationMs: 1140,
      status: 'pending' as 'pending' | 'running' | 'completed',
      receipt: "Detected unannounced +14.28% YoY price hike on c6i.8xlarge; SLA downgraded to 99.90%."
    },
    {
      stepId: 'step_2b',
      agent: 'memory_agent',
      agentLabel: 'Cognitive Memory',
      badge: 'SQLite Loci FTS5',
      title: 'Loci Beliefs & Budget Thresholds [Parallel B]',
      description: "Query SQLite FTS5 spatial index in 'wings/projects/decisions' and 'wings/beliefs' for active spending ceilings and negotiation policies.",
      toolCall: "memory.search_beliefs(wing='projects', hall='decisions')",
      variables: ["$step_2b.active_rules -> 'vendor_escalation_cap: max 6.0%'"],
      durationMs: 180,
      status: 'pending' as 'pending' | 'running' | 'completed',
      receipt: "Retrieved active CFO rule: Max +6.0% YoY escalation; 99.95% SLA mandate with credit penalties."
    },
    {
      stepId: 'step_3',
      agent: 'web_agent',
      agentLabel: 'Web Intelligence',
      badge: 'SearXNG + Trafilatura',
      title: 'SearXNG Zero-Cloud Metasearch',
      description: "Execute 4-phase autonomous research across SearXNG + Trafilatura for 2026 enterprise cloud benchmarks and Acme outage telemetry.",
      toolCall: "web_agent.research(queries=['enterprise cloud pricing benchmark 2026', 'Acme Cloud downtime log'])",
      variables: ["$step_3.market_rate -> -3.8% avg contraction", "$step_3.incident -> ACM-8821 (4h downtime)"],
      durationMs: 890,
      status: 'pending' as 'pending' | 'running' | 'completed',
      receipt: "Found Q3 market benchmark (-3.8% YoY) and documented 4h global control plane downtime incident."
    },
    {
      stepId: 'step_4',
      agent: 'rag_agent',
      agentLabel: 'RAG Hybrid Engine',
      badge: 'Parent-Child RRF',
      title: 'Parent-Child RRF Synthesis & Reconciliation',
      description: "Fuse TableFormer pricing tables ($step_2a), Cognitive Memory rules ($step_2b), and Web evidence ($step_3) into a cited counter-negotiation brief.",
      toolCall: "rag_agent.synthesize_with_citations(sources=['vault', 'memory', 'web'])",
      variables: ["$step_4.counter_terms -> '+4.5% blended rate, 99.95% SLA credit multiplier'"],
      durationMs: 620,
      status: 'pending' as 'pending' | 'running' | 'completed',
      receipt: "Synthesized 3-point counter-proposal with verified multi-source citations [Doc: Table 4.1, Web: CloudMetrics]."
    },
    {
      stepId: 'step_5',
      agent: 'mail_agent',
      agentLabel: 'Autonomy Governance',
      badge: 'Supervised Gating',
      title: 'Supervised Outbound Draft Staging',
      description: "Autonomy policy check (SUPERVISED). Intercepts direct external SMTP dispatch and stages formatted counter-offer email into Drafts folder.",
      toolCall: "mail_agent.create_draft(folder='Drafts/Vendor_Renewals', attach_matrix=True)",
      variables: ["$step_5.draft_uid -> 'draft_9041'", "$step_5.status -> 'STAGED_SUPERVISED'"],
      durationMs: 410,
      status: 'pending' as 'pending' | 'running' | 'completed',
      receipt: "Draft safely staged into IMAP Drafts. Supervised policy prevented unauthorized external transmission."
    }
  ];

  // Subsystem 1: Email Thread & Staged Draft
  argusEmail = {
    inbound: {
      from: 'licensing-renewals@acme-cloud.io',
      to: 'mohammed@infrastructure.io',
      subject: 'Acme Cloud Enterprise Master Service Agreement — 2026 Annual Renewal',
      date: 'Today, 08:30 AM (Priority High)',
      attachment: 'Acme_Enterprise_Renewal_2026.pdf (2.8 MB)',
      snippet: 'Dear Mohammed, please find attached the 2026 renewal schedule for your cloud compute cluster. As noted in Section 4, updated infrastructure rates take effect October 1st. Please countersign before the end of the month.'
    },
    draft: {
      to: 'licensing-renewals@acme-cloud.io',
      subject: 'Re: Acme Cloud Enterprise Master Service Agreement — Counter-Proposal & SLA Reconciliation',
      folder: 'IMAP: INBOX/Drafts/Vendor_Renewals',
      autonomyBadge: 'SUPERVISED: Gated Outbound Action — Direct SMTP Intercepted',
      body: `Dear Acme Renewals Team,

We have reviewed the proposed 2026 renewal agreement and compute pricing schedule (Acme_Enterprise_Renewal_2026.pdf, Table 4.1).

While we value Acme Cloud's platform services, our executive spending rules (Ref: Memory/Projects/2026_Budget) cap annual vendor cost escalation at +6.0% YoY, whereas your proposed rate reflects a +14.28% increase across compute instances ($18.40/hr vs $16.10/hr). Furthermore, current Q3 enterprise market benchmarks (Ref: CloudMetrics Q3 2026 Index) indicate a 3.8% contraction in median cloud infrastructure rates.

Given our historical uptime telemetry and the 4-hour unscheduled downtime recorded in Q1 (Ref: Incident #ACM-8821), we propose the following counter-terms:
1. Compute Tier-A/B blended rate capped at +4.5% YoY ($16.82/hr).
2. Service Level Agreement (SLA) commitment maintained at 99.95% with tiered service credit rebates for availability dips below 99.9%.
3. 24-month term lock with mutual termination option on persistent SLA breach.

Please find our comparative reconciliation matrix attached. We look forward to confirming these terms.

Sincerely,
Mohammed Lokhandwala
AI / ML Infrastructure Operations`
    }
  };

  // Subsystem 2: Docling & IBM TableFormer Extracted Structure
  argusDocling = {
    documentId: 'doc_acme_renewal_c8f92a10',
    fileName: 'Acme_Enterprise_Renewal_2026.pdf',
    parser: 'Docling v2.1.0 + IBM TableFormer (ACCURATE Mode)',
    stats: '18 Pages · 3 Pricing Matrices · 2 SLA Clauses · SHA-256 Verified',
    extractedTable: {
      title: 'Table 4.1 — Enterprise Instance Pricing & Comparative Audit',
      columns: ['Compute Tier', '2025 Current', 'Acme 2026 Proposed', 'Variance', 'Market Benchmark (Web)', 'Budget Cap (Memory)'],
      rows: [
        { tier: 'c6i.8xlarge (64 GB)', current: '$16.10 / hr', proposed: '$18.40 / hr', change: '+14.28%', alert: true, market: '$15.45 / hr', limit: 'Max $17.06 (+6%)' },
        { tier: 'g5.12xlarge (A10G GPU)', current: '$42.50 / hr', proposed: '$47.80 / hr', change: '+12.47%', alert: true, market: '$43.10 / hr', limit: 'Max $45.05 (+6%)' },
        { tier: 'nvme.storage (TB/mo)', current: '$0.080 / GB', proposed: '$0.092 / GB', change: '+15.00%', alert: true, market: '$0.076 / GB', limit: 'Max $0.084 (+6%)' },
        { tier: 'Cross-AZ Egress (GB)', current: '$0.010 / GB', proposed: '$0.010 / GB', change: '0.00%', alert: false, market: '$0.009 / GB', limit: 'Approved' }
      ]
    },
    slaTerms: [
      { param: 'Proposed Availability', value: '99.90% (Downgraded from 99.95%)', compliant: false },
      { param: 'Outage Credit Threshold', value: 'Credits only apply after >8 continuous hours downtime', compliant: false },
      { param: 'Cognitive Memory Mandate', value: 'Minimum 99.95% availability with progressive credits after 15 min', compliant: true }
    ]
  };

  // Subsystem 3: SQLite Loci-Hindsight Cognitive Memory Tree
  argusMemory = {
    dbType: 'SQLite 3.45 with FTS5 BM25 Indexing',
    networks: '4 Networks (Facts, Experiences, Entities, Beliefs) · 4 Wings · 12 Spatial Halls',
    spatialWings: [
      {
        wing: 'projects',
        halls: [
          {
            hall: 'decisions',
            entries: [
              { key: 'vendor_escalation_cap', status: 'ACTIVE', type: 'Belief', content: 'Annual SaaS/Cloud contract rate escalation strictly capped at 6.0% YoY without Board authorization (Approved by CFO 2026-01-15).' },
              { key: 'vendor_escalation_cap_old', status: 'SUPERSEDED', type: 'Belief', content: 'Vendor rate escalation ceiling: 10.0% YoY (Approved 2024-06-10, superseded by CFO rev_2026).' }
            ]
          },
          {
            hall: 'infrastructure',
            entries: [
              { key: 'acme_cloud_cluster_spec', status: 'ACTIVE', type: 'Entity', content: 'Production Kubernetes cluster deployed across 8x c6i.8xlarge nodes and 2x g5.12xlarge GPU inferencing workers.' }
            ]
          }
        ]
      },
      {
        wing: 'workflows',
        halls: [
          {
            hall: 'policies',
            entries: [
              { key: 'outbound_autonomy_rule', status: 'ACTIVE', type: 'Belief', content: 'External vendor emails, contracts, and financial commitments require SUPERVISED mode (redirect to Drafts folder).' }
            ]
          }
        ]
      },
      {
        wing: 'knowledge',
        halls: [
          {
            hall: 'contracts',
            entries: [
              { key: 'acme_sla_minimum', status: 'ACTIVE', type: 'Fact', content: 'Core compute clusters require 99.95% SLA minimum commitment with progressive billing credit multipliers for downtime exceeding 15 minutes.' }
            ]
          }
        ]
      }
    ]
  };

  // Subsystem 4: SearXNG Zero-Cloud Web Intelligence
  argusWeb = {
    searchBackend: 'Local SearXNG Metasearch (Aggregating Google, Bing, DuckDuckGo, Brave)',
    extractionEngine: 'Trafilatura Clean Markdown Parser',
    queries: [
      {
        query: 'enterprise cloud compute pricing benchmark Q3 2026 index',
        source: 'CloudMetrics Enterprise Analytics (Aug 2026)',
        url: 'https://cloudmetrics.io/reports/2026-enterprise-benchmarks',
        excerpt: 'Enterprise cloud compute pricing experienced a 3.8% median contraction in Q2/Q3 2026 driven by expanding regional hyperscaler capacity and hardware efficiency gains.'
      },
      {
        query: 'Acme Cloud SLA downtime incident history 2026 report',
        source: 'InfraAlert Global Telemetry Network',
        url: 'https://infra-alert.net/incidents/acme-2026-03-14',
        excerpt: 'Incident ACM-8821: Acme Cloud experienced a 4-hour cascading control plane outage in us-east region on March 14, 2026, causing disruption to 22% of active multi-tenant workloads.'
      }
    ]
  };

  // Subsystem 5: Real-Time Debug Trace Buffer (Circular In-Memory Ring Buffer)
  argusTraces = [
    { level: 'INFO', type: 'PLAN_FORMULATED', component: 'planner', msg: 'Decomposed goal into 5 DAG steps with 2 parallel branches (TopologicalSorter resolved 0 cycles)', time: '0ms' },
    { level: 'INFO', type: 'TOOL_CALL', component: 'mail_agent', msg: 'search_emails(from="acme-cloud.io", subject="renewal") -> Matched UID: 4492', time: '180ms' },
    { level: 'INFO', type: 'BLACKBOARD_VAR', component: 'blackboard', msg: 'Interpolated $step_1.saved_paths -> "data/vault/Acme_Enterprise_Renewal_2026.pdf"', time: '320ms' },
    { level: 'INFO', type: 'TOOL_CALL', component: 'doc_agent', msg: 'IBM TableFormer (ACCURATE) extracted Table 4.1 matrix (4 rows, 6 columns)', time: '1460ms' },
    { level: 'INFO', type: 'TOOL_CALL', component: 'memory_agent', msg: 'FTS5 BM25 match in wings/projects/decisions -> Active key: "vendor_escalation_cap" (+6.0%)', time: '1480ms' },
    { level: 'INFO', type: 'TOOL_CALL', component: 'web_agent', msg: 'SearXNG dispatched 2 queries -> Reranked 14 URLs -> Trafilatura extracted 2 authoritative citations', time: '2370ms' },
    { level: 'INFO', type: 'TOOL_CALL', component: 'rag_agent', msg: 'Parent-Child RRF fused Document + Memory + Web evidence into counter-terms', time: '2990ms' },
    { level: 'WARN', type: 'POLICY_GATE', component: 'autonomy', msg: '[SUPERVISED] External dispatch intercepted: Action "send_email" redirected to "create_draft"', time: '3400ms' }
  ];

  // Legacy MailDoc aliases for full compatibility
  get isMailDocRunning(): boolean { return this.isArgusRunning; }
  set isMailDocRunning(val: boolean) { this.isArgusRunning = val; }
  get mailDocStep(): number { return this.argusCurrentStep; }
  set mailDocStep(val: number) { this.argusCurrentStep = val; }
  mailDocLogs = [
    { step: '1. Ingest & Parse Document', detail: 'Docling & TableFormer multimodal extraction on Acme contract PDF', status: 'pending' as 'pending' | 'running' | 'done' },
    { step: '2. Cognitive Memory Check', detail: 'Retrieved active CFO budget policy from SQLite Loci memory', status: 'pending' as 'pending' | 'running' | 'done' },
    { step: '3. Web Intelligence Research', detail: 'SearXNG metasearch for Q3 enterprise cloud pricing benchmarks', status: 'pending' as 'pending' | 'running' | 'done' },
    { step: '4. Parent-Child RRF Synthesis', detail: 'Cross-reconciled evidence and synthesized counter-negotiation brief', status: 'pending' as 'pending' | 'running' | 'done' },
    { step: '5. Supervised Draft Staging', detail: 'Staged counter-proposal draft in IMAP Drafts (autonomy safety gate)', status: 'pending' as 'pending' | 'running' | 'done' }
  ];

  // ==========================================
  // MORE WORK (SECONDARY PROJECTS)
  // ==========================================
  moreWork = [
    {
      title: 'FloatChat',
      subtitle: 'ARGO Oceanographic Data Chatbot',
      description: 'Conversational agent for ARGO marine datasets using a local LLM, structured query planning, deterministic SQL execution, and interactive statistical charting.',
      tags: ['Local LLM', 'Text-to-SQL', 'ARGO Data', 'Python', 'Streamlit'],
      githubLink: 'https://github.com/Mohking1/Float-Chat'
    },
    {
      title: 'CRAFT-CRNN-OCR',
      subtitle: 'Scene Text Detection & Recognition',
      description: 'End-to-end computer vision pipeline combining CRAFT character-region detection with CRNN sequence modeling for arbitrary-oriented text in complex environments (External fork received).',
      tags: ['PyTorch', 'CRAFT', 'CRNN', 'OpenCV', 'Computer Vision'],
      githubLink: 'https://github.com/Mohking1/CRAFT-CRNN-OCR'
    },
    {
      title: 'CodeQuery',
      subtitle: 'AST-Aware Code Retrieval Engine',
      description: 'Semantic code search tool using tree-sitter AST hierarchical chunking, vector embeddings, BM25 lexical search, and Reciprocal Rank Fusion (RRF) for developer workflows.',
      tags: ['Tree-sitter', 'Embeddings', 'ChromaDB', 'RRF', 'Python'],
      githubLink: 'https://github.com/Mohking1/Code-Query'
    },
    {
      title: 'Tricount',
      subtitle: 'Group Expense Optimization App',
      description: 'Practical multi-currency expense-splitting and debt-simplification application designed for personal and team shared expenses with graph debt minimization.',
      tags: ['TypeScript', 'Algorithms', 'Full-Stack', 'Web'],
      githubLink: 'https://github.com/Mohking1/Tricount-App'
    },
    {
      title: 'Heuristic Framework',
      subtitle: 'Heuristic Generation Benchmarking',
      description: 'Comparative evaluation framework for benchmarking established heuristic-generation methodologies across parameterized problem sets with a modular plugin architecture.',
      tags: ['Algorithms', 'Benchmarking', 'Python', 'Optimization'],
      githubLink: 'https://github.com/Mohking1/auto_hueristics'
    },
    {
      title: 'DeepLayout',
      subtitle: 'Document Layout Segmentation',
      description: 'Supporting document intelligence utility for layout analysis, bounding box grouping, and reading-order reconstruction for complex business documents.',
      tags: ['Document AI', 'Layout Analysis', 'PyTorch', 'Vision'],
      githubLink: 'https://github.com/Mohking1/DeepLayout'
    }
  ];

  ngOnInit() {
    if (this.isBrowser) {
      this.preloadSimulations();
      this.startSimulationLoop();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.setupViewportObserver();
      this.loadSimulationTelemetry().then(() => this.drawCreature());
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      if (this.viewportObserver) {
        this.viewportObserver.disconnect();
        this.viewportObserver = null;
      }
    }
    if (this.sdkInterval) {
      clearInterval(this.sdkInterval);
      this.sdkInterval = null;
    }
    if (this.argusTimer) {
      clearTimeout(this.argusTimer);
      this.argusTimer = null;
    }
  }

  private setupViewportObserver() {
    if (!this.isBrowser || !this.creatureCanvasRef?.nativeElement) return;
    try {
      this.viewportObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (!this.hasStartedPlayback) {
                this.hasStartedPlayback = true;
                this.currentFrameIdx = 0;
                this.isPlaying = true;
              }
            }
          }
        },
        { threshold: 0.2 }
      );
      this.viewportObserver.observe(this.creatureCanvasRef.nativeElement);
    } catch {
      this.isPlaying = true;
    }
  }

  // ==========================================
  // SIMULATION & TELEMETRY PLAYBACK ENGINE
  // ==========================================
  async preloadSimulations() {
    const stageIds = ['flat', 'variable_friction', 'slopes', 'stairs', 'hurdles', 'unified'];
    for (const sid of stageIds) {
      const key = `hexapod_spider_${sid}`;
      if (!this.telemetryCache[key]) {
        fetch(`/assets/simulations/${key}.json`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data) this.telemetryCache[key] = data;
          })
          .catch(() => {});
      }
    }
  }

  async loadSimulationTelemetry() {
    if (!this.isBrowser) return;
    if (!this.selectedCreature.hasTelemetry) {
      this.telemetryData = null;
      this.totalFrames = 0;
      this.currentFrameIdx = 0;
      return;
    }

    const creatureId = this.selectedCreature.id === 'spider' ? 'hexapod_spider' : this.selectedCreature.id;
    const key = `${creatureId}_${this.selectedTerrain.id}`;
    if (this.telemetryCache[key]) {
      this.telemetryData = this.telemetryCache[key];
      this.totalFrames = this.telemetryData.frames?.length || 0;
      this.currentFrameIdx = 0;
      return;
    }

    this.isLoadingTelemetry = true;
    try {
      const response = await fetch(`/assets/simulations/${key}.json`);
      if (response.ok) {
        const data = await response.json();
        this.telemetryCache[key] = data;
        this.telemetryData = data;
        this.totalFrames = data.frames?.length || 0;
        this.currentFrameIdx = 0;
      } else {
        this.telemetryData = null;
        this.totalFrames = 0;
      }
    } catch {
      this.telemetryData = null;
      this.totalFrames = 0;
    } finally {
      this.isLoadingTelemetry = false;
    }
  }

  startSimulationLoop() {
    if (!this.isBrowser) return;
    let lastTime = performance.now();
    let frameAcc = 0;

    const render = (time: number) => {
      this.animFrameId = requestAnimationFrame(render);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (this.isPlaying && !this.isLoadingTelemetry) {
        if (this.telemetryData && this.totalFrames > 0) {
          frameAcc += dt * 30 * this.playbackSpeed; // 30 FPS telemetry playback
          if (frameAcc >= 1) {
            const stepFrames = Math.floor(frameAcc);
            frameAcc -= stepFrames;
            const nextFrame = this.currentFrameIdx + stepFrames;
            if (nextFrame >= this.totalFrames) {
              // Seamless auto continue to next terrain pass
              frameAcc = 0;
              const currentIdx = this.terrains.findIndex(t => t.id === this.selectedTerrain.id);
              const nextIdx = (currentIdx + 1) % this.terrains.length;
              this.selectTerrain(this.terrains[nextIdx]);
            } else {
              this.currentFrameIdx = nextFrame;
            }
          }
        } else {
          // Procedural locomotion loop for other morphologies
          const speed = parseFloat(this.selectedCreature.speed) || 2.5;
          this.simTime += dt * this.playbackSpeed;
          this.simTrackX = (this.simTrackX + dt * speed * this.playbackSpeed) % 100;
          this.simSpeed = speed * (0.9 + 0.15 * Math.cos(this.simTime * 4));
          const baseRew = parseFloat(this.selectedCreature.reward.replace('+', '')) || 1500;
          this.simReward = Math.round(baseRew * (0.95 + 0.05 * Math.sin(this.simTime * 2)));
        }
        this.drawCreature();
      }
    };
    this.animFrameId = requestAnimationFrame(render);
  }

  selectCreature(c: any) {
    this.selectedCreature = c;
    this.currentFrameIdx = 0;
    if (c.hasTelemetry) {
      this.loadSimulationTelemetry().then(() => this.drawCreature());
    } else {
      this.telemetryData = null;
      this.totalFrames = 0;
      this.simSpeed = parseFloat(c.speed) || 2.0;
      this.drawCreature();
    }
  }

  async selectTerrain(t: any) {
    this.selectedTerrain = t;
    this.currentFrameIdx = 0;
    await this.loadSimulationTelemetry();
    this.drawCreature();
  }

  onScrub(event: Event) {
    const target = event.target as HTMLInputElement;
    this.currentFrameIdx = parseInt(target.value, 10);
    this.drawCreature();
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  setPlaybackSpeed(speed: number) {
    this.playbackSpeed = speed;
  }

  selectExperiment(exp: any) {
    this.selectedExp = exp;
    this.liveMetrics = {
      loss: exp.loss,
      accuracy: exp.accuracy,
      lr: exp.lr.split('→')[1]?.trim() || exp.lr,
      gradNorm: exp.gradients[0]?.norm || '0.942',
      stepTime: '34ms'
    };
    if (this.selectedExp.gradients.length === 0 && this.trackerActiveTab === 'gradients') {
      this.trackerActiveTab = 'charts';
    }
  }

  runSdkPipeline() {
    if (this.sdkState === 'running') return;
    if (this.sdkInterval) {
      clearInterval(this.sdkInterval);
      this.sdkInterval = null;
    }
    this.sdkState = 'running';
    this.sdkProgress = 15;
    this.currentEpoch = 1;
    this.liveMetrics = {
      loss: 0.6156,
      accuracy: '77.50%',
      lr: '0.0030',
      gradNorm: '2.140',
      stepTime: '38ms'
    };
    this.terminalLogs = [
      '⚡ Initializing ExperimentTracker (storage: ~/.experiment_tracker)...',
      '✓ Registered run: ' + this.selectedExp.name,
      '✓ Attached backward gradient hooks across neural layers'
    ];

    let epoch = 1;
    this.sdkInterval = setInterval(() => {
      epoch += 3;
      if (epoch >= this.selectedExp.epochs) {
        epoch = this.selectedExp.epochs;
        clearInterval(this.sdkInterval);
        this.sdkInterval = null;
        this.currentEpoch = epoch;
        this.sdkProgress = 100;
        this.sdkState = 'completed';
        this.sdkPhase = 'Run Complete · Artifacts & Weights Synced';
        this.liveMetrics = {
          loss: this.selectedExp.loss,
          accuracy: this.selectedExp.accuracy,
          lr: this.selectedExp.lr.split('→')[1]?.trim() || this.selectedExp.lr,
          gradNorm: this.selectedExp.gradients[0]?.norm || '0.942',
          stepTime: '34ms'
        };
        this.terminalLogs.push(
          `Epoch ${epoch}/${this.selectedExp.epochs} [==============================] - 34ms/step - loss: ${this.selectedExp.loss} - acc: ${this.selectedExp.accuracy}`,
          `✓ Serialized ${this.selectedExp.artifacts[0]?.name || 'model_weights.pt'} (${this.selectedExp.artifacts[0]?.size || '50 KB'})`,
          `✓ Multi-class ROC AUC = ${this.selectedExp.auc}`,
          `✓ Run ${this.selectedExp.id} indexed into SQLite catalog`
        );
      } else {
        this.currentEpoch = epoch;
        this.sdkProgress = Math.round((epoch / this.selectedExp.epochs) * 100);
        const progressFrac = epoch / this.selectedExp.epochs;
        const interpLoss = parseFloat((0.6156 - (0.6156 - this.selectedExp.loss) * progressFrac).toFixed(4));
        const interpAcc = (77.5 + (parseFloat(this.selectedExp.accuracy) - 77.5) * progressFrac).toFixed(2) + '%';
        this.liveMetrics.loss = interpLoss;
        this.liveMetrics.accuracy = interpAcc;
        this.terminalLogs.push(`Epoch ${epoch}/${this.selectedExp.epochs} - loss: ${interpLoss} - acc: ${interpAcc}`);
        if (this.terminalLogs.length > 7) {
          this.terminalLogs.shift();
        }
      }
    }, 280);
  }

  setHoveredCell(row: string, col: string, count: number, total: number) {
    this.hoveredCell = {
      row,
      col,
      count,
      percentage: ((count / total) * 100).toFixed(1) + '%'
    };
  }

  clearHoveredCell() {
    this.hoveredCell = null;
  }

  getGradientWidth(norm: string): number {
    const val = parseFloat(norm) || 0;
    return Math.min(100, Math.max(5, (val / 1.5) * 100));
  }

  get argusDoc() {
    return this.argusDocling;
  }

  getMatrixTotal(matrix: number[][]): number {
    if (!matrix || matrix.length === 0) return 1;
    return matrix.reduce((acc, row) => acc + row.reduce((rSum, v) => rSum + v, 0), 0);
  }

  getLossPoints(): { x: number; y: number }[] {
    const raw = this.selectedExp.lossPoints || '0,108 300,8';
    const pairs = raw.trim().split(/\s+/).map(p => p.split(',').map(Number));
    return pairs.map(([x, y]) => {
      const px = 20 + (x / 300) * 260;
      const py = Math.max(15, Math.min(105, 105 - ((y - 5) / 105) * 85));
      return { x: px, y: py };
    });
  }

  getLossPath(): string {
    const pts = this.getLossPoints();
    if (pts.length === 0) return 'M 20 25 L 280 100';
    return 'M ' + pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
  }

  getLossAreaPath(): string {
    const pts = this.getLossPoints();
    if (pts.length === 0) return 'M 20 25 L 280 100 L 280 108 L 20 108 Z';
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `M ${first.x.toFixed(1)} 108 L ` + pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ') + ` L ${last.x.toFixed(1)} 108 Z`;
  }

  getLossLastPoint(): { x: number; y: number } {
    const pts = this.getLossPoints();
    return pts[pts.length - 1] || { x: 280, y: 100 };
  }

  getAccPoints(): { x: number; y: number }[] {
    const raw = this.selectedExp.accPoints || '0,20 300,112';
    const pairs = raw.trim().split(/\s+/).map(p => p.split(',').map(Number));
    return pairs.map(([x, y]) => {
      const px = 20 + (x / 300) * 260;
      const py = Math.max(15, Math.min(105, 105 - ((y - 15) / 100) * 85));
      return { x: px, y: py };
    });
  }

  getAccPath(): string {
    const pts = this.getAccPoints();
    if (pts.length === 0) return 'M 20 105 L 280 20';
    return 'M ' + pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
  }

  getAccAreaPath(): string {
    const pts = this.getAccPoints();
    if (pts.length === 0) return 'M 20 105 L 280 20 L 280 108 L 20 108 Z';
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `M ${first.x.toFixed(1)} 108 L ` + pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ') + ` L ${last.x.toFixed(1)} 108 Z`;
  }

  getAccLastPoint(): { x: number; y: number } {
    const pts = this.getAccPoints();
    return pts[pts.length - 1] || { x: 280, y: 20 };
  }

  drawCreature() {
    const canvas = this.creatureCanvasRef?.nativeElement;
    if (!canvas) return;
    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // If authentic telemetry is available, render real Box2D physics frames
    if (this.telemetryData && this.telemetryData.frames && this.telemetryData.frames.length > 0) {
      this.drawRealTelemetry(ctx, w, h);
      return;
    }

    // Fallback procedural animation for creatures without precomputed telemetry yet
    this.drawProceduralFallback(ctx, w, h);
  }

  private drawRealTelemetry(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const frames = this.telemetryData.frames;
    const frameIdx = Math.min(Math.floor(this.currentFrameIdx), frames.length - 1);
    const frame = frames[frameIdx];
    const rig = this.telemetryData.rig;
    const terrain = this.telemetryData.terrain;

    // Frame data schema: [t, [rx, ry, ra, rvx, rvy], bodies_flat, joints_flat, lidar_flat, contacts, [dist, speed, reward]]
    const root = frame[1];
    const rootX = root[0];
    const rootY = root[1];
    const bodiesFlat = frame[2];
    const jointsFlat = frame[3];
    const lidarFlat = frame[4];
    const contacts = frame[5] || [];
    const telemetry = frame[6] || [0, 0, 0];

    // Update live metrics from real frame telemetry
    this.simDistance = telemetry[0];
    this.simSpeed = telemetry[1];
    this.simReward = telemetry[2];
    this.simTime = frame[0];
    this.simTrackX = rootX;

    // Smooth stable camera tracking (PPM = 36)
    const ppm = 36.0;
    const camX = rootX;
    // Ground reference tracking: keep ground visually grounded at screenCenterY
    const camY = Math.max(0.45, rootY * 0.35);
    const screenCenterX = w * 0.38;
    const screenCenterY = h * 0.68;

    const toScreenX = (wx: number) => screenCenterX + (wx - camX) * ppm;
    const toScreenY = (wy: number) => screenCenterY - (wy - camY) * ppm;

    // 1. Grid Background
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
    ctx.lineWidth = 1;
    const gridSpacing = ppm * 1.0; // 1 meter grid
    const startGridX = toScreenX(Math.floor(camX - 15)) % gridSpacing;
    for (let x = startGridX; x < w; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // 2. Real Terrain Bedrock & Surface Contours
    if (terrain && terrain.segments) {
      for (const seg of terrain.segments) {
        if (!seg.vertices || seg.vertices.length < 2) continue;
        const verts = seg.vertices;
        const sType = seg.type || 'FLAT';

        // Check if segment is in viewport range
        const segMinX = Math.min(...verts.map((v: number[]) => v[0]));
        const segMaxX = Math.max(...verts.map((v: number[]) => v[0]));
        if (segMaxX < camX - 16 || segMinX > camX + 22) continue;

        if (sType === 'HURDLE') {
          // Dedicated Obstacle Hurdle Renderer: Sharp, true-scale progressive obstacle block
          const xs = verts.map((v: number[]) => toScreenX(v[0]));
          const ys = verts.map((v: number[]) => toScreenY(v[1]));
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const topY = Math.min(...ys);
          const groundY = Math.max(...ys);
          const hw = Math.max(maxX - minX, 8);
          const hh = Math.max(groundY - topY, 4);

          // Find world height
          const maxWorldY = Math.max(...verts.map((v: number[]) => v[1]));

          // Hurdle body
          ctx.fillStyle = 'rgba(244, 63, 94, 0.92)';
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(minX, topY, hw, hh, 2);
          ctx.fill();
          ctx.stroke();

          // Obstacle warning cap
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.roundRect(minX, topY, hw, Math.max(2.5, hh * 0.25), 1);
          ctx.fill();

          // Hurdle marker label with exact progressive height
          ctx.fillStyle = '#fb7185';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`▲ ${maxWorldY.toFixed(2)}m`, minX - 6, topY - 5);
        } else {
          // Render exact polygon of the terrain block
          ctx.beginPath();
          ctx.moveTo(toScreenX(verts[0][0]), toScreenY(verts[0][1]));
          for (let i = 1; i < verts.length; i++) {
            ctx.lineTo(toScreenX(verts[i][0]), toScreenY(verts[i][1]));
          }
          ctx.closePath();

          // Gradient fill based on surface type
          if (sType === 'ICE') {
            ctx.fillStyle = 'rgba(14, 116, 144, 0.45)';
          } else if (sType === 'MUD') {
            ctx.fillStyle = 'rgba(146, 64, 14, 0.55)';
          } else if (sType === 'STAIR') {
            ctx.fillStyle = 'rgba(79, 70, 229, 0.5)';
          } else if (sType === 'SLOPE') {
            ctx.fillStyle = 'rgba(109, 40, 217, 0.45)';
          } else {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          }
          ctx.fill();

          // Find the top surface vertices (highest Y) to draw the glowing top edge
          const sortedVerts = [...verts].sort((a: number[], b: number[]) => b[1] - a[1]);
          const topA = sortedVerts[0];
          const topB = sortedVerts[1];

          ctx.lineWidth = 3;
          if (sType === 'ICE') {
            ctx.strokeStyle = '#38bdf8';
          } else if (sType === 'MUD') {
            ctx.strokeStyle = '#f59e0b';
          } else if (sType === 'STAIR') {
            ctx.strokeStyle = '#818cf8';
          } else if (sType === 'SLOPE') {
            ctx.strokeStyle = '#a78bfa';
          } else {
            ctx.strokeStyle = '#4ade80';
          }

          ctx.beginPath();
          ctx.moveTo(toScreenX(topA[0]), toScreenY(topA[1]));
          ctx.lineTo(toScreenX(topB[0]), toScreenY(topB[1]));
          ctx.stroke();
        }
      }
    }

    // 3. Dynamic LiDAR Beams
    if (this.showLidar && lidarFlat && lidarFlat.length > 0) {
      const numRays = Math.floor(lidarFlat.length / 4);
      for (let i = 0; i < numRays; i++) {
        const hx = lidarFlat[i * 4];
        const hy = lidarFlat[i * 4 + 1];
        const hit = lidarFlat[i * 4 + 3] === 1;

        const sx = toScreenX(rootX);
        const sy = toScreenY(rootY);
        const tx = toScreenX(hx);
        const ty = toScreenY(hy);

        // Ray line
        ctx.strokeStyle = hit ? 'rgba(74, 222, 128, 0.35)' : 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Hit point spark
        if (hit) {
          ctx.fillStyle = '#4ade80';
          ctx.beginPath();
          ctx.arc(tx, ty, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 4. Real Creature Rigid Bodies & Limbs
    if (rig && rig.bodies && bodiesFlat) {
      const jointIds = rig.joint_ids || rig.joints?.map((j: any) => j.id) || [];

      // Map joint strain for limb coloring
      const jointStrainMap: { [key: string]: number } = {};
      for (let i = 0; i < jointIds.length; i++) {
        const jId = jointIds[i];
        const strain = jointsFlat[i * 4 + 3] || 0.0;
        jointStrainMap[jId] = strain;
      }

      for (let bIdx = 0; bIdx < rig.bodies.length; bIdx++) {
        const bCfg = rig.bodies[bIdx];
        const bx = bodiesFlat[bIdx * 3];
        const by = bodiesFlat[bIdx * 3 + 1];
        const ba = bodiesFlat[bIdx * 3 + 2];

        const scrX = toScreenX(bx);
        const scrY = toScreenY(by);
        const bw = bCfg.width * ppm;
        const bh = bCfg.height * ppm;

        ctx.save();
        ctx.translate(scrX, scrY);
        ctx.rotate(-ba); // Invert rotation for canvas screen coords

        // Color based on torque strain and body role
        const isRoot = bCfg.id === rig.root_body_id;
        const matchingJoint = rig.joints?.find((j: any) => j.body_b === bCfg.id || j.body_a === bCfg.id);
        const strain = matchingJoint ? (jointStrainMap[matchingJoint.id] || 0) : 0;

        if (isRoot) {
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2.5;
        } else if (this.showStrain && strain > 0.05) {
          // Dynamic Heatmap: Emerald (low) -> Amber (mid) -> Crimson (peak strain)
          if (strain > 0.7) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
            ctx.strokeStyle = '#f87171';
          } else if (strain > 0.35) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
            ctx.strokeStyle = '#fbbf24';
          } else {
            ctx.fillStyle = 'rgba(74, 222, 128, 0.7)';
            ctx.strokeStyle = '#86efac';
          }
          ctx.lineWidth = 2;
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 2;
        }

        // Draw body shape geometry
        if (bCfg.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, bw / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (bCfg.shape === 'capsule') {
          const r = Math.min(bw, bh) / 2;
          ctx.beginPath();
          ctx.roundRect(-bw / 2, -bh / 2, bw, bh, r);
          ctx.fill();
          ctx.stroke();
        } else {
          // Box
          ctx.beginPath();
          ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 4);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();

        // 5. Foot Contact Reactions
        if (this.showContacts && contacts.includes(bIdx)) {
          ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(scrX, scrY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }

  private drawProceduralFallback(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const cid = this.selectedCreature.id;
    const ppm = 36.0;
    const t = this.simTime * 6; // gait oscillation phase
    const screenCenterX = w * 0.38;
    const screenCenterY = h * 0.68;
    const camX = this.simTrackX;

    const toScreenX = (wx: number) => screenCenterX + (wx - camX) * ppm;
    const toScreenY = (wy: number) => screenCenterY - wy * ppm;

    // 1. Grid Background
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
    ctx.lineWidth = 1;
    const gridSpacing = ppm * 1.0;
    const startGridX = toScreenX(Math.floor(camX - 15)) % gridSpacing;
    for (let x = startGridX; x < w; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // 2. Terrain Ground Plane
    const groundY = toScreenY(0);
    ctx.fillStyle = '#0a0f1d';
    ctx.beginPath();
    ctx.rect(0, groundY, w, h - groundY);
    ctx.fill();

    // Surface color depends on terrain
    let groundColor = '#10b981';
    if (this.selectedTerrain.id === 'variable_friction') groundColor = '#06b6d4';
    else if (this.selectedTerrain.id === 'slopes') groundColor = '#8b5cf6';
    else if (this.selectedTerrain.id === 'stairs') groundColor = '#f59e0b';
    else if (this.selectedTerrain.id === 'hurdles') groundColor = '#ef4444';

    ctx.strokeStyle = groundColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Friction dashes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = (toScreenX(0) % 40); x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 8);
      ctx.lineTo(x + 15, groundY + 18);
      ctx.stroke();
    }

    // 3. Dynamic Procedural Morphology Kinematics
    const bodyBaseY = 1.35 + Math.sin(t * 2) * 0.05;
    const rootSX = toScreenX(camX);
    const rootSY = toScreenY(bodyBaseY);

    if (cid === 'biped') {
      // BIPED CHICKEN
      const legPhases = [t, t + Math.PI];
      legPhases.forEach((phase, legIdx) => {
        const hipAngle = Math.sin(phase) * 0.55;
        const kneeAngle = Math.max(0, -Math.sin(phase)) * 0.85;

        const hipX = rootSX + (legIdx === 0 ? -6 : 6);
        const hipY = rootSY + 8;
        const thighLen = 26;
        const shinLen = 26;

        const kneeX = hipX + Math.sin(hipAngle) * thighLen;
        const kneeY = hipY + Math.cos(hipAngle) * thighLen;
        const footX = kneeX + Math.sin(hipAngle + kneeAngle) * shinLen;
        const footY = Math.min(groundY, kneeY + Math.cos(hipAngle + kneeAngle) * shinLen);

        ctx.strokeStyle = this.showStrain && Math.abs(hipAngle) > 0.4 ? '#fbbf24' : '#34d399';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.stroke();

        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 3, 0, Math.PI * 2);
        ctx.fill();

        if (this.showContacts && footY >= groundY - 2) {
          ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
          ctx.beginPath();
          ctx.arc(footX, groundY, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Body & Beak
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(rootSX, rootSY, 20, 15, Math.sin(t) * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(rootSX + 18, rootSY - 3);
      ctx.lineTo(rootSX + 28, rootSY);
      ctx.lineTo(rootSX + 18, rootSY + 3);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(rootSX + 12, rootSY - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (cid === 'hound') {
      // QUADRUPED HOUND
      const legPairs = [
        { phase: t, offset: -20 },
        { phase: t + Math.PI, offset: -14 },
        { phase: t + Math.PI, offset: 14 },
        { phase: t, offset: 20 }
      ];

      legPairs.forEach(lp => {
        const hipAngle = Math.sin(lp.phase) * 0.45;
        const kneeAngle = Math.max(0, -Math.sin(lp.phase)) * 0.65;
        const hx = rootSX + lp.offset;
        const hy = rootSY + 6;
        const kx = hx + Math.sin(hipAngle) * 18;
        const ky = hy + Math.cos(hipAngle) * 18;
        const fx = kx + Math.sin(hipAngle + kneeAngle) * 18;
        const fy = Math.min(groundY, ky + Math.cos(hipAngle + kneeAngle) * 18);

        ctx.strokeStyle = this.showStrain && Math.abs(hipAngle) > 0.35 ? '#fbbf24' : '#06b6d4';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(kx, ky);
        ctx.lineTo(fx, fy);
        ctx.stroke();

        if (this.showContacts && fy >= groundY - 2) {
          ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
          ctx.beginPath();
          ctx.arc(fx, groundY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Hound Body
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(rootSX - 26, rootSY - 10, 52, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(rootSX + 20, rootSY - 20, 18, 16, 4);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(rootSX - 26, rootSY - 5);
      ctx.quadraticCurveTo(rootSX - 36, rootSY - 16, rootSX - 32, rootSY - 22);
      ctx.stroke();

    } else if (cid === 'hopper') {
      // SINGLE-LEG HOPPER
      const hopPhase = Math.abs(Math.sin(t * 1.4));
      const hopHeight = hopPhase * 36;
      const hopSY = groundY - 48 - hopHeight;
      const legCompress = (1 - hopPhase) * 14;

      const pTopX = rootSX;
      const pTopY = hopSY + 10;
      const pFootX = rootSX;
      const pFootY = Math.min(groundY, pTopY + 34 - legCompress);

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(pTopX, pTopY);
      ctx.lineTo(pFootX, pFootY);
      ctx.stroke();

      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(rootSX - 14, hopSY - 14, 28, 24, 6);
      ctx.fill();
      ctx.stroke();

      if (this.showContacts && pFootY >= groundY - 2) {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
        ctx.beginPath();
        ctx.arc(pFootX, groundY, 5, 0, Math.PI * 2);
        ctx.fill();
      }

    } else {
      // HUMANOID RUNNER
      const legPhase = [t, t + Math.PI];
      const armPhase = [t + Math.PI, t];

      armPhase.forEach(phase => {
        const armAngle = Math.sin(phase) * 0.55;
        const shX = rootSX;
        const shY = rootSY - 12;
        const elX = shX + Math.sin(armAngle) * 15;
        const elY = shY + Math.cos(armAngle) * 15;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(shX, shY);
        ctx.lineTo(elX, elY);
        ctx.stroke();
      });

      legPhase.forEach((phase, legIdx) => {
        const hipAngle = Math.sin(phase) * 0.55;
        const kneeAngle = Math.max(0, -Math.sin(phase)) * 0.75;
        const hx = rootSX + (legIdx === 0 ? -4 : 4);
        const hy = rootSY + 10;
        const kx = hx + Math.sin(hipAngle) * 22;
        const ky = hy + Math.cos(hipAngle) * 22;
        const fx = kx + Math.sin(hipAngle + kneeAngle) * 22;
        const fy = Math.min(groundY, ky + Math.cos(hipAngle + kneeAngle) * 22);

        ctx.strokeStyle = this.showStrain && Math.abs(hipAngle) > 0.4 ? '#f59e0b' : '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(kx, ky);
        ctx.lineTo(fx, fy);
        ctx.stroke();

        if (this.showContacts && fy >= groundY - 2) {
          ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
          ctx.beginPath();
          ctx.arc(fx, groundY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rootSX - 9, rootSY - 16, 18, 26, 4);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rootSX, rootSY - 23, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 4. Procedural LiDAR Beams
    if (this.showLidar) {
      const numRays = 8;
      const angleStart = -Math.PI * 0.12;
      const angleEnd = Math.PI * 0.42;
      for (let i = 0; i < numRays; i++) {
        const angle = angleStart + (i / (numRays - 1)) * (angleEnd - angleStart);
        const rayLen = 130;
        const tx = rootSX + Math.cos(angle) * rayLen;
        const ty = rootSY + Math.sin(angle) * rayLen;
        const hitGround = ty >= groundY;
        const finalY = hitGround ? groundY : ty;
        const finalX = hitGround ? rootSX + (groundY - rootSY) / Math.tan(angle) : tx;

        ctx.strokeStyle = hitGround ? 'rgba(74, 222, 128, 0.35)' : 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(rootSX, rootSY);
        ctx.lineTo(finalX, finalY);
        ctx.stroke();

        if (hitGround) {
          ctx.fillStyle = '#4ade80';
          ctx.beginPath();
          ctx.arc(finalX, groundY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // ==========================================
  // ARGUS OS SIMULATION CONTROLLER & RUNNER
  // ==========================================
  runArgusSimulation() {
    if (this.isArgusRunning) return;
    this.isArgusRunning = true;
    this.argusCurrentStep = 1;
    this.argusSteps.forEach(s => s.status = 'pending');
    this.mailDocLogs.forEach(l => l.status = 'pending');

    const stepDelay = this.argusPlaybackSpeed === 2 ? 650 : 1200;
    let index = 0;

    const executeNext = () => {
      if (!this.isArgusRunning) return;

      if (index < this.argusSteps.length) {
        if (index > 0) {
          this.argusSteps[index - 1].status = 'completed';
        }
        this.argusSteps[index].status = 'running';
        this.argusCurrentStep = index + 1;

        // Parallel branch execution visualization for step 2a & 2b
        if (index === 1) {
          this.argusSteps[2].status = 'running';
          this.argusActiveView = 'doc';
        } else if (index === 2) {
          this.argusSteps[1].status = 'completed';
          this.argusSteps[2].status = 'completed';
          this.argusActiveView = 'memory';
        } else if (index === 0) {
          this.argusActiveView = 'email';
        } else if (index === 3) {
          this.argusActiveView = 'web';
        } else if (index === 4) {
          this.argusActiveView = 'dag';
        } else if (index === 5) {
          this.argusActiveView = 'email';
        }

        if (index < this.mailDocLogs.length) {
          this.mailDocLogs[index].status = 'running';
          if (index > 0) {
            this.mailDocLogs[index - 1].status = 'done';
          }
        }

        index++;
        this.argusTimer = setTimeout(executeNext, stepDelay);
      } else {
        this.argusSteps.forEach(s => s.status = 'completed');
        this.mailDocLogs.forEach(l => l.status = 'done');
        this.argusCurrentStep = this.argusSteps.length;
        this.isArgusRunning = false;
      }
    };

    executeNext();
  }

  resetArgusSimulation() {
    if (this.argusTimer) {
      clearTimeout(this.argusTimer);
      this.argusTimer = null;
    }
    this.isArgusRunning = false;
    this.argusCurrentStep = 0;
    this.argusActiveView = 'dag';
    this.argusSteps.forEach(s => s.status = 'pending');
    this.mailDocLogs.forEach(l => l.status = 'pending');
  }

  jumpToArgusStep(targetStepNumber: number) {
    if (this.argusTimer) {
      clearTimeout(this.argusTimer);
      this.argusTimer = null;
    }
    this.isArgusRunning = false;
    this.argusCurrentStep = targetStepNumber;
    this.argusSteps.forEach((s, idx) => {
      if (idx < targetStepNumber - 1) {
        s.status = 'completed';
      } else if (idx === targetStepNumber - 1) {
        s.status = 'completed';
      } else {
        s.status = 'pending';
      }
    });

    if (targetStepNumber === 1) this.argusActiveView = 'email';
    else if (targetStepNumber === 2) this.argusActiveView = 'doc';
    else if (targetStepNumber === 3) this.argusActiveView = 'memory';
    else if (targetStepNumber === 4) this.argusActiveView = 'web';
    else if (targetStepNumber === 5) this.argusActiveView = 'dag';
    else if (targetStepNumber === 6) this.argusActiveView = 'email';
  }

  setArgusPlaybackSpeed(speed: 1 | 2) {
    this.argusPlaybackSpeed = speed;
  }

  // Alias for backward compatibility
  runMailDocSimulation() {
    this.runArgusSimulation();
  }
}
