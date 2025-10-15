/*
  # Create Students Management System Schema

  1. New Tables
    - `students`
      - `id` (uuid, primary key) - Unique identifier for each student
      - `name` (text) - Student's full name
      - `roll_number` (text, unique) - Student's unique roll number
      - `class` (text) - Student's class/grade
      - `email` (text) - Student's email address
      - `phone` (text) - Student's phone number
      - `address` (text) - Student's residential address
      - `date_of_birth` (date) - Student's date of birth
      - `user_id` (uuid) - Reference to the authenticated user who manages this student
      - `created_at` (timestamptz) - Timestamp when student record was created
      - `updated_at` (timestamptz) - Timestamp when student record was last updated

  2. Security
    - Enable RLS on `students` table
    - Add policy for authenticated users to read all students
    - Add policy for authenticated users to create students
    - Add policy for authenticated users to update students
    - Add policy for authenticated users to delete students

  3. Important Notes
    - All authenticated users can perform CRUD operations on all students
    - Roll numbers must be unique across the system
    - User must be authenticated to access student records
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  roll_number text UNIQUE NOT NULL,
  class text NOT NULL,
  email text,
  phone text,
  address text,
  date_of_birth date,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all students
CREATE POLICY "Authenticated users can read all students"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert students
CREATE POLICY "Authenticated users can insert students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can update students
CREATE POLICY "Authenticated users can update students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete students
CREATE POLICY "Authenticated users can delete students"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index on roll_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);

-- Create index on class for filtering
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);

-- Create index on user_id for filtering by user
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
