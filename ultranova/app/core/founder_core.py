
from app.core.decision_engine import DecisionEngine
from app.core.roadmap_generator import RoadmapGenerator
from app.core.personality_engine import FounderPersonalityEngine
from app.audit.audit_logger import AuditLogger
from app.agents.strategy_agent import StrategyAgent
from app.teams.team_orchestrator import TeamOrchestrator

class FounderCore:
    def __init__(self):
        self.strategy = StrategyAgent()
        self.decision = DecisionEngine()
        self.roadmap = RoadmapGenerator()
        self.personality = FounderPersonalityEngine()
        self.audit = AuditLogger()
        self.teams = TeamOrchestrator()

    def process(self, data):
        ctx = data.__dict__
        strategy = self.strategy.generate_strategy(data)
        decision = self.decision.make_decision(ctx, strategy)
        decision["reason"] = self.personality.apply(data.personality, decision["reason"])
        roadmap = self.roadmap.generate(strategy["vision"])
        team_analysis = self.teams.evaluate_all(ctx)
        self.audit.record(decision, ctx)
        return {
            "vision": strategy["vision"],
            "decision": decision,
            "roadmap": roadmap,
            "team_analysis": team_analysis
        }
