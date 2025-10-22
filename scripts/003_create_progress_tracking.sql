-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  answers JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own attempts"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = quiz_attempts.student_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their children's attempts"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = quiz_attempts.student_id AND parent_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = student_id AND profile_id = auth.uid()
    )
  );

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id),
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'submitted', 'graded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their assignments"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = assignments.student_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can view assignments they created"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tutors
      WHERE id = assignments.tutor_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tutors
      WHERE id = tutor_id AND profile_id = auth.uid()
    )
  );

-- Create assignment submissions table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  content TEXT,
  attachments JSONB,
  grade INTEGER CHECK (grade >= 0 AND grade <= 100),
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ
);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view submissions for their assignments"
  ON public.assignment_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.students s ON a.student_id = s.id
      WHERE a.id = assignment_submissions.assignment_id AND s.profile_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can view submissions for assignments they created"
  ON public.assignment_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.tutors t ON a.tutor_id = t.id
      WHERE a.id = assignment_submissions.assignment_id AND t.profile_id = auth.uid()
    )
  );

-- Create weekly insights table
CREATE TABLE IF NOT EXISTS public.weekly_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  total_quizzes_completed INTEGER DEFAULT 0,
  total_time_spent_minutes INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  subjects_practiced JSONB,
  strengths TEXT[],
  areas_for_improvement TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, week_start_date)
);

ALTER TABLE public.weekly_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own insights"
  ON public.weekly_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = weekly_insights.student_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their children's insights"
  ON public.weekly_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = weekly_insights.student_id AND parent_id = auth.uid()
    )
  );
