from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from . import models, schemas


def get_task(db: Session, task_id: int) -> models.Task | None:
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def get_tasks(db: Session) -> list[models.Task]:
    return db.query(models.Task).order_by(models.Task.created_at.desc()).all()


def create_task(db: Session, task: schemas.TaskCreate) -> models.Task:
    db_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status,
        deadline=task.deadline,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task: models.Task, updates: schemas.TaskUpdate) -> models.Task:
    if updates.title is not None:
        task.title = updates.title
    if updates.description is not None:
        task.description = updates.description
    if updates.status is not None:
        task.status = updates.status
    if updates.deadline is not None:
        task.deadline = updates.deadline
    task.updated_at = datetime.utcnow()
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: models.Task) -> None:
    db.delete(task)
    db.commit()


def get_task_stats(db: Session) -> schemas.TaskStats:
    total = db.query(func.count(models.Task.id)).scalar() or 0
    todo = db.query(func.count(models.Task.id)).filter(models.Task.status == 'Todo').scalar() or 0
    in_progress = db.query(func.count(models.Task.id)).filter(models.Task.status == 'In Progress').scalar() or 0
    done = db.query(func.count(models.Task.id)).filter(models.Task.status == 'Done').scalar() or 0
    return schemas.TaskStats(total=total, todo=todo, in_progress=in_progress, done=done)
