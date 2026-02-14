
class OpsLogic:
    def evaluate(self, ctx):
        if ctx.get("runway_months",12)<3:
            return {"mode":"SURVIVAL","confidence":0.2}
        return {"mode":"NORMAL","confidence":0.9}
