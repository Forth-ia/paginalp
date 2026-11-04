# Genera biblioteca/index.html desde data/videos.json, data/resources.json y data/challenges.json.
# Uso: python tools/gen_biblioteca.py .
import json, html, os, sys
R = sys.argv[1]
v = json.load(open(os.path.join(R, 'data/videos.json'), encoding='utf-8'))
r = json.load(open(os.path.join(R, 'data/resources.json'), encoding='utf-8'))
ch = [x for x in json.load(open(os.path.join(R, 'data/challenges.json'), encoding='utf-8'))['challenges'] if os.path.isdir(os.path.join(R, 'retos', x['slug']))]
cats = r['categories']; res = [x for x in r['resources'] if os.path.isdir(os.path.join(R, 'recursos', x['slug']))]
vids = [x for x in v['videos'] if os.path.isdir(os.path.join(R, 'tutoriales', x['slug']))]
topics = v['topics']

def e(s): return html.escape(str(s or '').replace(' — ', ': ').replace('—', '-').replace('–', '-'), quote=True)

GROUPS = [
    ('guias', 'Guías paso a paso', ['guia-paso-a-paso'], 'Cada guía te lleva de cero a tenerlo funcionando.'),
    ('prompts', 'Prompts y plantillas', ['prompts', 'plantilla'], 'Para copiar, pegar y adaptar a tu caso.'),
    ('listas', 'Listas curadas', ['lista-curada'], 'Lo mejor de cada tema, ya filtrado.'),
    ('sistemas', 'Sistemas y herramientas', ['sistema', 'herramienta-config'], 'Configuraciones completas que trabajan por ti.'),
    ('casos', 'Casos y análisis', ['caso-construido', 'analisis-articulo', 'tutorial-escrito'], 'Cómo se construyó y qué aprendimos.'),
]
groups = [(gid, name, [x for x in res if x['type'] in types], sub) for gid, name, types, sub in GROUPS]
assert sum(len(g[2]) for g in groups) == len(res), 'tipo de recurso sin grupo'

def vcard(x, extra=''):
    thumb = x['thumb']
    return (f'<a class="b-card" href="/tutoriales/{x["slug"]}/" data-search="{e(x["title"].lower())} {e(x["topic_label"].lower())}" data-topic="{x["topic"]}"{extra}>'
            f'<div class="b-thumb"><img src="{thumb}" alt="" loading="lazy" width="1280" height="720" onerror="this.onerror=null;this.src=\'https://img.youtube.com/vi/{x["id"]}/hqdefault.jpg\'"><b aria-hidden="true"></b><em>{e(x.get("duration_label"))}</em></div>'
            f'<div class="b-card__b"><small>{e(x["topic_label"])}</small><strong>{e(x["title"])}</strong></div></a>')

def rcard(x):
    cat = cats.get(x['category'], {}).get('name', '')
    mins = f'<span class="b-tag">{x["read_min"]} min</span>' if x.get('read_min') else ''
    return (f'<a class="b-card b-card--res" href="/recursos/{x["slug"]}/" data-search="{e((x["title"] + " " + x.get("summary", "") + " " + cat).lower())}">'
            f'<div class="b-card__b"><span class="b-type">{e(x.get("type_label"))}</span><strong>{e(x["title"])}</strong><p>{e(x.get("summary"))}</p>'
            f'<div class="b-card__meta"><span class="b-tag">{e(cat)}</span>{mins}</div></div></a>')

featured = sorted(vids, key=lambda x: (not x.get('featured'), -x.get('views', 0)))[:4]
by_id = {x['id']: x for x in vids}

nav = [('inicio', 'Inicio', None), ('rutas', 'Rutas de aprendizaje', len(v['routes'])), ('clases', 'Clases en video', len(vids))]
nav += [(gid, name, len(items)) for gid, name, items, _ in groups]
nav += [('retos', 'Reto gratis', len(ch))]
nav_html = ''.join(f'<a href="#{i}" data-nav="{i}"{" class=\"is-on\"" if i == "inicio" else ""}><i></i>{n}{f"<span>{c}</span>" if c is not None else ""}</a>' for i, n, c in nav)

used_topics = [t for t in topics if any(x['topic'] == t for x in vids)]
chips = '<button class="b-chip is-on" type="button" data-topic="all">Todas</button>' + ''.join(
    f'<button class="b-chip" type="button" data-topic="{t}">{e(topics[t])}</button>' for t in used_topics)

routes = ''.join(
    f'<a class="b-route" href="/tutoriales/#ruta-{x["slug"]}" data-search="{e(x["title"].lower())}"><strong>{e(x["title"])}</strong><p>{e(x["desc"])}</p><span>{len(x["videos"])} clases y {len(x["resources"])} recursos &rarr;</span></a>'
    for x in v['routes'])

group_html = ''.join(
    f'<section class="b-sec" id="{gid}" data-group><div class="b-head"><div><h2 class="b-h2">{name}</h2><p class="b-lede" style="margin-top:6px">{sub}</p></div><p>{len(items)} recursos</p></div>'
    f'<div class="b-grid">{"".join(rcard(x) for x in items)}</div></section>'
    for gid, name, items, sub in groups)

