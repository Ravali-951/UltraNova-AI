
class ProductLogic:
    def evaluate(self, ctx):
        feats = ctx.get("requested_features",[])
        if len(feats)>1:
            return {"allowed":False,"confidence":0.4}
        return {"allowed":True,"confidence":0.8}
