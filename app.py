from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=["https://genetic-themes.onrender.com"])  # ✅ ALLOW ONLY FRONTEND URL

@app.route('/generate-theme', methods=['POST'])
def generate_theme():
    traits = request.json or {}

    def get_trait(name):
        return traits.get(name, "").strip().lower()

    eye_color = get_trait("eye_color")
    chronotype = get_trait("chronotype")
    personality = get_trait("personality")
    hair_color = get_trait("hair_color")
    skin_tone = get_trait("skin_tone")

    eye_color_map = {
        "hazel": "#ADD8E6",
        "green": "#A8D5BA",
        "black": "#FFFFFF",
        "blue": "#87CEEB",
        "brown": "#A0522D"
    }
    primary = eye_color_map.get(eye_color, "#FFC0CB")

    if chronotype == "midnight-owl":
        background = "#121212"
        secondary_bg = "#1f1f1f"
        text_color = "#FFFFFF"
    else:
        background = "#FFF9EC"
        secondary_bg = "#f9f4e8"
        text_color = "#000000"

    personality_map = {
        "bold": ("Impact, sans-serif", "bold"),
        "creative": ("Comic Sans MS, cursive, sans-serif", "normal"),
        "analytical": ("Courier New, monospace", "normal"),
        "introvert": ("Georgia, serif", "normal"),
        "extrovert": ("Arial, sans-serif", "normal"),
        "ambivert": ("Tahoma, sans-serif", "normal"),
    }
    font, font_weight = personality_map.get(personality, ("Georgia, serif", "normal"))

    accent = "#ff4081"

    theme = {
        "primary": primary,
        "accent": accent,
        "secondary_bg": secondary_bg,
        "font": font,
        "font_weight": font_weight,
        "background": background,
        "text_color": text_color
    }

    return jsonify(theme)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
