from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Enum as SQLEnum
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False, default="student")  # 'teacher', 'student', 'admin'
    roll_number = Column(String(50), nullable=True, index=True)
    department = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    subjects = relationship("Subject", back_populates="teacher")
    tasks = relationship("Task", back_populates="assignee")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(36), primary_key=True, index=True)
    code = Column(String(20), index=True, nullable=False)
    name = Column(String(255), nullable=False)
    semester = Column(String(50), nullable=False)
    department = Column(String(100), nullable=False)
    teacher_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    academic_year = Column(String(50), nullable=False, default="2026-2027")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("User", back_populates="subjects")
    projects = relationship("Project", back_populates="subject")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, index=True)
    subject_id = Column(String(36), ForeignKey("subjects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    teacher_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    weightage_total = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)

    subject = relationship("Subject", back_populates="projects")
    milestones = relationship("ProjectMilestone", back_populates="project", cascade="all, delete-orphan")
    groups = relationship("StudentGroup", back_populates="project")


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(String(36), primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    deadline = Column(DateTime, nullable=False)
    weightage = Column(Integer, nullable=False, default=20)
    order_index = Column(Integer, nullable=False, default=1)
    requires_file = Column(Boolean, default=True)

    project = relationship("Project", back_populates="milestones")


class StudentGroup(Base):
    __tablename__ = "student_groups"

    id = Column(String(36), primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=True)
    subject_id = Column(String(36), ForeignKey("subjects.id"), nullable=False)
    name = Column(String(100), nullable=False)
    leader_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    progress_percentage = Column(Integer, default=0)
    github_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="groups")
    memberships = relationship("GroupMembership", back_populates="group", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="group")
    submissions = relationship("Submission", back_populates="group")


class GroupMembership(Base):
    __tablename__ = "group_memberships"

    id = Column(String(36), primary_key=True, index=True)
    group_id = Column(String(36), ForeignKey("student_groups.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    role_in_group = Column(String(20), default="member")  # 'leader', 'member'

    group = relationship("StudentGroup", back_populates="memberships")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, index=True)
    group_id = Column(String(36), ForeignKey("student_groups.id"), nullable=False)
    milestone_id = Column(String(36), ForeignKey("project_milestones.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    assigned_to_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="todo")  # 'todo', 'in_progress', 'in_review', 'completed'
    priority = Column(String(20), default="medium")  # 'low', 'medium', 'high', 'urgent'
    due_date = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    group = relationship("StudentGroup", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, index=True)
    group_id = Column(String(36), ForeignKey("student_groups.id"), nullable=False)
    milestone_id = Column(String(36), ForeignKey("project_milestones.id"), nullable=False)
    version = Column(Integer, default=1)
    file_name = Column(String(255), nullable=False)
    file_size = Column(String(50), nullable=True)
    file_url = Column(String(500), nullable=True)
    submission_notes = Column(Text, nullable=True)
    submitted_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(30), default="under_review")  # 'submitted', 'under_review', 'approved', 'rework_requested'

    group = relationship("StudentGroup", back_populates="submissions")
    review = relationship("SubmissionReview", back_populates="submission", uselist=False)


class SubmissionReview(Base):
    __tablename__ = "submission_reviews"

    id = Column(String(36), primary_key=True, index=True)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False, unique=True)
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(String(30), nullable=False)
    score = Column(Float, nullable=False)
    max_score = Column(Float, default=20.0)
    feedback = Column(Text, nullable=False)
    reviewed_at = Column(DateTime, default=datetime.utcnow)

    submission = relationship("Submission", back_populates="review")
