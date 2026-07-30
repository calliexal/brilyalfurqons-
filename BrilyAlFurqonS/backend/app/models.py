from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, Integer, String

from .database import Base

TASK_STATUSES = ('Todo', 'In Progress', 'Done')


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(length=255), nullable=False)
    description = Column(String(length=1024), nullable=False)
    status = Column(Enum(*TASK_STATUSES, name='task_status', native_enum=False), nullable=False, default='Todo')
    deadline = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