reto = ch[0]
reto_html = (f'<section class="b-sec" id="retos" data-group><div class="b-head"><div><h2 class="b-h2">Reto gratis</h2><p class="b-lede" style="margin-top:6px">Aprende en 5 días, con un paso al día.</p></div></div>'
             f'<div class="b-grid"><a class="b-card b-card--res" href="/retos/{reto["slug"]}/" data-search="{e(reto["title"].lower())} reto">'
             f'<div class="b-card__b"><span class="b-type">Reto de 5 días</span><strong>{e(reto["title"])}</strong><p>{e(reto["result"])}</p>'
             f'<div class="b-card__meta"><span class="b-tag">{e(reto["duration"])}</span><span class="b-tag">{e(reto["level"])}</span></div></div></a></div></section>')

page = f'''<!DOCTYPE html>
<html lang="es">
<head>
<script src="https://api.adpulze.io/api/v1/scripts/ghl.js?location_id=22"></script><script src="https://api.adpulze.io/api/v1/scripts/organic.js?location_id=22"></script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Biblioteca gratis de IA | Forth</title>
<meta name="description" content="{len(vids)} clases en video, {len(res)} recursos y un reto para aprender a construir con IA. Gratis, de Forth y Luciano Musella.">
<meta name="robots" content="noindex, nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">
<link rel="stylesheet" href="/assets/css/forth.css">
<link rel="stylesheet" href="/assets/css/biblioteca.css">
</head>
<body class="forth" data-page="biblioteca">
<!-- Generado con tools/gen_biblioteca.py desde data/*.json: no editar a mano. -->
<a class="sr" href="#main">Ir al contenido</a>
<div class="b-app">
  <aside class="b-side" id="bside" aria-label="Secciones de la biblioteca">
    <div class="b-side__brand"><a class="f-logo" href="/" aria-label="Forth, inicio">Forth</a><small>Biblioteca</small></div>
    <nav>{nav_html}</nav>
    <div class="b-side__foot">
      <a class="b-wsp" href="https://chat.whatsapp.com/FJwqTceWj4gBKpYKBAWEWW" target="_blank" rel="noopener" data-track="community_click" data-track-props='{{"from":"biblioteca"}}'>Comunidad de WhatsApp</a>
      <a class="f-btn" href="/agenda/" data-track="agenda_click" data-track-props='{{"from":"biblioteca_side"}}'>Agenda tu llamada</a>
    </div>
  </aside>

  <main class="b-main" id="main">
    <div class="b-top">
      <button class="b-burger" type="button" aria-label="Secciones" aria-controls="bside" aria-expanded="false">&#9776;</button>
      <a class="f-logo b-top__logo" href="/" aria-label="Forth, inicio">Forth</a>
      <label class="b-search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span class="sr">Buscar</span><input type="search" id="bq" placeholder="Busca una clase o un recurso" autocomplete="off"></label>
      <a class="b-top__link" href="https://www.youtube.com/@LucianoMusellaa" target="_blank" rel="noopener">YouTube</a>
      <a class="f-btn f-btn--sm" href="/agenda/" data-track="agenda_click" data-track-props='{{"from":"biblioteca_top"}}'>Agenda tu llamada</a>
    </div>

    <section class="b-sec" id="inicio" data-group>
      <span class="b-k">Biblioteca Forth</span>
      <h1 class="b-h1">Aprende a construir con IA, <span class="f-accent">gratis</span><span class="f-dot">.</span></h1>
      <p class="b-lede">{len(vids)} clases en video, {len(res)} recursos y un reto. Todo lo que publicamos, ordenado para que encuentres lo que necesitas.</p>
      <div class="b-head" style="margin-top:36px"><h2 class="b-h2">Empieza por aquí</h2></div>
      <div class="b-grid">{"".join(vcard(x) for x in featured)}</div>
    </section>

    <section class="b-sec" id="rutas" data-group>
      <div class="b-head"><div><h2 class="b-h2">Rutas de aprendizaje</h2><p class="b-lede" style="margin-top:6px">Elige qué quieres lograr y sigue el orden.</p></div></div>
      <div class="b-routes">{routes}</div>
    </section>

    <section class="b-sec" id="clases" data-group>
      <div class="b-head"><div><h2 class="b-h2">Clases en video</h2><p class="b-lede" style="margin-top:6px">Paso a paso, con casos reales.</p></div><p>{len(vids)} clases</p></div>
      <div class="b-chips" role="group" aria-label="Filtrar por tema">{chips}</div>
      <div class="b-grid" id="bvideos">{"".join(vcard(x) for x in vids)}</div>
    </section>

    {group_html}
    {reto_html}

    <p class="b-empty" id="bempty" hidden>No encontramos nada con esa búsqueda. Prueba con otra palabra.</p>

    <aside class="b-next">
      <div><h2 class="b-h2">Lo que sigue: construirlo <span class="f-accent">en tu trabajo.</span></h2><p>En el Programa Forth aprendes resolviendo un problema real tuyo, con acompañamiento. Y si tienes una empresa, lo automatizamos por ti.</p></div>
      <a class="f-btn" href="/agenda/" data-track="agenda_click" data-track-props='{{"from":"biblioteca_next"}}'>Agenda tu llamada</a>
    </aside>
  </main>
</div>

<script src="/assets/js/site.js"></script>
<script src="/assets/js/biblioteca.js"></script>
</body>
</html>
'''
os.makedirs(os.path.join(R, 'biblioteca'), exist_ok=True)
open(os.path.join(R, 'biblioteca/index.html'), 'w', encoding='utf-8', newline='').write(page)
print('videos', len(vids), 'recursos', len(res), 'grupos', [(g[0], len(g[2])) for g in groups])
