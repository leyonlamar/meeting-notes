export interface MeetingTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultTitle: string;
  sections: string;
  tags: string[];
}

export const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch",
    icon: "📝",
    defaultTitle: "Meeting",
    tags: [],
    sections: "",
  },
  {
    id: "sprint-planning",
    name: "Sprint Planning",
    description: "Plan sprint goals, assign tasks, review capacity",
    icon: "🏃",
    defaultTitle: "Sprint Planning",
    tags: ["sprint", "planning"],
    sections: `## Attendees
- Sarah Chen (Tech Lead)
- Mike Rodriguez (Backend)
- Emily Park (Frontend)
- James Wilson (QA)

## Previous Sprint Review
- Completed: User authentication module, API rate limiting
- Carried over: Dashboard analytics widget (80% done)
- Velocity: 34 points completed out of 40 planned

## Sprint Goals
1. Complete dashboard analytics widget and deploy to staging
2. Implement notification service MVP
3. Resolve critical bug in payment processing flow

## Backlog Items
| Item | Owner | Estimate | Priority |
|------|-------|----------|----------|
| Dashboard analytics widget | Emily Park | 5 pts | High |
| Notification service - email channel | Sarah Chen | 8 pts | High |
| Payment bug fix #1247 | Mike Rodriguez | 3 pts | Critical |
| API documentation update | James Wilson | 2 pts | Medium |
| Performance testing for search | James Wilson | 3 pts | Medium |

## Action Items
- [ ] Emily to finish analytics widget by Wednesday
- [ ] Mike to investigate payment bug root cause by EOD today
- [ ] Sarah to draft notification service architecture doc by Thursday
- [ ] James to set up performance test environment by Tuesday

## Risks & Blockers
- Payment bug may require database migration — need DBA review
- Emily is OOO Friday, analytics widget must be done by Thursday
- Third-party email API sandbox access pending vendor approval

## Capacity & Availability
- Sarah: Full capacity
- Mike: Full capacity
- Emily: Available Mon-Thu (OOO Friday)
- James: 80% (supporting prod incident rotation)

## Next Steps
- Daily standups at 9:15 AM
- Mid-sprint check-in on Wednesday
- Sprint demo scheduled for next Friday 2:00 PM
`,
  },
  {
    id: "stakeholder-update",
    name: "Stakeholder Update",
    description: "Executive briefing with status, risks, decisions",
    icon: "📊",
    defaultTitle: "Stakeholder Update",
    tags: ["stakeholder", "status"],
    sections: `## Attendees
- VP Engineering: David Kim
- Product Lead: Maria Santos
- Tech Lead: Sarah Chen
- PM: Alex Johnson

## Executive Summary
Project Atlas is on track for the April 15 launch. Backend services are 90% complete, frontend is 75% complete. Key risk is the pending vendor contract for payment processing. Budget utilization is at 78%, within Q1 targets.

## Project Status
| Workstream | Status | Owner | Notes |
|------------|--------|-------|-------|
| Backend API | 🟢 On Track | Mike Rodriguez | All endpoints complete, load testing in progress |
| Frontend UI | 🟡 At Risk | Emily Park | Dashboard delayed 3 days due to design revisions |
| Infrastructure | 🟢 On Track | DevOps Team | Staging environment ready, prod cutover planned |
| QA & Testing | 🟢 On Track | James Wilson | 85% test coverage, security audit scheduled |
| Documentation | 🟡 At Risk | Alex Johnson | API docs behind schedule, need dedicated writer |

## Key Achievements
- Successfully migrated 50K user accounts to new auth system with zero downtime
- API response times improved 40% after caching layer implementation
- Security audit passed with no critical findings

## Decisions Required
- [ ] Decision: Approve additional $15K for dedicated technical writer
  - Options: (A) Hire contractor for 6 weeks, (B) Reallocate internal resource, (C) Defer docs to post-launch
  - Recommendation: Option A — contractor starts immediately, docs ready for launch

- [ ] Decision: Go/No-Go for April 15 launch date
  - Risk: Frontend dashboard may need 5 extra days
  - Recommendation: Proceed with launch, dashboard goes to Phase 2 if not ready

## Risks & Issues
| Risk | Impact | Likelihood | Mitigation | Owner |
|------|--------|------------|------------|-------|
| Vendor payment API contract delayed | High | Medium | Fallback to Stripe direct integration | Alex Johnson |
| Frontend designer on leave next week | Medium | Confirmed | Pull in contractor designer from bench | Emily Park |
| Load testing reveals DB bottleneck | High | Low | Have migration plan ready, DBA on standby | Mike Rodriguez |

## Budget & Timeline
- Budget utilization: $234K of $300K (78%)
- Remaining runway: $66K through April
- Timeline: 24 of 30 planned work days complete (80%)
- Launch date: April 15, 2026 (on track)

## Action Items
- [ ] Alex to finalize vendor contract by March 28 — escalate to Legal if no response by March 25
- [ ] Sarah to prepare launch readiness checklist by March 30
- [ ] David to approve contractor budget by EOD Friday
- [ ] Emily to deliver revised timeline for dashboard by tomorrow

## Next Steps
- Weekly stakeholder sync continues Thursdays at 10 AM
- Launch readiness review: April 8
- Go/No-Go meeting: April 10
`,
  },
  {
    id: "one-on-one",
    name: "1:1 Meeting",
    description: "Manager-report check-in with goals and feedback",
    icon: "👥",
    defaultTitle: "1:1",
    tags: ["1:1", "check-in"],
    sections: `## Attendees
- Manager: David Kim
- Report: Sarah Chen

## Check-in
- How are things going? Feeling good about sprint progress, but slightly stressed about the notification service deadline. Weekend helped recharge.
- Energy level (1-5): 4

## Updates Since Last Meeting
- Completed the API gateway refactor — merged and deployed to staging
- Paired with Mike on the payment bug — found root cause in currency conversion logic
- Attended the architecture review for the new analytics pipeline
- Started drafting the notification service design doc

## Current Priorities
1. Notification service architecture — need to finalize before sprint mid-point
2. Code review backlog — 4 PRs waiting, will clear by Wednesday
3. Mentoring James on testing best practices — weekly 30-min sessions

## Blockers & Support Needed
- Need access to the email service sandbox (vendor approval pending since last week)
- Would like David's input on whether to use event-driven vs. polling for notification delivery
- Team could use a dedicated QA resource for the next 2 sprints

## Feedback
- Recognition: Great job on the API gateway refactor — clean code, well-documented, zero rollback issues. The team noticed.
- Growth area: Consider delegating more implementation work to junior devs. You tend to take on complex tasks yourself — coaching others through them would multiply the team's capability.

## Career Development
- Sarah interested in moving toward Staff Engineer role in next 12 months
- Action: David to connect Sarah with Staff Engineer mentor (Rachel) for monthly chats
- Sarah to present at next engineering all-hands (topic: API gateway migration lessons)
- Review promotion criteria doc together next 1:1

## Action Items
- [ ] David to request email sandbox access — escalate to vendor relations
- [ ] Sarah to send notification service design doc for review by Thursday
- [ ] David to schedule intro between Sarah and Rachel (Staff Eng mentor)
- [ ] Sarah to prepare 10-min lightning talk for April all-hands

## Next Meeting Topics
- Review notification service design feedback
- Discuss Q2 goal setting
- Follow up on promotion timeline
`,
  },
  {
    id: "brainstorm",
    name: "Brainstorm",
    description: "Ideation session with problem framing and ideas",
    icon: "💡",
    defaultTitle: "Brainstorm Session",
    tags: ["brainstorm", "ideation"],
    sections: `## Attendees
- Sarah Chen, Mike Rodriguez, Emily Park, Lisa Wang (Design)

## Problem Statement
Our user onboarding flow has a 62% drop-off rate between signup and first meaningful action. Users sign up but never create their first project. We need to reduce this to under 40% within 60 days.

## Context & Constraints
- Current flow: Sign up → Email verify → Profile setup → Empty dashboard → ???
- Analytics show users spend avg 8 seconds on the empty dashboard before leaving
- Must work on mobile and desktop
- Cannot require credit card during onboarding
- Engineering budget: 2 sprints max for implementation

## Ideas
### Idea 1: Interactive Guided Tour
- Description: Step-by-step overlay walkthrough that creates a sample project as the user follows along. "Build your first project in 2 minutes."
- Pros: Hands-on learning, user ends with something real, proven pattern (Notion, Figma)
- Cons: Engineering-heavy, maintenance burden when UI changes, some users find tours annoying

### Idea 2: Template Gallery as First Screen
- Description: Replace empty dashboard with a gallery of pre-built templates. One click to start with a populated project. "Pick a starting point."
- Pros: Low friction, showcases product value immediately, easy to A/B test templates
- Cons: Templates need ongoing curation, may not fit all user types, less learning

### Idea 3: AI-Powered Setup Interview
- Description: Chat-style onboarding that asks 3-4 questions about what the user wants to achieve, then auto-generates a personalized workspace.
- Pros: Feels magical, highly personalized, differentiator from competitors
- Cons: Highest engineering cost, AI unpredictability, cold start problem

### Idea 4: Progressive Disclosure with Milestones
- Description: Simplified dashboard with a clear checklist: "Complete 3 steps to unlock your workspace." Each step teaches a feature.
- Pros: Gamification drives completion, clear progress signal, works on mobile
- Cons: Feels corporate/generic, milestone design needs research, may frustrate power users

## Evaluation Criteria
- Time to implement (2 sprint budget)
- Expected impact on drop-off rate
- Mobile compatibility
- Maintenance burden long-term

## Selected Direction
Combine Ideas 2 + 4: Template gallery as the first screen with a subtle milestone tracker. Users pick a template to start, and a sidebar checklist guides them through key features. Low engineering cost, high impact, and testable.

## Open Questions
- How many templates do we need at launch? (Proposal: 6-8)
- Should templates be industry-specific or use-case-specific?
- Do we show the milestone tracker to returning users or only new signups?

## Action Items
- [ ] Lisa to design template gallery mockups by Friday
- [ ] Emily to prototype template loading flow — estimate by Wednesday
- [ ] Mike to set up A/B testing infrastructure for onboarding variants
- [ ] Sarah to define milestone checklist items (5-7 steps)

## Follow-up
- Design review: Next Tuesday at 2 PM
- Engineering estimate review: Next Wednesday
- Decision on template content: Next Thursday with Product team
`,
  },
  {
    id: "project-kickoff",
    name: "Project Kickoff",
    description: "Launch a new project with scope, roles, and timeline",
    icon: "🚀",
    defaultTitle: "Project Kickoff",
    tags: ["kickoff", "project"],
    sections: `## Attendees & Roles
| Name | Role | Responsibility |
|------|------|---------------|
| David Kim | Executive Sponsor | Budget approval, escalation path |
| Alex Johnson | Project Manager | Timeline, coordination, status reporting |
| Sarah Chen | Tech Lead | Architecture, technical decisions |
| Emily Park | Frontend Lead | UI/UX implementation |
| Mike Rodriguez | Backend Lead | API, database, integrations |
| James Wilson | QA Lead | Testing strategy, quality gates |

## Project Overview
- Name: Project Phoenix — Customer Portal Redesign
- Objective: Rebuild the customer-facing portal with modern stack, improving page load times by 60% and increasing self-service task completion by 40%
- Success criteria: (1) Lighthouse score > 90, (2) Self-service rate from 35% to 50%, (3) Support ticket volume reduced 25%, (4) Launch by June 30

## Scope
### In Scope
- Full redesign of customer dashboard, account settings, and billing pages
- New self-service workflows: password reset, plan changes, invoice downloads
- Mobile-responsive design (iOS Safari, Chrome Android)
- Integration with existing REST API (v2)
- Analytics instrumentation (Mixpanel)

### Out of Scope
- Admin portal (Phase 2)
- Native mobile apps
- Chat support widget (separate project)
- Migration of legacy accounts (handled by data team)

## Timeline & Milestones
| Milestone | Target Date | Owner |
|-----------|------------|-------|
| Architecture doc approved | April 5 | Sarah Chen |
| Design system + mockups signed off | April 15 | Emily Park |
| Backend API contracts finalized | April 12 | Mike Rodriguez |
| Alpha build (internal testing) | May 10 | All |
| Beta release (10% traffic) | May 25 | Alex Johnson |
| Full launch | June 30 | Alex Johnson |

## Deliverables
- [ ] Architecture decision record (ADR) — Sarah, April 5
- [ ] Figma design system with component library — Emily, April 15
- [ ] API contract document (OpenAPI spec) — Mike, April 12
- [ ] Test plan and automation framework — James, April 20
- [ ] Launch runbook and rollback plan — Alex, June 20

## Dependencies
- Design team availability (Lisa Wang confirmed 50% allocation)
- API v2 must be stable (currently in beta — Mike to confirm readiness)
- Mixpanel contract renewal (Alex to confirm with Finance by April 1)

## Risks
- API v2 beta stability — if major bugs found, could delay by 2 weeks
- Designer availability drops if another project escalates
- Customer data migration complexity unknown until schema review complete

## Communication Plan
- Cadence: Weekly project sync Tuesdays 11 AM, async updates in #project-phoenix Slack
- Channels: Slack for daily, Confluence for docs, Jira for tracking
- Escalation path: Alex → David for budget/timeline, Sarah → David for technical blockers
- Stakeholder updates: Bi-weekly email digest to leadership

## Action Items
- [ ] Sarah to draft architecture ADR by April 3 for team review
- [ ] Emily to schedule design kickoff with Lisa by end of week
- [ ] Mike to run API v2 stability report and share results by Monday
- [ ] Alex to confirm Mixpanel contract status with Finance
- [ ] James to evaluate testing frameworks (Playwright vs Cypress) and recommend by April 5

## Next Meeting
- Date: Next Tuesday, 11 AM
- Agenda: Review architecture draft, design system progress, API stability report
`,
  },
  {
    id: "retrospective",
    name: "Retrospective",
    description: "Reflect on what worked, what didn't, and improvements",
    icon: "🔄",
    defaultTitle: "Retrospective",
    tags: ["retro", "improvement"],
    sections: `## Attendees
- Sarah Chen, Mike Rodriguez, Emily Park, James Wilson, Alex Johnson (facilitator)

## Period Under Review
Sprint 13 (March 4–15, 2026) — Authentication Module & API Gateway

## What Went Well
- Auth module shipped 2 days early — clean implementation, zero post-deploy issues
- Pair programming sessions between Sarah and Mike were highly productive
- Automated test coverage hit 92% — highest ever for this team
- Stakeholder demo went smoothly — positive feedback from VP Engineering
- Team morale is high — everyone feels ownership of the work

## What Didn't Go Well
- API gateway had 3 rollbacks during initial deploy — insufficient staging testing
- Code review turnaround averaged 2.5 days — too slow, blocked Emily twice
- Sprint planning overcommitted by 8 points — 40 planned, 34 delivered
- Documentation fell behind — API docs still incomplete at sprint end
- Too many meetings on Wednesday — no deep work time for anyone

## What We Learned
- Staging environment needs to mirror production data volumes for realistic testing
- Smaller PRs (< 300 lines) get reviewed 4x faster than large ones
- Having a dedicated "docs day" at end of sprint prevents debt accumulation
- The team works best with 2-hour meeting-free blocks in the morning

## Action Items for Improvement
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| Set up prod-like data seeding for staging | Mike Rodriguez | March 22 | High |
| Implement PR size limit warning (> 300 lines) in CI | Sarah Chen | March 20 | Medium |
| Block Wednesday afternoons as no-meeting time | Alex Johnson | March 18 | High |
| Schedule docs day on last Friday of each sprint | Alex Johnson | March 18 | Medium |
| Reduce sprint commitment to 35 points next sprint | Alex Johnson | Next planning | Low |

## Metrics
- Velocity: 34 points (target: 40, adjusted target: 35)
- Quality: 0 production bugs from new code, 3 staging rollbacks
- Team health: 4.2/5 (up from 3.8 last sprint)
- PR cycle time: 2.5 days avg (target: < 1 day)

## Shoutouts
- Mike for the late-night production save on March 10 — caught the memory leak before it hit customers
- Emily for the beautiful dashboard redesign — multiple stakeholders called it out positively
- James for building the automated regression suite — already caught 2 bugs in staging

## Decisions
- Adopting "small PR" policy: all PRs should be < 300 lines where possible
- Wednesday PM is now protected deep work time — no meetings allowed
- Sprint commitment reduced from 40 to 35 points for the next 2 sprints
`,
  },
  {
    id: "client-meeting",
    name: "Client Meeting",
    description: "External meeting with agenda, notes, and follow-ups",
    icon: "🤝",
    defaultTitle: "Client Meeting",
    tags: ["client", "external"],
    sections: `## Meeting Details
- Client: Acme Corporation
- Date: March 22, 2026
- Location: Virtual — Microsoft Teams

## Attendees
### Internal
- Alex Johnson (Account Manager)
- Sarah Chen (Tech Lead)
- Emily Park (Product Designer)

### Client
- Jennifer Walsh (VP Operations, Acme)
- Tom Bradley (IT Director, Acme)
- Priya Patel (Project Lead, Acme)

## Agenda
1. Q1 project status review
2. Demo of new reporting dashboard
3. Discuss Phase 2 requirements
4. Timeline and budget for next quarter

## Discussion Notes
Jennifer opened by expressing satisfaction with the Q1 deliverables — the automated invoicing module reduced their manual processing by 60%. Tom confirmed the integration with their SAP system is stable with no incidents since go-live.

Priya raised concerns about the mobile experience — field workers are struggling with the current responsive layout on tablets. Emily showed mockups for a tablet-optimized view that Priya responded positively to.

Dashboard demo received strong positive reaction. Jennifer asked if the executive summary view could include year-over-year comparison charts. Sarah confirmed this is feasible within the existing data model.

Phase 2 discussion focused on three priorities from Acme: (1) mobile/tablet optimization, (2) advanced reporting with YoY comparisons, (3) SSO integration with their Azure AD. Tom emphasized SSO is a hard requirement for their IT security compliance audit in July.

Budget discussion: Jennifer indicated approval for $85K for Phase 2 pending board review on April 5. Timeline preference is completion by end of Q3.

## Decisions Made
- Proceed with tablet-optimized redesign as top priority for Phase 2
- Include YoY comparison in dashboard — no additional cost, part of reporting enhancement
- SSO integration must be complete before July 15 (Acme compliance deadline)
- Bi-weekly status calls to replace current monthly cadence during Phase 2

## Client Requests
- Tablet mockups shared with Priya for internal review by March 28
- SOW for Phase 2 delivered by April 3 (before Acme board meeting April 5)
- SSO technical requirements document from Tom by March 25
- Data export feature for compliance team (new request — needs scoping)

## Deliverables
| Deliverable | Owner | Due Date |
|-------------|-------|----------|
| Tablet UI mockups (3 key screens) | Emily Park | March 28 |
| Phase 2 SOW with pricing | Alex Johnson | April 3 |
| SSO architecture proposal | Sarah Chen | April 1 |
| Data export scoping estimate | Mike Rodriguez | March 30 |

## Action Items
### Our Actions
- [ ] Emily to deliver tablet mockups to Priya by March 28
- [ ] Alex to prepare Phase 2 SOW with $85K budget breakdown by April 3
- [ ] Sarah to draft SSO integration architecture (Azure AD) by April 1
- [ ] Mike to scope data export feature and provide estimate by March 30
- [ ] Alex to send meeting summary to all attendees by EOD today

### Client Actions
- [ ] Tom to send Azure AD technical specs and admin access for sandbox by March 25
- [ ] Priya to provide list of critical tablet workflows (top 5) by March 26
- [ ] Jennifer to confirm budget approval after April 5 board meeting

## Next Meeting
- Date: April 8, 2026, 2:00 PM
- Agenda: Review SOW, tablet mockup feedback, SSO technical review
`,
  },
  {
    id: "incident-review",
    name: "Incident Review",
    description: "Post-incident analysis with timeline and remediation",
    icon: "🔥",
    defaultTitle: "Incident Review",
    tags: ["incident", "postmortem"],
    sections: `## Incident Summary
- Severity: SEV-2 (Major — customer-facing impact)
- Duration: 2 hours 15 minutes (14:30 – 16:45 UTC, March 18, 2026)
- Impact: 15% of API requests returned 500 errors; ~2,300 users affected; payment processing unavailable
- Resolved: Yes — rolled back deployment and applied hotfix

## Attendees
- Sarah Chen (Tech Lead, Incident Commander)
- Mike Rodriguez (Backend — primary responder)
- James Wilson (QA)
- Alex Johnson (PM — customer communications)
- David Kim (VP Engineering — observer)

## Timeline
| Time (UTC) | Event |
|------|-------|
| 14:15 | Deploy v2.4.1 pushed to production (automated CI/CD) |
| 14:30 | Monitoring alert: 500 error rate spikes to 15% (threshold: 1%) |
| 14:32 | On-call (Mike) acknowledges alert, begins investigation |
| 14:38 | Mike identifies errors originating from payment service — currency conversion endpoint |
| 14:42 | Sarah joins as Incident Commander, opens war room |
| 14:50 | Root cause identified: new currency conversion logic fails on 3-letter ISO codes with trailing whitespace in legacy data |
| 14:55 | Decision: rollback v2.4.1 rather than hotfix in production |
| 15:05 | Rollback initiated |
| 15:12 | Rollback complete — error rate drops to 0.3% |
| 15:20 | Alex sends customer notification: "Payment processing temporarily disrupted, now restored" |
| 15:30 | Mike begins hotfix: add input trimming to currency conversion |
| 16:00 | Hotfix PR reviewed by Sarah, merged |
| 16:15 | Hotfix deployed to staging, tested with legacy data set |
| 16:30 | Hotfix deployed to production |
| 16:45 | Confirmed: all metrics nominal, incident resolved |

## Root Cause
The v2.4.1 deployment included a refactored currency conversion function that used strict ISO 4217 code matching. Legacy records in the database contained currency codes with trailing whitespace (e.g., "USD " instead of "USD") from a 2019 data import. The new function threw a CurrencyNotFound exception for these records, causing 500 errors on any transaction involving affected accounts.

## Contributing Factors
- No staging test with production-like data — staging uses synthetic data only
- The legacy data quality issue was known but documented only in a 2019 Jira ticket (closed)
- CI pipeline does not include integration tests against a production data snapshot
- Deployment happened during peak hours (2:30 PM UTC) without a rollout canary

## What Went Well
- Alert fired within 15 minutes of deploy — monitoring thresholds worked
- Incident Commander role was clear — Sarah took charge quickly
- Rollback was clean and fast (7 minutes)
- Customer communication went out within 50 minutes
- Hotfix was developed, reviewed, tested, and deployed within 90 minutes

## What Went Poorly
- No canary deployment — 100% of traffic hit the broken code immediately
- Production data issues not caught because staging data is synthetic
- The legacy data issue was known but not tracked as tech debt
- Deployment during peak hours amplified impact

## Remediation Actions
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| Implement canary deployments (5% → 25% → 100%) | Sarah Chen | April 5 | Critical |
| Create production data snapshot for staging (sanitized) | Mike Rodriguez | March 25 | Critical |
| Add integration test suite that runs against prod-like data | James Wilson | April 1 | High |
| Data cleanup: trim all whitespace in currency code fields | Mike Rodriguez | March 22 | High |
| Move deployments to low-traffic window (06:00 UTC) | Alex Johnson | March 20 | Medium |
| Audit all legacy data imports for similar quality issues | James Wilson | April 10 | Medium |

## Prevention Measures
- All deployments must use canary rollout starting April 5
- Staging environment to be refreshed weekly with sanitized production data
- "Known data issues" to be tracked as active tech debt in backlog, not closed tickets
- Pre-deploy checklist to include "legacy data compatibility" verification

## Lessons Learned
- Synthetic test data gives false confidence — production data is the only real test
- Known issues that are "documented and closed" still bite you — track them as active risks
- Fast rollback capability was the hero — invest in making rollbacks even faster
- The 15-minute alert threshold was exactly right — don't loosen it
`,
  },
];

export function getTemplate(id: string): MeetingTemplate | undefined {
  return MEETING_TEMPLATES.find((t) => t.id === id);
}
