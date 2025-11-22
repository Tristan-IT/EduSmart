// Mock data untuk AI Chat dengan personalisasi untuk Tristan Firdaus

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  attachments?: {
    type: 'image' | 'file' | 'code';
    url?: string;
    name?: string;
    content?: string;
  }[];
  reactions?: string[];
  codeBlocks?: {
    language: string;
    code: string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  topic: string;
  isPinned?: boolean;
}

export interface StudentProfile {
  name: string;
  grade: string;
  learningStyle: string;
  strengths: string[];
  areasToImprove: string[];
  interests: string[];
  currentLevel: number;
  xp: number;
  preferredLanguage: string;
}

export interface SuggestedQuestion {
  id: string;
  question: string;
  category: string;
  icon: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  description: string;
}

// Profil Siswa - Tristan Firdaus
export const studentProfile: StudentProfile = {
  name: 'Tristan Firdaus',
  grade: '10',
  learningStyle: 'Visual & Hands-on',
  strengths: ['Matematika', 'Logika', 'Pemrograman', 'Problem Solving'],
  areasToImprove: ['Manajemen Waktu', 'Konsistensi Belajar', 'Menulis Essay'],
  interests: ['Coding', 'Game Development', 'AI & Machine Learning', 'Robotics'],
  currentLevel: 15,
  xp: 3450,
  preferredLanguage: 'Bahasa Indonesia'
};

