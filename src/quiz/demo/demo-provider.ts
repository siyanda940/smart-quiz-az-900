/**
 * DEMONSTRATION DATA ONLY — not the final question bank.
 * Replace `quizProvider` in src/quiz/provider.ts with the real implementation.
 */
import type { AnswerFeedback, PublicQuestion, QuizProvider, TopicId } from "../types";

interface DemoQuestion extends PublicQuestion {
  correctOptionId: string;
  explanation: string;
}

const q = (
  id: string,
  topicId: TopicId,
  text: string,
  opts: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string,
): DemoQuestion => ({
  id,
  topicId,
  text,
  isDemo: true,
  options: opts.map((t, i) => ({ id: `${id}-${i}`, text: t })),
  correctOptionId: `${id}-${correct}`,
  explanation,
});

const DEMO: DemoQuestion[] = [
  q("cc1", "cloud-concepts", "Which cloud model lets you run workloads on-premises and in a public cloud together?", ["Public cloud", "Private cloud", "Hybrid cloud", "Community cloud"], 2, "A hybrid cloud combines on-premises (private) infrastructure with public cloud resources."),
  q("cc2", "cloud-concepts", "In the shared responsibility model, who is always responsible for your data?", ["Microsoft", "The customer", "The internet provider", "Nobody"], 1, "Customers always own their data, devices, accounts and identities, regardless of service type."),
  q("cc3", "cloud-concepts", "Which service type gives you the most control over the operating system?", ["SaaS", "PaaS", "IaaS", "Serverless"], 2, "IaaS provides virtual machines where you manage the OS, middleware and applications."),
  q("cc4", "cloud-concepts", "What does the consumption-based pricing model mean?", ["You pay a fixed yearly fee", "You pay only for resources you use", "Everything is free", "You buy hardware up front"], 1, "Consumption-based pricing charges only for what you use, turning CapEx into OpEx."),
  q("cc5", "cloud-concepts", "Which benefit describes automatically adding resources when demand increases?", ["Elasticity", "Governance", "Durability", "Compliance"], 0, "Elasticity is the ability to automatically scale resources to match demand."),
  q("as1", "architecture-services", "What is an Azure region?", ["A single server rack", "A geographical area containing one or more datacentres", "A billing account", "A virtual network"], 1, "A region is a geographical area with one or more datacentres connected by a low-latency network."),
  q("as2", "architecture-services", "What logical container holds related Azure resources?", ["Subscription", "Management group", "Resource group", "Tenant"], 2, "Resource groups hold related resources so they can be managed as a unit."),
  q("as3", "architecture-services", "Which service runs code in response to events without managing servers?", ["Azure Virtual Machines", "Azure Functions", "Azure Disk Storage", "Azure ExpressRoute"], 1, "Azure Functions is a serverless compute service that runs code on demand."),
  q("as4", "architecture-services", "Which service provides a private connection from on-premises to Azure that does not use the public internet?", ["VPN Gateway", "Azure DNS", "ExpressRoute", "Azure CDN"], 2, "ExpressRoute provides a private, dedicated connection via a connectivity provider."),
  q("as5", "architecture-services", "What does Microsoft Entra ID primarily provide?", ["Object storage", "Identity and access management", "Virtual networking", "Cost reporting"], 1, "Microsoft Entra ID (formerly Azure AD) is Azure's cloud identity and access service."),
  q("mg1", "management-governance", "Which tool helps enforce rules such as allowed resource locations?", ["Azure Policy", "Azure Advisor", "Azure Monitor", "Azure Boards"], 0, "Azure Policy evaluates and enforces rules on resource properties like location."),
  q("mg2", "management-governance", "What prevents a resource from being accidentally deleted?", ["A tag", "A resource lock", "A budget", "A blueprint"], 1, "A CanNotDelete resource lock blocks deletion while still allowing changes."),
  q("mg3", "management-governance", "Which tool estimates the cost of Azure services before deployment?", ["Pricing calculator", "Azure Monitor", "Service Health", "Azure Arc"], 0, "The pricing calculator estimates costs for services you plan to deploy."),
  q("mg4", "management-governance", "Which service gives personalised recommendations for cost, security and reliability?", ["Azure Advisor", "Azure Policy", "Azure Bastion", "Azure Files"], 0, "Azure Advisor analyses your resources and recommends improvements."),
  q("mg5", "management-governance", "What lets you deploy infrastructure declaratively using templates?", ["Azure Resource Manager templates", "Azure Cost Management", "Resource locks", "Microsoft Purview"], 0, "ARM templates (and Bicep) describe infrastructure as code for repeatable deployments."),
];

const strip = ({ correctOptionId: _c, explanation: _e, ...pub }: DemoQuestion): PublicQuestion => pub;

export const demoProvider: QuizProvider = {
  countAvailable: (topicIds) => DEMO.filter((d) => topicIds.includes(d.topicId)).length,
  getQuestions: (topicIds, count) => {
    const pool = DEMO.filter((d) => topicIds.includes(d.topicId));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(strip);
  },
  submitAnswer: (questionId, selectedOptionId): AnswerFeedback => {
    const d = DEMO.find((x) => x.id === questionId);
    if (!d) throw new Error(`Unknown question ${questionId}`);
    return {
      questionId,
      isCorrect: d.correctOptionId === selectedOptionId,
      correctOptionId: d.correctOptionId,
      explanation: d.explanation,
    };
  },
};
