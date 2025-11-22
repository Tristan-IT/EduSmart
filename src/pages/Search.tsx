import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, BookOpen, TrendingUp, Clock } from "lucide-react";
import { mockTopics, mockQuizQuestions } from "@/data/mockData";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredTopics = mockTopics.filter(topic =>
    topic.title.toLowerCase().includes(query.toLowerCase()) ||
    topic.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredQuestions = mockQuizQuestions.filter(q =>
    q.question.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar role="student" />
        <div className="flex-1">
          <header className="sticky top-0 z-50 h-16 border-b bg-card/95 backdrop-blur flex items-center px-4 gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-bold">Pencarian</h1>
          </header>

          <div className="container px-4 py-8 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8 animate-fade-in">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari topik, materi, atau soal..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {query.length === 0 ? (
              <div className="space-y-6">
                <Card className="animate-scale-in">
                  <CardContent className="py-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">Mulai Pencarian</h3>
                    <p className="text-muted-foreground">
                      Ketik untuk mencari topik, materi pembelajaran, atau soal latihan
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Pencarian Populer</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => setQuery("aljabar")}>
                      Aljabar
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => setQuery("geometri")}>
                      Geometri
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => setQuery("persamaan")}>
                      Persamaan
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => setQuery("statistika")}>
                      Statistika
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Topics Results */}
                {filteredTopics.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Topik Pembelajaran ({filteredTopics.length})
                    </h3>
                    <div className="space-y-3">
                      {filteredTopics.map((topic, index) => (
                        <Card 
                          key={topic.id}
                          className="hover:shadow-lg transition-all cursor-pointer animate-slide-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => navigate('/belajar', { state: { topicId: topic.id } })}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{topic.title}</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {topic.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <Badge variant="outline">
                                    {topic.difficulty === 'beginner' ? 'Pemula' : topic.difficulty === 'intermediate' ? 'Menengah' : 'Lanjutan'}
                                  </Badge>
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    {topic.estimatedMinutes} menit
                                  </span>
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <TrendingUp className="w-4 h-4" />
                                    {topic.progressPercent}% selesai
                                  </span>
                                </div>
                              </div>
                              <Button size="sm">
                                Belajar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions Results */}
                {filteredQuestions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      📝 Soal Latihan ({filteredQuestions.length})
                    </h3>
                    <div className="space-y-3">
                      {filteredQuestions.map((question, index) => (
                        <Card 
                          key={question.id}
                          className="hover:shadow-lg transition-all cursor-pointer animate-slide-in"
                          style={{ animationDelay: `${(filteredTopics.length + index) * 50}ms` }}
                          onClick={() => navigate('/quiz', { state: { topicId: question.topicId } })}
                        >
                          <CardContent className="p-4">
                            <p className="font-medium mb-2">{question.question}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant={question.difficulty === 1 ? "secondary" : question.difficulty === 2 ? "default" : "destructive"} className="text-xs">
                                {question.difficulty === 1 ? 'Mudah' : question.difficulty === 2 ? 'Sedang' : 'Sulit'}
                              </Badge>
                              <span className="text-sm text-muted-foreground capitalize">
                                {question.topicId}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {filteredTopics.length === 0 && filteredQuestions.length === 0 && (
                  <Card className="animate-fade-in">
                    <CardContent className="py-12 text-center">
                      <div className="text-6xl mb-4">😕</div>
                      <h3 className="text-xl font-semibold mb-2">Tidak Ada Hasil</h3>
                      <p className="text-muted-foreground">
                        Coba kata kunci yang berbeda atau lebih spesifik
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Search;
