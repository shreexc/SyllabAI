from xml.sax.saxutils import escape


class AnimationRenderer:
    """Render a validated storyboard as a safe animated SVG; no uploaded code is run."""

    renderer_version = "svg-storyboard-1"

    def render(self, specification: dict) -> bytes:
        title = escape(str(specification["title"])[:120])
        scenes = specification["scenes"]
        total = int(specification["duration"])
        if not scenes or total < 1 or total > 300:
            raise ValueError("The storyboard has invalid scenes or duration.")
        intervals: list[int] = []
        elapsed = 0
        for scene in scenes:
            duration = int(scene["duration"])
            if duration < 1 or elapsed + duration > total:
                raise ValueError("Storyboard scene durations are invalid.")
            intervals.append(elapsed)
            elapsed += duration
        if elapsed != total:
            raise ValueError("Storyboard scene durations must total the requested length.")

        palette = ["#dceee2", "#f0e8d8", "#e2e7f4", "#f0e2e8", "#dce9ed"]
        rendered_scenes: list[str] = []
        for index, scene in enumerate(scenes):
            narration = escape(str(scene["narration"])[:380])
            kind = escape(str(scene["type"])[:40])
            start = intervals[index]
            scene_duration = int(scene["duration"])
            color = palette[index % len(palette)]
            rendered_scenes.append(
                f'<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.03;0.9;1" '
                f'begin="{start}s" dur="{scene_duration}s" fill="freeze" />'
                f'<rect x="72" y="65" width="816" height="410" rx="26" fill="{color}" />'
                f'<text x="120" y="125" font-family="sans-serif" font-size="15" font-weight="700" fill="#47745a">SCENE {index + 1} · {kind.upper()}</text>'
                f'<text x="120" y="190" font-family="sans-serif" font-size="28" font-weight="700" fill="#2e5744">{title}</text>'
                f'<circle cx="480" cy="285" r="55" fill="#fffefa" stroke="#8aaa92" stroke-width="4">'
                f'<animate attributeName="r" values="48;61;48" dur="5s" repeatCount="indefinite" /></circle>'
                f'<path d="M330 285h90m-12-12 12 12-12 12M540 285h90m-12-12 12 12-12 12" fill="none" stroke="#588468" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />'
                f'<foreignObject x="120" y="365" width="720" height="82"><div xmlns="http://www.w3.org/1999/xhtml" style="font:18px sans-serif;color:#4b5d50;line-height:1.45">{narration}</div></foreignObject></g>'
            )
        svg = (
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="960" height="540" viewBox="0 0 960 540" role="img">'
            '<rect width="960" height="540" fill="#f8faf6" />'
            + "".join(rendered_scenes)
            + '<text x="830" y="510" font-family="sans-serif" font-size="12" fill="#718076">SyllabAI storyboard</text></svg>'
        )
        return svg.encode("utf-8")
