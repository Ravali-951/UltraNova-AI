
class TeamConflictResolver:
    def resolve(self, teams):
        if teams.get("ops",{}).get("mode")=="SURVIVAL":
            return {"final_mode":"SURVIVAL"}
        return {"final_mode":"ALIGNED"}
