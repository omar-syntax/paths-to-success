-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  full_name_en TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  school TEXT,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create student_submissions table
CREATE TABLE public.student_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (student_id, project_id)
);

-- Enable RLS on student_submissions
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- Create grades table
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.student_submissions(id) ON DELETE CASCADE NOT NULL UNIQUE,
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL DEFAULT 100 CHECK (max_score > 0),
  stars INTEGER CHECK (stars >= 0 AND stars <= 5),
  feedback TEXT,
  graded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  graded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on grades
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Create uploaded_files table
CREATE TABLE public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.student_submissions(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_name_en TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on uploaded_files
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for projects (public read)
CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for student_submissions
CREATE POLICY "Students can view own submissions" ON public.student_submissions
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all submissions" ON public.student_submissions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can create own submissions" ON public.student_submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own submissions" ON public.student_submissions
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Admins can manage all submissions" ON public.student_submissions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for grades
CREATE POLICY "Students can view own grades" ON public.grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_submissions 
      WHERE id = grades.submission_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all grades" ON public.grades
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert grades" ON public.grades
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update grades" ON public.grades
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for uploaded_files
CREATE POLICY "Students can view own files" ON public.uploaded_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_submissions 
      WHERE id = uploaded_files.submission_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all files" ON public.uploaded_files
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can upload own files" ON public.uploaded_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.student_submissions 
      WHERE id = uploaded_files.submission_id AND student_id = auth.uid()
    )
  );

-- Create storage bucket for student files
INSERT INTO storage.buckets (id, name, public) VALUES ('student-files', 'student-files', false);

-- Storage policies
CREATE POLICY "Students can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'student-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'student-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all student files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'student-files' AND 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can download all student files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'student-files' AND 
    public.has_role(auth.uid(), 'admin')
  );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  -- Default role is student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.student_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();