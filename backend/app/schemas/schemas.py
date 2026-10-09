from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str
    department: str
    roll_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class LoginRequest(BaseModel):
    email: str
    password: str

# Milestone Schemas
class MilestoneBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: datetime
    weightage: int
    order_index: int
    requires_file: bool = True

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneResponse(MilestoneBase):
    id: str
    project_id: str

    class Config:
        from_attributes = True

# Project Schemas
class ProjectCreate(BaseModel):
    subject_id: str
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    weightage_total: int = 100
    milestones: List[MilestoneCreate]
    assigned_group_ids: List[str] = []

class ProjectResponse(BaseModel):
    id: str
    subject_id: str
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    teacher_id: str
    weightage_total: int
    created_at: datetime
    milestones: List[MilestoneResponse] = []

    class Config:
        from_attributes = True

# Subject Schemas
class SubjectCreate(BaseModel):
    code: str
    name: str
    semester: str
    department: str
    academic_year: str = "2026-2027"
    description: Optional[str] = None

class SubjectResponse(SubjectCreate):
    id: str
    teacher_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Task Schemas
class TaskCreate(BaseModel):
    group_id: str
    milestone_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    assigned_to_id: str
    priority: str = "medium"
    due_date: datetime

class TaskStatusUpdate(BaseModel):
    status: str

class TaskResponse(BaseModel):
    id: str
    group_id: str
    milestone_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    assigned_to_id: str
    status: str
    priority: str
    due_date: datetime
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Submission Schemas
class SubmissionCreate(BaseModel):
    group_id: str
    milestone_id: str
    file_name: str
    file_size: Optional[str] = None
    submission_notes: Optional[str] = None

class ReviewCreate(BaseModel):
    submission_id: str
    status: str  # 'approved', 'rework_requested', 'rejected'
    score: float
    max_score: float = 20.0
    feedback: str

class ReviewResponse(ReviewCreate):
    id: str
    reviewer_id: str
    reviewed_at: datetime

    class Config:
        from_attributes = True

class SubmissionResponse(BaseModel):
    id: str
    group_id: str
    milestone_id: str
    version: int
    file_name: str
    file_size: Optional[str] = None
    submission_notes: Optional[str] = None
    submitted_by_id: str
    submitted_at: datetime
    status: str
    review: Optional[ReviewResponse] = None

    class Config:
        from_attributes = True

# AI Assistant Query
class AIAssistantRequest(BaseModel):
    query: str
    subject_id: Optional[str] = None
    group_id: Optional[str] = None

class AIAssistantResponse(BaseModel):
    query: str
    response: str
    heuristics_used: List[str]
    timestamp: datetime
