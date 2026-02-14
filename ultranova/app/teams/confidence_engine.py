
class TeamConfidenceEngine:
    def calculate(self, teams):
        return {"overall_confidence": round(sum(t.get("confidence",0.7) for t in teams.values())/len(teams),2)}
