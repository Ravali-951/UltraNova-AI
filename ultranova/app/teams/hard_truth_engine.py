
class HardTruthEngine:
    def generate(self, teams, confidence):
        truths=[]
        if confidence<0.5:
            truths.append("This strategy is weak. Decide fast or pivot.")
        if teams.get("marketing",{}).get("allowed") is False:
            truths.append("You are trying to market confusion.")
        return truths
