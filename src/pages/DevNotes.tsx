import { Layout } from "@/components/Layout";
import { PixelCard } from "@/components/PixelCard";

const devPosts = [
  {
    id: 1,
    title: "React 18 새로운 기능 탐구",
    date: "2024.03.15",
    category: "React",
    emoji: "⚛️",
    preview: "Concurrent Mode와 Suspense에 대해 알아보았습니다...",
  },
  {
    id: 2,
    title: "TypeScript 제네릭 완벽 가이드",
    date: "2024.03.10",
    category: "TypeScript",
    emoji: "📘",
    preview: "제네릭을 활용한 타입 안전성 확보 방법...",
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox 비교",
    date: "2024.03.05",
    category: "CSS",
    emoji: "🎨",
    preview: "언제 어떤 레이아웃 방식을 사용해야 할까?...",
  },
];

const DevNotes = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-sm md:text-base pixel-text-shadow inline-block px-4 py-2 bg-primary text-primary-foreground">
            💻 개발노트 / DEV NOTES 💻
          </h1>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {[
            { name: "전체", emoji: "📚" },
            { name: "React", emoji: "⚛️" },
            { name: "TypeScript", emoji: "📘" },
            { name: "CSS", emoji: "🎨" },
            { name: "기타", emoji: "📦" },
          ].map((cat) => (
            <button
              key={cat.name}
              className="px-3 py-1 text-[10px] pixel-btn bg-card hover:bg-primary hover:text-primary-foreground"
            >
              {cat.emoji} [{cat.name}]
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {devPosts.map((post) => (
            <PixelCard key={post.id} title={`${post.emoji} ${post.title}`}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[8px] text-muted-foreground">
                  <span>📅 {post.date}</span>
                  <span className="px-2 bg-primary text-primary-foreground">
                    🏷️ {post.category}
                  </span>
                </div>
                <p>{post.preview}</p>
                <button className="text-primary hover:underline">
                  [ 👉 더 읽기 → ]
                </button>
              </div>
            </PixelCard>
          ))}
        </div>

        {/* Empty State Message */}
        <div className="text-center mt-8 text-muted-foreground">
          <p className="text-[10px]">🚧 더 많은 글이 곧 업데이트됩니다! 🚧</p>
        </div>
      </div>
    </Layout>
  );
};

export default DevNotes;
