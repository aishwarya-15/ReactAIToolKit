import { Button } from '@/shared/components/ui'

const DEFAULT_TOPICS = [
  'React Hooks', 'JavaScript ES6+', 'CSS Flexbox',
  'Node.js Basics', 'Redux', 'TypeScript', 'Web APIs',
  'Git Commands', 'SQL Basics', 'Python Basics',
]

export default function TopicSelector({ topics = DEFAULT_TOPICS, onSelect }) {
  return (
    <div className="topic-suggestions">
      {topics.map((topic) => (
        <Button key={topic} variant="sample" onClick={() => onSelect(topic)}>
          {topic}
        </Button>
      ))}
    </div>
  )
}
