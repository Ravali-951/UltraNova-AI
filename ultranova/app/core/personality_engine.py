
class FounderPersonalityEngine:
    TONE = {
        "aggressive": "Be direct:",
        "balanced": "",
        "conservative": "Consider carefully:"
    }

    def apply(self, personality, message):
        return f"{self.TONE.get(personality,'')} {message}".strip()
