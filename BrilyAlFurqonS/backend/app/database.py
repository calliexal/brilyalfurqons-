import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables from the BrilyAlFurqonS root if present.
load_dotenv(Path(__file__).resolve().parents[2] / '.env')

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    fallback_path = Path(__file__).resolve().parents[2] / 'tasktrack.db'
    DATABASE_URL = f'sqlite:///{fallback_path}'

engine = create_engine(
    DATABASE_URL,
    connect_args={'check_same_thread': False} if DATABASE_URL.startswith('sqlite') else {},
    future=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
