
from app.db.session import SessionLocal
from app.db.models import Decision

class AuditLogger:
    def record(self, decision, context):
        db = SessionLocal()
        db.add(Decision(
            business_id=context.get("business_id"),
            decision=decision,
            context=context
        ))
        db.commit()
        db.close()
