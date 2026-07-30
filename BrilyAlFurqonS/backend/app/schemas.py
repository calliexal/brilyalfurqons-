from datetime import datetime

from pydantic import BaseModel, Field, validator

TASK_STATUSES = {'Todo', 'In Progress', 'Done'}


class TaskBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10, max_length=1024)
    status: str = Field(default='Todo')
    deadline: datetime | None = None

    @validator('status')
    def validate_status(cls, value: str):
        if value not in TASK_STATUSES:
            raise ValueError('Status must be Todo, In Progress, or Done')
        return value


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=255)
    description: str | None = Field(None, min_length=10, max_length=1024)
    status: str | None = None
    deadline: datetime | None = None

    @validator('status')
    def validate_status(cls, value: str | None):
        if value is None:
            return value
        if value not in TASK_STATUSES:
            raise ValueError('Status must be Todo, In Progress, or Done')
        return value


class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class TaskStats(BaseModel):
    total: int
    todo: int
    in_progress: int
    done: int