// Current Active Chat Messages
export const currentChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: `Halo Tristan! 👋 Selamat datang kembali! Saya adalah AI Mentor pribadi kamu. Saya siap membantu kamu belajar dengan cara yang paling cocok untukmu.

Saya sudah mempelajari profil belajar kamu dan tahu bahwa kamu:
- Suka belajar dengan pendekatan visual dan hands-on
- Hebat dalam matematika dan programming
- Tertarik dengan AI & Machine Learning

Hari ini ada yang ingin kamu pelajari? Atau mau lanjut materi kemarin tentang algoritma sorting? 🚀`,
    timestamp: new Date('2025-11-07T09:00:00'),
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Halo! Iya, aku mau lanjut tentang algoritma sorting. Tapi kemarin aku masih bingung bedanya Quick Sort sama Merge Sort. Bisa jelasin lagi?',
    timestamp: new Date('2025-11-07T09:02:15'),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: `Tentu! Aku akan jelaskan dengan cara yang mudah dipahami untuk kamu, Tristan.

**Quick Sort vs Merge Sort - Analogi Sederhana:**

**🎯 Quick Sort** seperti memilih satu "pivot" (pemain terbaik) di tim basket, lalu membagi tim menjadi yang lebih tinggi dan lebih pendek dari pivot itu. Lakukan terus sampai semua terurut.

**📦 Merge Sort** seperti memecah deck kartu menjadi bagian kecil-kecil (sampai 1 kartu), lalu menggabungkan kembali dengan urutan yang benar.

**Perbedaan Utama:**

| Aspek | Quick Sort | Merge Sort |
|-------|-----------|------------|
| Strategi | Divide & Conquer (pilih pivot) | Divide & Conquer (bagi rata) |
| Worst Case | O(n²) | O(n log n) |
| Space | O(log n) - lebih efisien | O(n) - butuh extra space |
| Kapan Bagus | Data acak, in-place sorting | Data besar, stable sort |

Mau lihat visualisasi atau contoh kode untuk lebih jelas?`,
    timestamp: new Date('2025-11-07T09:03:30'),
    codeBlocks: [],
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'Wah mantap penjelasannya! Bisa kasih contoh kode Quick Sort dalam Python? Sama visualisasi step-by-step nya kalau bisa.',
    timestamp: new Date('2025-11-07T09:05:00'),
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: `Perfect! Karena kamu suka hands-on, aku buatin contoh kode yang bisa langsung kamu coba:

\`\`\`python
def quick_sort(arr):
    """
    Quick Sort Implementation
    Cocok untuk data acak, efficient in-place sorting
    """
    if len(arr) <= 1:
        return arr
    
    # Pilih pivot (elemen tengah)
    pivot = arr[len(arr) // 2]
    
    # Partisi array
    left = [x for x in arr if x < pivot]    # Lebih kecil dari pivot
    middle = [x for x in arr if x == pivot]  # Sama dengan pivot
    right = [x for x in arr if x > pivot]    # Lebih besar dari pivot
    
    # Recursive sort dan gabungkan
    return quick_sort(left) + middle + quick_sort(right)

# Contoh penggunaan
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Before:", numbers)
sorted_numbers = quick_sort(numbers)
print("After:", sorted_numbers)
\`\`\`

**Step-by-Step Visualisasi:**

**Initial Array:** [64, 34, 25, 12, 22, 11, 90]
**Pivot:** 25 (elemen tengah)

**Step 1 - Partisi:**
- Left (< 25): [12, 22, 11]
- Middle (= 25): [25]
- Right (> 25): [64, 34, 90]

**Step 2 - Recursive pada Left [12, 22, 11]:**
- Pivot: 22
- Left: [12, 11]
- Middle: [22]
- Right: []

**Step 3 - Recursive pada [12, 11]:**
- Pivot: 11
- Left: []
- Middle: [11]
- Right: [12]

**Result dari left:** [11, 12, 22]

**Step 4 - Recursive pada Right [64, 34, 90]:**
- Pivot: 34
- Left: []
- Middle: [34]
- Right: [64, 90]

**Result dari right:** [34, 64, 90]

**Final Result:** [11, 12, 22] + [25] + [34, 64, 90] = **[11, 12, 22, 25, 34, 64, 90]** ✨

Coba run kodenya dan eksperimen dengan array lain! Mau challenge untuk implement versi in-place yang lebih memory efficient?`,
    timestamp: new Date('2025-11-07T09:07:45'),
    codeBlocks: [
      {
        language: 'python',
        code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`
      }
    ]
  },
  {
    id: 'msg-6',
    role: 'user',
    content: 'Wow keren! Iya mau dong challenge in-place version!',
    timestamp: new Date('2025-11-07T09:10:20'),
  },
  {
    id: 'msg-7',
    role: 'assistant',
    content: `Mantap Tristan! Ini adalah challenge yang cocok untuk melatih skill problem solving kamu! 💪

**Challenge: In-Place Quick Sort**

Versi in-place lebih efisien karena tidak membuat array baru. Gunakan teknik "partitioning" langsung di array asli.

\`\`\`python
def quick_sort_inplace(arr, low=0, high=None):
    """
    In-place Quick Sort - Memory Efficient Version
    Space Complexity: O(log n) instead of O(n)
    """
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition dan dapatkan pivot index
        pivot_index = partition(arr, low, high)
        
        # Sort left dan right secara recursive
        quick_sort_inplace(arr, low, pivot_index - 1)
        quick_sort_inplace(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    """
    Lomuto Partition Scheme
    Memindahkan elemen yang lebih kecil ke kiri pivot
    """
    # Pilih elemen terakhir sebagai pivot
    pivot = arr[high]
    i = low - 1  # Index untuk elemen yang lebih kecil
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            # Swap
            arr[i], arr[j] = arr[j], arr[i]
    
    # Tempatkan pivot di posisi yang benar
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Test
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Before:", numbers)
quick_sort_inplace(numbers)
print("After:", numbers)
\`\`\`

**🎯 Challenge untuk kamu:**

1. **Implementasi Hoare's Partition** - Metode partisi yang lebih efisien dari Lomuto
2. **Randomized Quick Sort** - Pilih pivot secara random untuk menghindari worst case
3. **3-Way Quick Sort** - Untuk handle duplicate values lebih baik

**💡 Hints:**
- Hoare menggunakan two pointers dari kedua ujung
- Random pivot: \`random.randint(low, high)\`
- 3-Way: buat 3 partisi (< pivot, = pivot, > pivot)

Mau coba implement salah satu? Atau butuh hint lebih lanjut?`,
    timestamp: new Date('2025-11-07T09:12:50'),
    codeBlocks: [
      {
        language: 'python',
        code: `def quick_sort_inplace(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort_inplace(arr, low, pivot_index - 1)
        quick_sort_inplace(arr, pivot_index + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
      }
    ]
  }
];

// Chat History - Riwayat Percakapan Sebelumnya
export const chatHistory: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Algoritma Sorting - Quick Sort & Merge Sort',
    lastMessage: 'Mau coba implement salah satu? Atau butuh hint lebih lanjut?',
    timestamp: new Date('2025-11-07T09:12:50'),
    messageCount: 7,
    topic: 'Algorithms',
    isPinned: true,
  },
  {
    id: 'session-2',
    title: 'Introduction to Machine Learning',
    lastMessage: 'Supervised learning cocok untuk masalah dengan labeled data seperti klasifikasi email spam',
    timestamp: new Date('2025-11-06T14:30:00'),
    messageCount: 15,
    topic: 'AI & ML',
    isPinned: true,
  },
  {
    id: 'session-3',
    title: 'Recursion & Dynamic Programming',
    lastMessage: 'Fibonacci dengan memoization jauh lebih cepat! Complexity turun dari O(2^n) ke O(n)',
    timestamp: new Date('2025-11-05T16:45:00'),
    messageCount: 12,
    topic: 'Algorithms',
  },
  {
    id: 'session-4',
    title: 'Binary Search Tree Operations',
    lastMessage: 'Kamu sudah paham insert dan delete, sekarang coba implement balance tree',
    timestamp: new Date('2025-11-04T10:15:00'),
    messageCount: 18,
    topic: 'Data Structures',
  },
  {
    id: 'session-5',
    title: 'Graph Algorithms - BFS & DFS',
    lastMessage: 'BFS bagus untuk shortest path, DFS untuk exploring all possibilities',
    timestamp: new Date('2025-11-03T13:20:00'),
    messageCount: 20,
    topic: 'Algorithms',
  },
  {
    id: 'session-6',
    title: 'Object-Oriented Programming Concepts',
    lastMessage: 'Encapsulation, Inheritance, Polymorphism - semua sudah clear!',
    timestamp: new Date('2025-11-02T11:00:00'),
    messageCount: 10,
    topic: 'Programming',
  },
  {
    id: 'session-7',
    title: 'Python Decorators & Generators',
    lastMessage: 'Generator menghemat memory untuk data besar dengan lazy evaluation',
    timestamp: new Date('2025-11-01T15:30:00'),
    messageCount: 14,
    topic: 'Python',
  },
  {
    id: 'session-8',
    title: 'Time & Space Complexity Analysis',
    lastMessage: 'Big O notation membantu kita memilih algoritma yang paling efisien',
    timestamp: new Date('2025-10-31T09:45:00'),
    messageCount: 16,
    topic: 'Algorithms',
  },
  {
    id: 'session-9',
    title: 'API Development with Flask',
    lastMessage: 'RESTful API dengan Flask sudah jalan! Sekarang tambahkan authentication',
    timestamp: new Date('2025-10-30T14:00:00'),
    messageCount: 22,
    topic: 'Web Development',
  },
  {
    id: 'session-10',
    title: 'Database Design & SQL Queries',
    lastMessage: 'JOIN operations dan normalization sudah dikuasai!',
    timestamp: new Date('2025-10-29T10:30:00'),
    messageCount: 13,
    topic: 'Database',
  },
];

// Suggested Questions berdasarkan topik yang sedang dipelajari
export const suggestedQuestions: SuggestedQuestion[] = [
  {
    id: 'sq-1',
    question: 'Bagaimana cara mengoptimalkan algoritma sorting untuk dataset besar?',
    category: 'Algorithms',
    icon: '⚡',
  },
  {
    id: 'sq-2',
    question: 'Jelaskan perbedaan antara Stack dan Queue dengan contoh real-world',
    category: 'Data Structures',
    icon: '📚',
  },
  {
    id: 'sq-3',
    question: 'Apa itu Neural Network dan bagaimana cara kerjanya?',
    category: 'AI & ML',
    icon: '🧠',
  },
  {
    id: 'sq-4',
    question: 'Cara membuat REST API yang aman dengan authentication',
    category: 'Web Development',
    icon: '🔐',
  },
  {
    id: 'sq-5',
    question: 'Kapan menggunakan recursion vs iteration?',
    category: 'Programming',
    icon: '🔄',
  },
  {
    id: 'sq-6',
    question: 'Jelaskan konsep Git branching dan merging strategy',
    category: 'Version Control',
    icon: '🌿',
  },
  {
    id: 'sq-7',
    question: 'Apa bedanya SQL vs NoSQL database? Kapan pakai yang mana?',
    category: 'Database',
    icon: '💾',
  },
  {
    id: 'sq-8',
    question: 'Bagaimana cara debugging code yang efektif?',
    category: 'Best Practices',
    icon: '🐛',
  },
];

// Quick Actions - Fitur cepat untuk pembelajaran
export const quickActions: QuickAction[] = [
  {
    id: 'qa-1',
    label: 'Generate Practice Quiz',
    icon: '📝',
    action: 'generate-quiz',
    description: 'Buat quiz berdasarkan topik yang sedang dipelajari',
  },
  {
    id: 'qa-2',
    label: 'Explain with Analogy',
    icon: '💡',
    action: 'explain-analogy',
    description: 'Jelaskan konsep dengan analogi yang mudah dipahami',
  },
  {
    id: 'qa-3',
    label: 'Code Review',
    icon: '👀',
    action: 'code-review',
    description: 'Upload kode untuk direview dan dapat feedback',
  },
  {
    id: 'qa-4',
    label: 'Visual Diagram',
    icon: '📊',
    action: 'visual-diagram',
    description: 'Buat diagram visual untuk konsep yang kompleks',
  },
  {
    id: 'qa-5',
    label: 'Study Plan',
    icon: '📅',
    action: 'study-plan',
    description: 'Buat rencana belajar yang dipersonalisasi',
  },
  {
    id: 'qa-6',
    label: 'Coding Challenge',
    icon: '🎯',
    action: 'coding-challenge',
    description: 'Dapatkan challenge sesuai level kamu',
  },
  {
    id: 'qa-7',
    label: 'Explain Like I\'m 5',
    icon: '👶',
    action: 'eli5',
    description: 'Penjelasan super simple untuk konsep sulit',
  },
  {
    id: 'qa-8',
    label: 'Resource Recommendations',
    icon: '📚',
    action: 'resources',
    description: 'Dapatkan rekomendasi video, artikel, atau tutorial',
  },
];

// Learning Topics untuk kategori chat
export const learningTopics = [
  { id: 'algorithms', name: 'Algorithms', icon: '🔢', color: 'bg-blue-500' },
  { id: 'data-structures', name: 'Data Structures', icon: '📦', color: 'bg-green-500' },
  { id: 'ai-ml', name: 'AI & ML', icon: '🤖', color: 'bg-purple-500' },
  { id: 'web-dev', name: 'Web Development', icon: '🌐', color: 'bg-orange-500' },
  { id: 'programming', name: 'Programming', icon: '💻', color: 'bg-red-500' },
  { id: 'database', name: 'Database', icon: '💾', color: 'bg-yellow-500' },
  { id: 'math', name: 'Mathematics', icon: '📐', color: 'bg-pink-500' },
  { id: 'general', name: 'General', icon: '💬', color: 'bg-gray-500' },
];

// Achievement triggers untuk gamification integration
export const chatAchievements = {
  firstMessage: { id: 'first-chat', xp: 10, title: 'First Chat!' },
  tenMessages: { id: 'chatty-student', xp: 50, title: 'Chatty Student' },
  dailyStreak3: { id: 'learning-streak-3', xp: 100, title: '3-Day Learning Streak' },
  codeSubmitted: { id: 'code-explorer', xp: 30, title: 'Code Explorer' },
  topicMastery: { id: 'topic-master', xp: 150, title: 'Topic Master' },
};

// Tips untuk menggunakan AI Chat secara efektif
export const chatTips = [
  '💡 Tip: Jelaskan konteks masalah kamu dengan detail untuk jawaban yang lebih akurat',
  '🎯 Tip: Gunakan Quick Actions untuk generate quiz atau coding challenge',
  '📝 Tip: Minta AI untuk review code kamu dan dapat feedback konstruktif',
  '🔍 Tip: Tanya "mengapa" untuk pemahaman yang lebih dalam',
  '🚀 Tip: Challenge diri dengan meminta problem yang lebih sulit',
  '📊 Tip: Minta visualisasi atau diagram untuk konsep yang kompleks',
  '🎓 Tip: Tanyakan aplikasi real-world dari konsep yang dipelajari',
  '⚡ Tip: Gunakan code blocks untuk share code dengan syntax highlighting',
];

// Personality traits untuk AI - disesuaikan dengan profil Tristan
export const aiPersonality = {
  name: 'AdaptiAI',
  role: 'Personal Learning Mentor',
  traits: [
    'Friendly & Encouraging',
    'Patient & Understanding',
    'Adapts to visual learning style',
    'Uses coding examples',
    'Provides hands-on challenges',
    'Gamification-aware',
  ],
  communicationStyle: {
    language: 'Bahasa Indonesia',
    tone: 'Casual tapi profesional',
    emoji: 'Sering menggunakan emoji untuk engagement',
    examples: 'Selalu pakai contoh konkret dan analogi',
    encouragement: 'Memberikan positive reinforcement',
  },
};
