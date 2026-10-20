import type { Topic, TopicId } from "./types";

export const TOPICS: Topic[] = [
  {
    id: "cloud-concepts",
    title: "Describe cloud concepts",
    summary: "Cloud models, shared responsibility, consumption pricing and service types.",
    examWeight: "25–30%",
  },
  {
    id: "architecture-services",
    title: "Describe Azure architecture and services",
    summary: "Regions, resource groups, compute, networking, storage and identity.",
    examWeight: "35–40%",
  },
  {
    id: "management-governance",
    title: "Describe Azure management and governance",
    summary: "Cost management, Azure Policy, locks, monitoring and deployment tools.",
    examWeight: "30–35%",
  },
];

export const ALL_TOPIC_IDS = TOPICS.map((t) => t.id);

export function getTopic(id: TopicId): Topic {
  return TOPICS.find((t) => t.id === id)!;
}

export function parseTopics(raw: unknown): TopicId[] {
  if (typeof raw !== "string" || !raw) return ALL_TOPIC_IDS;
  const ids = raw.split(",").filter((x): x is TopicId => ALL_TOPIC_IDS.includes(x as TopicId));
  return ids.length ? ids : ALL_TOPIC_IDS;
}

export function topicsLabel(ids: TopicId[]): string {
  if (ids.length === ALL_TOPIC_IDS.length) return "All AZ-900 topics";
  return ids.map((id) => getTopic(id).title).join(" · ");
}
