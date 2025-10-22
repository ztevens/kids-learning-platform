-- Create subjects table for UK curriculum
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  year_groups INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (TRUE);

-- Insert core UK subjects
INSERT INTO public.subjects (name, description, icon, color) VALUES
  ('Mathematics', 'Numbers, calculations, shapes and problem solving', '🔢', '#3B82F6'),
  ('English', 'Reading, writing, grammar and comprehension', '📚', '#10B981'),
  ('Science', 'Biology, chemistry, physics and experiments', '🔬', '#8B5CF6'),
  ('History', 'Past events, people and civilizations', '🏛️', '#F59E0B'),
  ('Geography', 'Places, maps, environments and cultures', '🌍', '#06B6D4'),
  ('Computing', 'Coding, digital literacy and technology', '💻', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- Create topics table
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  year_group INTEGER NOT NULL CHECK (year_group BETWEEN 1 AND 6),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view topics"
  ON public.topics FOR SELECT
  USING (TRUE);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points_reward INTEGER DEFAULT 10,
  time_limit_seconds INTEGER,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quizzes"
  ON public.quizzes FOR SELECT
  USING (TRUE);

CREATE POLICY "Tutors and admins can create quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('tutor', 'admin')
    )
  );

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (TRUE);
