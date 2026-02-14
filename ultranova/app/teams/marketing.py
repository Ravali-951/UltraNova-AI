
class MarketingLogic:
    def evaluate(self, ctx):
        if not ctx.get("product_clarity"):
            return {"allowed":False,"confidence":0.3}
        return {"allowed":True,"confidence":0.7}
