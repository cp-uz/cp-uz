ALGORITHMS_ROOT = "/algo"
TASKS_ROOT = "/tasks"
SEASONS_ROOT = "/seasons"
DICTIONARY_ROOT = "/dict"
ROADMAP_ROOT = "/roadmap"


def _path(root: str, *segments: str) -> str:
    clean_segments = (segment.strip("/") for segment in segments if segment)
    return f"{root}/{'/'.join(clean_segments)}/" if segments else f"{root}/"


def algorithm_path(path: str = "") -> str:
    return _path(ALGORITHMS_ROOT, path) if path else _path(ALGORITHMS_ROOT)


def task_path(season_slug: str = "", event_slug: str = "", problem_slug: str = "") -> str:
    segments = tuple(segment for segment in (season_slug, event_slug, problem_slug) if segment)
    return _path(TASKS_ROOT, *segments)


def season_path(season_slug: str = "", event_slug: str = "") -> str:
    segments = tuple(segment for segment in (season_slug, event_slug) if segment)
    return _path(SEASONS_ROOT, *segments)
