import { TopicStartClient } from "@/components/TopicStartClient";
import { practiceTopics } from "@/lib/topics";
import { TopicSlug } from "@/lib/types";

export function generateStaticParams() {
  return practiceTopics.map((topic) => ({ topicSlug: topic.slug }));
}

export default async function TopicStartPage({ params }: { params: Promise<{ topicSlug: TopicSlug }> }) {
  const { topicSlug } = await params;
  return <TopicStartClient topicSlug={topicSlug} />;
}
