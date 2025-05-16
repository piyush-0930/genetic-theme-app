from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow frontend access

@app.route('/generate-theme', methods=['POST'])
def generate_theme():
    traits = request.json or {}

    # Helper to lowercase safely
    def get_trait(name):
        return traits.get(name, "").strip().lower()

    eye_color = get_trait("eye_color")
    chronotype = get_trait("chronotype")
    personality = get_trait("personality")
    hair_color = get_trait("hair_color")  # optional if you want to extend later
    skin_tone = get_trait("skin_tone")    # optional if you want to extend later

    # Primary color based on eye_color
    eye_color_map = {
        "hazel": "#ADD8E6",  # light blue
        "green": "#A8D5BA",  # pastel green
        "black": "#FFFFFF",  # white
        "blue": "#87CEEB",
        "brown": "#A0522D"
    }
    primary = eye_color_map.get(eye_color, "#FFC0CB")  # pink default

    # Background & secondary_bg based on chronotype
    if chronotype == "midnight-owl":
        background = "#121212"
        secondary_bg = "#1f1f1f"
        text_color = "#FFFFFF"
    else:
        background = "#FFF9EC"
        secondary_bg = "#f9f4e8"
        text_color = "#000000"

    # Font and weight based on personality
    personality_map = {
        "bold": ("Impact, sans-serif", "bold"),
        "creative": ("Comic Sans MS, cursive, sans-serif", "normal"),
        "analytical": ("Courier New, monospace", "normal"),
        "introvert": ("Georgia, serif", "normal"),
        "extrovert": ("Arial, sans-serif", "normal"),
        "ambivert": ("Tahoma, sans-serif", "normal"),
    }
    font, font_weight = personality_map.get(personality, ("Georgia, serif", "normal"))

    # Accent color fixed for now (could be customized later)
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
