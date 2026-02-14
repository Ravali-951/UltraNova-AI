
from app.teams.marketing import MarketingLogic
from app.teams.sales import SalesLogic
from app.teams.product import ProductLogic
from app.teams.tech import TechLogic
from app.teams.ops import OpsLogic
from app.teams.conflict_resolver import TeamConflictResolver
from app.teams.confidence_engine import TeamConfidenceEngine
from app.teams.hard_truth_engine import HardTruthEngine

class TeamOrchestrator:
    def __init__(self):
        self.marketing=MarketingLogic()
        self.sales=SalesLogic()
        self.product=ProductLogic()
        self.tech=TechLogic()
        self.ops=OpsLogic()
        self.conflict=TeamConflictResolver()
        self.confidence=TeamConfidenceEngine()
        self.truth=HardTruthEngine()

    def evaluate_all(self, ctx):
        teams={
            "marketing":self.marketing.evaluate(ctx),
            "sales":self.sales.evaluate(ctx),
            "product":self.product.evaluate(ctx),
            "tech":self.tech.evaluate(ctx),
            "ops":self.ops.evaluate(ctx)
        }
        conf=self.confidence.calculate(teams)
        return {
            "teams":teams,
            "conflict":self.conflict.resolve(teams),
            "confidence":conf,
            "hard_truths":self.truth.generate(teams, conf["overall_confidence"])
        }
