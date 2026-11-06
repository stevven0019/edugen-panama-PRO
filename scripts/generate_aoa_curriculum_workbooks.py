"""Generate curriculum-grounded AOA activity workbooks from the local JSON files.

Outputs one four-page PDF per scenario/theme/lesson, grade-level ZIP files, one
master ZIP, and manifests under output/workbooks/AOA_Curriculum_1120_PDFs.
"""
from __future__ import annotations

import json
import re
import argparse
import unicodedata
import zipfile
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, Image, KeepTogether, PageBreak, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
CURRICULUM_DIR = ROOT / 'public' / 'curriculums'
ASSET_DIR = ROOT / 'public' / 'assets' / 'nouns'
OUT_DIR = ROOT / 'output' / 'workbooks' / 'AOA_Curriculum_1120_PDFs'
IMAGE_CACHE = ROOT / 'tmp' / 'workbook_image_cache'

GRADE_FILES = [
    ('PreK', 'English_Curriculum_Prekinder.json', 'Grade_PreK', 'Pre-Kindergarten', 'Pre-A1.1', 'Foundational Learner'),
    ('Kinder', 'English_Curriculum_Kinder.json', 'Grade_Kinder', 'Kindergarten', 'Pre-A1.2', 'Foundational Learner'),
    ('1', 'English_Curriculum_Grade_1.json', 'Grade_01', 'Grade 1', 'Pre-A1.3', 'Foundational Learner'),
    ('2', 'English_Curriculum_Grade_2.json', 'Grade_02', 'Grade 2', 'Pre-A1.4', 'Foundational Learner'),
    ('3', 'English_Curriculum_Grade_3.json', 'Grade_03', 'Grade 3', 'A1.1', 'Beginner'),
    ('4', 'English_Curriculum_Grade_4.json', 'Grade_04', 'Grade 4', 'A1.2', 'Beginner'),
    ('5', 'English_Curriculum_Grade_5.json', 'Grade_05', 'Grade 5', 'A1.3', 'Beginner'),
    ('6', 'English_Curriculum_Grade_6.json', 'Grade_06', 'Grade 6', 'A2.1', 'High Beginner'),
    ('7', 'English_Curriculum_Grade_7.json', 'Grade_07', 'Grade 7', 'A2.2', 'High Beginner'),
    ('8', 'English_Curriculum_Grade_8.json', 'Grade_08', 'Grade 8', 'A2.3', 'High Beginner'),
    ('9', 'English_Curriculum_Grade_9.json', 'Grade_09', 'Grade 9', 'A2.4', 'High Beginner'),
    ('10', 'English_Curriculum_Grade_10.json', 'Grade_10', 'Grade 10', 'B1.1', 'Pre-intermediate'),
    ('11', 'English_Curriculum_Grade_11.json', 'Grade_11', 'Grade 11', 'B1.2', 'Pre-intermediate'),
    ('12', 'English_Curriculum_Grade_12.json', 'Grade_12', 'Grade 12', 'B1.3', 'Pre-intermediate'),
]
SKILLS = [('Listening', 'Listening'), ('Reading', 'Reading'), ('Speaking', 'Speaking'), ('Writing', 'Writing'), ('Mediation', 'Mediation')]
STAGE_NAMES = [
    '1. Warm-up / Pre-task', '2. Presentation', '3. Preparation / Practice',
    '4. Performance / Production', '5. Assessment / Post-task', '6. Reflection',
]

NAVY = colors.HexColor('#17324F')
BLUE = colors.HexColor('#2878A8')
TEAL = colors.HexColor('#5BB7A8')
GOLD = colors.HexColor('#F2C75C')
CORAL = colors.HexColor('#EF8975')
INK = colors.HexColor('#243447')
GRAY = colors.HexColor('#647589')
PALE = colors.HexColor('#F0F6F9')
MINT = colors.HexColor('#E8F5F0')
LILAC = colors.HexColor('#F1EDFA')
LINE = colors.HexColor('#B9C9D3')
WHITE = colors.white
VERIFIED_IMAGE_TERMS = {
    'book', 'friend', 'desk', 'chair', 'pencil', 'bag', 'tree', 'sun', 'rain',
    'flower', 'dog', 'cat', 'apple', 'calendar', 'park', 'teacher', 'school',
}

FONT_PATH = Path('C:/Windows/Fonts/arial.ttf')
FONT_BOLD_PATH = Path('C:/Windows/Fonts/arialbd.ttf')
if FONT_PATH.exists() and FONT_BOLD_PATH.exists():
    pdfmetrics.registerFont(TTFont('WBArial', str(FONT_PATH)))
    pdfmetrics.registerFont(TTFont('WBArial-Bold', str(FONT_BOLD_PATH)))
    FONT, FONT_BOLD = 'WBArial', 'WBArial-Bold'
else:
    FONT, FONT_BOLD = 'Helvetica', 'Helvetica-Bold'

STYLES = {
    'title': ParagraphStyle('Title', fontName=FONT_BOLD, fontSize=23, leading=28, textColor=NAVY, alignment=TA_CENTER, spaceAfter=5),
    'subtitle': ParagraphStyle('Subtitle', fontName=FONT, fontSize=12, leading=15, textColor=BLUE, alignment=TA_CENTER, spaceAfter=5),
    'h1': ParagraphStyle('H1', fontName=FONT_BOLD, fontSize=17, leading=20, textColor=NAVY, spaceAfter=5),
    'h2': ParagraphStyle('H2', fontName=FONT_BOLD, fontSize=11.5, leading=14, textColor=BLUE, spaceAfter=3),
    'body': ParagraphStyle('Body', fontName=FONT, fontSize=9.5, leading=12.5, textColor=INK, spaceAfter=3),
    'body_small': ParagraphStyle('BodySmall', fontName=FONT, fontSize=8.3, leading=10.4, textColor=INK, spaceAfter=2),
    'tiny': ParagraphStyle('Tiny', fontName=FONT, fontSize=7.3, leading=9, textColor=GRAY, spaceAfter=2),
    'center': ParagraphStyle('Center', fontName=FONT, fontSize=9, leading=11, textColor=INK, alignment=TA_CENTER),
    'center_bold': ParagraphStyle('CenterBold', fontName=FONT_BOLD, fontSize=9, leading=11, textColor=NAVY, alignment=TA_CENTER),
    'script': ParagraphStyle('Script', fontName=FONT, fontSize=8.1, leading=10.3, textColor=INK, spaceAfter=2),
}


def para(text, style='body'):
    return Paragraph(safe_text(text), STYLES[style])


def safe_text(value):
    text = str(value or '')
    for old, new in {'–': '-', '—': '-', '−': '-', '‐': '-', '‑': '-', '•': '-',
                     '·': '|', '“': '"', '”': '"', '‘': "'", '’': "'", '…': '...'}.items():
        text = text.replace(old, new)
    # Preserve only the small set of reportlab markup used for line breaks/emphasis.
    tags = {}
    for idx, tag in enumerate(('<b>', '</b>', '<i>', '</i>', '<br/>', '<br />')):
        key = f'ZZTAG{idx}ZZ'
        text = text.replace(tag, key)
        tags[key] = tag
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('\n', '<br/>')
    for key, tag in tags.items():
        text = text.replace(key, tag)
    return text


def norm_key(value):
    value = unicodedata.normalize('NFKD', str(value)).encode('ascii', 'ignore').decode('ascii')
    return re.sub(r'[^a-z0-9]+', '_', value.lower()).strip('_')


def text_value(value):
    if value is None:
        return ''
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, (int, float, bool)):
        return str(value)
    if isinstance(value, list):
        return '; '.join(filter(None, (text_value(x) for x in value)))
    if isinstance(value, dict):
        return '; '.join(f'{k}: {text_value(v)}' for k, v in value.items() if text_value(v))
    return str(value)


def theme_name(scenario, index):
    themes = scenario.get('themes')
    if isinstance(themes, list) and index < len(themes):
        item = themes[index]
        if isinstance(item, str):
            return item.strip()
        if isinstance(item, dict):
            for key in ('theme_title', 'themeTitle', 'title', 'name'):
                if item.get(key):
                    return str(item[key]).strip()
    direct = scenario.get('theme1' if index == 0 else 'theme2')
    return str(direct).strip() if direct else ''


def scenario_name(scenario, number):
    for key in ('scenario_title', 'scenarioName', 'title', 'scenario_name'):
        value = scenario.get(key)
        if value:
            return str(value).strip()
    return f'Scenario {number}'


def get_standards(scenario):
    return scenario.get('standards_and_learning_outcomes') or scenario.get('standardsAndLearningOutcomes') or {}


def skill_entry(scenario, skill):
    standards = get_standards(scenario)
    if isinstance(standards, list):
        for item in standards:
            if isinstance(item, dict) and str(item.get('skill', '')).strip().lower() == skill.lower():
                return item
    if isinstance(standards, dict):
        for key, item in standards.items():
            if key.lower() == skill.lower():
                return item if isinstance(item, dict) else {'learning_outcomes': item}
    direct = scenario.get(skill.lower())
    return direct if isinstance(direct, dict) else {}


def skill_outcomes(scenario, skill):
    entry = skill_entry(scenario, skill)
    outcomes = entry.get('learning_outcomes') or entry.get('learningOutcomes') or []
    if isinstance(outcomes, str):
        outcomes = [outcomes]
    return [str(x).strip() for x in outcomes if str(x).strip()]


def skill_standard(scenario, skill):
    entry = skill_entry(scenario, skill)
    value = entry.get('specific_standards') or entry.get('specificStandards') or entry.get('specific_standard') or entry.get('specificStandard')
    return text_value(value)


def communicative(scenario):
    return scenario.get('communicative_competences') or scenario.get('communicativeCompetences') or {}


def linguistic(scenario):
    cc = communicative(scenario)
    return cc.get('linguistic') or cc.get('linguistic_competences') or cc.get('linguisticCompetences') or {}


def extract_vocab(scenario):
    cc = communicative(scenario)
    ling = linguistic(scenario)
    vocab = (ling.get('vocabulary') or ling.get('recommended_vocabulary') or
             ling.get('recommendedVocabulary') or cc.get('vocabulary') or
             scenario.get('recommended_vocabulary') or scenario.get('recommendedVocabulary') or
             scenario.get('vocabulary'))
    candidates = []

    def visit(node):
        if isinstance(node, dict):
            for k, v in node.items():
                if any(part in str(k).lower() for part in ('pronunciation', 'phonemic', 'example', 'standard')):
                    continue
                visit(v)
        elif isinstance(node, list):
            for v in node:
                visit(v)
        elif isinstance(node, str):
            for part in re.split(r'[,;\n|]', node):
                item = re.sub(r'^\s*(?:[-•*]|\d+[.)])\s*', '', part.strip())
                item = re.sub(r'\s*\([^)]*\)\s*$', '', item).strip()
                if not item or len(item) > 55 or re.search(r'\b(e\.g\.|for example|can |practice |identifying )', item, re.I):
                    continue
                if item.lower() in {'vocabulary', 'nouns', 'verbs', 'adjectives', 'adverbs', 'prepositions', 'pronouns', 'question words'}:
                    continue
                candidates.append(item)

    visit(vocab)
    deduped = []
    seen = set()
    for item in candidates:
        k = item.casefold()
        if k not in seen:
            deduped.append(item)
            seen.add(k)
    return deduped


def grammar_items(scenario):
    cc = communicative(scenario)
    ling = linguistic(scenario)
    grammar = (ling.get('grammatical_features') or ling.get('grammaticalFeatures') or
               ling.get('recommended_grammatical_features') or ling.get('recommendedGrammaticalFeatures') or
               cc.get('grammatical_features') or scenario.get('grammar'))
    if isinstance(grammar, str):
        return [x.strip() for x in re.split(r'\n|(?<=[.!?])\s+(?=[A-Z0-9])', grammar) if x.strip()]
    return [text_value(x) for x in (grammar or []) if text_value(x)]


def get_pragmatic(scenario):
    cc = communicative(scenario)
    return text_value(cc.get('pragmatic') or cc.get('pragmatic_competences') or cc.get('pragmaticCompetences') or scenario.get('pragmatic_competences'))


def get_sociolinguistic(scenario):
    cc = communicative(scenario)
    return text_value(cc.get('sociolinguistic') or cc.get('sociolinguistic_competences') or cc.get('sociolinguisticCompetences') or scenario.get('sociolinguistic_competences'))


def selected_project(scenario, index):
    sources = [scenario.get('assessment_ideas', {}).get('twenty_first_century_projects') if isinstance(scenario.get('assessment_ideas'), dict) else None,
               scenario.get('twenty_first_century_projects'), scenario.get('projects'),
               scenario.get('century_21_project_ideas', {}).get('projects') if isinstance(scenario.get('century_21_project_ideas'), dict) else None]
    for projects in sources:
        if isinstance(projects, list) and index < len(projects):
            p = projects[index]
            if isinstance(p, dict):
                return ' — '.join(str(p.get(k, '')).strip() for k in ('title', 'name', 'overview', 'description') if p.get(k))
            return text_value(p)
    return ''


def quoted_examples(scenario, skill):
    sources = skill_outcomes(scenario, skill) + grammar_items(scenario)
    sources += [get_pragmatic(scenario), get_sociolinguistic(scenario)]
    found = []
    patterns = [r'[“"]([^”"]{8,240})[”"]', r'‘([^’]{8,180})’']
    for source in sources:
        if not source:
            continue
        for pat in patterns:
            for match in re.findall(pat, source):
                candidate = re.sub(r'\s+', ' ', match).strip()
                if candidate and candidate.casefold() not in {x.casefold() for x in found}:
                    found.append(candidate)
    return found


def words_for_lesson(vocab, scenario_idx, theme_idx, lesson_idx):
    if not vocab:
        return ['key idea', 'theme word', 'picture clue']
    start = (scenario_idx * 2 + theme_idx * 3 + lesson_idx * 2) % len(vocab)
    chosen = [vocab[(start + i) % len(vocab)] for i in range(min(4, len(vocab)))]
    return chosen


def level_band(cefr):
    if cefr.startswith('Pre-A1'):
        return 'prea1'
    if cefr.startswith('A1'):
        return 'a1'
    if cefr.startswith('A2'):
        return 'a2'
    return 'b1'


def learner_support(cefr):
    return {
        'prea1': 'Choose, point, match, trace, or draw. The teacher reads and models each step; speaking and independent writing are optional.',
        'a1': 'Use picture support, a word bank, and a short sentence frame. Give one or two details.',
        'a2': 'Find key details, use a short exchange, and connect two or three ideas in writing.',
        'b1': 'Compare details, explain a choice with evidence, and produce a short connected response.',
    }[level_band(cefr)]


def image_jpeg(term):
    if norm_key(term) not in VERIFIED_IMAGE_TERMS:
        return None
    if not ASSET_DIR.exists():
        return None
    names = [norm_key(term)]
    key = names[0]
    if key.endswith('ies'):
        names.append(key[:-3] + 'y')
    if key.endswith('s') and len(key) > 3:
        names.append(key[:-1])
    asset_map = {p.stem.lower(): p for p in ASSET_DIR.glob('*.png')}
    source = next((asset_map[x] for x in names if x in asset_map), None)
    if source is None:
        return None
    IMAGE_CACHE.mkdir(parents=True, exist_ok=True)
    dest = IMAGE_CACHE / f'{source.stem}.jpg'
    if not dest.exists() or dest.stat().st_mtime < source.stat().st_mtime:
        try:
            with PILImage.open(source) as im:
                im = im.convert('RGBA')
                bg = PILImage.new('RGBA', im.size, 'white')
                bg.alpha_composite(im)
                bg = bg.convert('RGB')
                bg.thumbnail((360, 300), PILImage.Resampling.LANCZOS)
                bg.save(dest, 'JPEG', quality=78, optimize=True)
        except Exception:
            return None
    return dest


def image_cards(words):
    cells = []
    for word in words[:4]:
        path = image_jpeg(word)
        if path:
            item = Image(str(path), width=0.88*inch, height=0.67*inch, kind='proportional')
            cell = [item, para(word, 'center_bold')]
        else:
            cell = [para(word[:26], 'center_bold'), Spacer(1, 0.40*inch), para('Draw or point', 'tiny')]
        cells.append(cell)
    while len(cells) < 4:
        cells.append([para('Draw a clue', 'center_bold'), Spacer(1, 0.4*inch), para('picture space', 'tiny')])
    t = Table([cells], colWidths=[1.45*inch]*4, rowHeights=[1.13*inch])
    t.setStyle(TableStyle([
        ('GRID',(0,0),(-1,-1),0.6,LINE),('BACKGROUND',(0,0),(-1,-1),WHITE),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE'),('ALIGN',(0,0),(-1,-1),'CENTER'),
        ('LEFTPADDING',(0,0),(-1,-1),4),('RIGHTPADDING',(0,0),(-1,-1),4),
        ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
    ]))
    return t


def panel(title, body, bg=PALE, border=LINE, body_style='body'):
    content = [para(title, 'h2')]
    if isinstance(body, list):
        content.extend(body)
    elif body:
        content.append(para(body, body_style))
    t = Table([[content]], colWidths=[6.12*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),bg),('BOX',(0,0),(-1,-1),0.75,border),
        ('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),
        ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
        ('VALIGN',(0,0),(-1,-1),'TOP'),
    ]))
    return t


class WorkbookDoc(BaseDocTemplate):
    def __init__(self, filename, meta, **kwargs):
        super().__init__(filename, pagesize=letter, leftMargin=.58*inch, rightMargin=.58*inch,
                         topMargin=.59*inch, bottomMargin=.52*inch, title=meta['pdf_title'], **kwargs)
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height,
                      id='normal', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.meta = meta
        self.addPageTemplates(PageTemplate(id='workbook', frames=frame, onPage=self.decorate))

    def decorate(self, canvas, doc):
        canvas.saveState()
        w, h = letter
        if doc.page > 1:
            canvas.setFillColor(NAVY); canvas.rect(0, h-.34*inch, w, .34*inch, fill=1, stroke=0)
            canvas.setFillColor(WHITE); canvas.setFont(FONT_BOLD, 7.6)
            canvas.drawString(.58*inch, h-.225*inch, f"{self.meta['grade_label'].upper()}  |  {self.meta['cefr']}  |  {self.meta['theme_type_label'].upper()}")
            canvas.drawRightString(w-.58*inch, h-.225*inch, f"LESSON {self.meta['lesson_num']} - {self.meta['skill'].upper()}")
        canvas.setStrokeColor(LINE); canvas.setLineWidth(.5); canvas.line(.58*inch,.39*inch,w-.58*inch,.39*inch)
        canvas.setFillColor(GRAY); canvas.setFont(FONT,7.2)
        canvas.drawString(.58*inch,.235*inch, f"{self.meta['scenario_name']}  |  {self.meta['theme_name'][:45]}")
        canvas.drawRightString(w-.58*inch,.235*inch,f"{doc.page} / 4")
        canvas.restoreState()


def lesson_prompt(skill, focus, cefr, words, examples):
    w = words
    model = examples[0] if examples else ''
    if skill == 'Listening':
        if focus == 'receptive':
            return f'Listen to the teacher. Number the word cards in the order you hear them: {w[0]} · {w[1]} · {w[2]}.'
        return f'Work with a partner. Partner A reads a clue using {w[0]}, {w[1]}, or {w[2]}. Partner B listens, points to the matching card, and asks for a repeat if needed. Switch roles.'
    if skill == 'Reading':
        if focus == 'receptive':
            return f'Read the model. Circle the words from this word bank that you can find: {w[0]} · {w[1]} · {w[2]}.'
        return f'Read your card. Tell your partner one detail. Listen to your partner and complete the shared check with {w[0]}, {w[1]}, or {w[2]}.'
    if skill == 'Speaking':
        if focus == 'receptive':
            return 'Listen to the model response. Point to or say one detail you understood. Then use the frame below to share one short response.'
        return f'Interview a partner about {w[0]} / {w[1]}. Take turns asking, answering, and asking one follow-up question.'
    if skill == 'Writing':
        if focus == 'receptive':
            return f'Read the model first. Copy or complete one response using a word you found: {w[0]} / {w[1]} / {w[2]}.'
        return f'Write a short note with a partner using at least two of these words: {w[0]}, {w[1]}, {w[2]}. Read it together and make one helpful edit.'
    if focus == 'receptive':
        return 'Listen to or read the source. Draw or mark its main idea, then show a partner how your picture or gesture helps explain it.'
    return 'Help a partner understand the source. Rephrase one key idea, point to visual evidence, and check: “Does that make sense?”'


def performance_prompt(skill, focus, words):
    if focus == 'receptive':
        opts = {
            'Listening': 'Listen to three new clues. Independently point to, order, or mark the matching information.',
            'Reading': 'Read the source card independently. Mark three details that answer the teacher’s question.',
            'Speaking': 'Listen to a partner’s description. Show one detail you understood, then give a short response.',
            'Writing': 'Use the model as a source. Label or complete a response with words you can find in it.',
            'Mediation': 'Select the main idea from the source and communicate it with a drawing, gesture, or short phrase.',
        }
    else:
        opts = {
            'Listening': 'Complete a partner information gap: listen to a clue, ask for clarification, and agree on the answer.',
            'Reading': 'Exchange details from two short cards and complete one shared information grid.',
            'Speaking': 'Complete a partner interview. Ask, answer, and respond politely using the model language.',
            'Writing': 'Co-create a short message, notice, caption, or class text for a real reader; peer-edit one detail.',
            'Mediation': 'Facilitate a small-group exchange: restate a key idea, use a visual, and invite a peer to confirm understanding.',
        }
    return opts[skill]


def stage1_text(focus, skill, words, band):
    bank = ', '.join(words[:3])
    if focus == 'interactive':
        return f'Look at the picture cards. Take turns saying or showing one word: {bank}. Listen to your partner and respond with a gesture, word, or question.'
    if band == 'prea1':
        return f'Look and listen. Point to: {bank}. Copy a gesture or sound. You may answer by pointing.'
    return f'Look at the picture cards. Listen to the teacher say each word. Point, repeat, or mark the word you recognize: {bank}.'


def stage2_label(skill):
    return {
        'Listening': 'TEACHER READ-ALOUD / LISTENING INPUT',
        'Reading': 'SHORT MODEL TEXT / READING INPUT',
        'Speaking': 'MODEL EXCHANGE / SPOKEN INPUT',
        'Writing': 'MODEL SENTENCE OR MESSAGE / WRITTEN INPUT',
        'Mediation': 'SOURCE MESSAGE / MEANING IN CONTEXT',
    }[skill]


def default_model(words, examples):
    if examples:
        return '\n'.join(examples[:2])
    return 'Word cards: ' + ' · '.join(words[:4])


def objective_for(scenario, skill, band, words):
    outcomes = skill_outcomes(scenario, skill)
    if outcomes:
        return outcomes[0]
    standards = skill_standard(scenario, skill)
    if standards:
        return standards[:320]
    if band == 'prea1':
        return f'Can recognize or show understanding of familiar words with pictures: {", ".join(words[:3])}.'
    return f'Can use information from the theme “{scenario_name(scenario, 1)}” to complete a {skill.lower()} task.'


def stage3_text(skill, focus, words, cefr):
    prompt = lesson_prompt(skill, focus, cefr, words, [])
    band = level_band(cefr)
    if band == 'prea1':
        footer = 'Point, match, trace, draw, or answer with one word. The teacher may repeat and model.'
    elif band == 'a1':
        footer = 'Use the word bank and a short phrase or sentence frame.'
    elif band == 'a2':
        footer = 'Record key details and use two or three connected sentences.'
    else:
        footer = 'Use relevant evidence, explain a choice, and check meaning with a peer.'
    return prompt, footer


def make_story(meta, scenario, words, examples):
    skill = meta['skill']; focus = meta['theme_type']; band = level_band(meta['cefr'])
    objective = objective_for(scenario, skill, band, words)
    model = default_model(words, examples)
    prompt, level_tip = stage3_text(skill, focus, words, meta['cefr'])
    perf = performance_prompt(skill, focus, words)
    scripts = make_scripts(meta, words, examples)
    key = make_answer_key(meta, words, examples)
    story = []

    # Page 1: cover, objective, useful picture vocabulary, Stage 1.
    story += [Spacer(1, 11), para('AOA ACTIVITY WORKBOOK', 'title'),
              para(meta['grade_label'] + '  |  ' + meta['cefr'] + '  |  Lesson ' + str(meta['lesson_num']) + ' - ' + skill, 'subtitle'),
              Spacer(1, 3), para(meta['scenario_name'], 'h1'), para(meta['theme_name'], 'title')]
    focus_color = MINT if focus == 'receptive' else LILAC
    focus_label = 'THEME 1 · RECEPTIVE — Listen / read / understand' if focus == 'receptive' else 'THEME 2 · INTERACTIVE — Share / respond / create together'
    story.append(panel('CURRICULUM FOCUS', focus_label, focus_color, TEAL if focus == 'receptive' else colors.HexColor('#B6A8D8'), 'body'))
    story += [Spacer(1, 6), panel('MY LEARNING GOAL', objective, PALE, LINE, 'body_small'), Spacer(1, 7), para('WORD BANK — from this scenario', 'h2'), image_cards(words), Spacer(1, 6)]
    story.append(panel(STAGE_NAMES[0] + ' · Get ready', stage1_text(focus, skill, words, band), PALE, BLUE, 'body_small'))
    story += [Spacer(1, 4), para('Name: ____________________________________     Date: __________________', 'tiny'), PageBreak()]

    # Page 2: AOA Stage 2 and Stage 3.
    story += [Spacer(1, 4), para('LISTEN / READ / NOTICE','h1'),
              para(STAGE_NAMES[1] + ' · ' + stage2_label(skill), 'h2'),
              para('Teacher: present the selected curriculum example(s) slowly, with a picture or gesture. Repeat once.', 'body_small'),
              panel('MODEL INPUT', model, LILAC, colors.HexColor('#C8BEE3'), 'body'), Spacer(1, 6)]
    story.append(panel(STAGE_NAMES[2] + ' · Guided practice', prompt, PALE, LINE, 'body'))
    story += [Spacer(1, 6), panel('MY RESPONSE SPACE', [para('1. _________________________________________________','body'), para('2. _________________________________________________','body'), para('3. _________________________________________________','body')], WHITE, LINE, 'body_small'), Spacer(1, 5), para(level_tip, 'tiny')]
    story.append(PageBreak())

    # Page 3: Production task, formative check and reflection.
    story += [Spacer(1, 4), para('USE WHAT YOU UNDERSTAND','h1'),
              story_stage_panel(STAGE_NAMES[3] + ' · Action task', perf, focus), Spacer(1, 7)]
    story.append(panel(STAGE_NAMES[4] + ' · Quick check', assessment_text(skill, words, meta['cefr']), MINT, TEAL, 'body_small'))
    story += [Spacer(1, 7), panel(STAGE_NAMES[5] + ' · My reflection', 'Circle one:  I can do this  /  I can do this with help  /  I want to practise again.<br/>One word or idea I remember: __________________________________________', PALE, LINE, 'body_small'), Spacer(1, 7)]
    if meta['theme_num'] == 2:
        story.append(panel('PAIR / GROUP CHECK', 'Did each person have a turn?  □ Yes  □ With help<br/>Did we check that our partner understood?  □ Yes  □ With help', LILAC, colors.HexColor('#C8BEE3'), 'body_small'))
    else:
        story.append(panel('LISTENING / READING CHECK', 'Show the teacher one clue from the model that helped you answer.', LILAC, colors.HexColor('#C8BEE3'), 'body_small'))
    story.append(PageBreak())

    # Page 4: requested teacher scripts and key.
    story += [Spacer(1, 4), para('TEACHER PAGE — SCRIPTS & ANSWERS','h1'),
              para('Use clear, age-appropriate delivery. Repeat the input and accept non-verbal evidence when it matches the learner’s level.', 'tiny'),
              para('Teacher script (six AOA stages)', 'h2')]
    for i, line in enumerate(scripts, 1):
        story.append(para(f'<b>Stage {i}:</b> {line}', 'script'))
    story += [Spacer(1, 3), para('Answer key / expected evidence', 'h2')]
    for item in key:
        story.append(para('- ' + item, 'script'))
    story += [Spacer(1, 2), para('Differentiation', 'h2'), para(learner_support(meta['cefr']), 'script')]
    if selected_project(scenario, meta['theme_num'] - 1):
        project = selected_project(scenario, meta['theme_num'] - 1)
        story.append(para('<b>Curriculum project connection:</b> ' + project[:260], 'tiny'))
    story.append(para('<b>Source:</b> ' + meta['source_file'] + '. The curriculum provides standards, outcomes, language content, and project ideas; the practice tasks are original AOA activities built from those data. Theme 1 is treated as receptive and Theme 2 as interactive.', 'tiny'))
    return story


def story_stage_panel(title, task, focus):
    color = MINT if focus == 'receptive' else LILAC
    border = TEAL if focus == 'receptive' else colors.HexColor('#B6A8D8')
    body = [para(task, 'body'), Spacer(1, 4)]
    body += [para('My work:', 'tiny'), Spacer(1, .62*inch), para('What I showed / shared: _______________________________________________', 'body_small')]
    return panel(title, body, color, border, 'body')


def assessment_text(skill, words, cefr):
    band = level_band(cefr)
    if band == 'prea1':
        return f'Teacher checks: (1) points to one matching picture; (2) recognizes one word from {words[0]}; (3) takes a turn or signals a response.'
    if band == 'a1':
        return 'Teacher checks: (1) identifies two key details; (2) uses a target word in a short phrase; (3) follows or gives one simple direction.'
    if band == 'a2':
        return 'Teacher checks: (1) identifies three relevant details; (2) completes the task with a partner; (3) communicates two connected ideas.'
    return 'Teacher checks: (1) selects relevant details; (2) supports a response with evidence; (3) clarifies or negotiates meaning during the task.'


def make_scripts(meta, words, examples):
    focus = meta['theme_type']; skill = meta['skill']; model = default_model(words, examples)
    prompt_words = ', '.join(words[:3])
    first, second, third = (words + words[:3])[:3]
    interaction = 'Invite learners to take turns; prompt “Could you repeat that?” and “I understand.”' if focus == 'interactive' else 'Pause after each clue. Learners may answer by pointing, selecting, drawing, or speaking.'
    stage2 = {
        'Listening': f'Say: “Listen carefully.” Read the model aloud twice: {model}',
        'Reading': f'Display and read the model together: {model}',
        'Speaking': f'Model a short response connected to the source: {model}. Give learners think time.',
        'Writing': f'Show the model and read it aloud: {model}. Point out the target words: {prompt_words}.',
        'Mediation': f'Show or read the source: {model}. Ask learners to identify one main idea or useful clue.',
    }[skill]
    stage3 = {
        'Listening': f'Read these three words in this order: {second}, {third}, {first}. Ask learners to number or point to each card.',
        'Reading': f'Ask learners to find and circle these words in the word bank or model: {prompt_words}. Read the instruction aloud if needed.',
        'Speaking': f'Use this prompt: “Which idea or word do you remember?” Invite a short response using the model language: {examples[0] if examples else first + "."}',
        'Writing': f'Ask learners to copy or complete one response using {first}, {second}, or {third}. Accept a label or dictated response when appropriate.',
        'Mediation': f'Ask learners to draw, point to, or rephrase one key idea for a partner. Prompt: “Can you show me?”',
    }[skill]
    if skill == 'Listening' and focus == 'receptive':
        stage4 = f'Read these three new clues slowly, with a pause: {third}, {first}, {second}. Ask learners to point to or mark each card in the order heard.'
    elif skill == 'Listening' and focus == 'interactive':
        stage4 = f'Partner A reads these cards one at a time: {first}, {second}, {third}. Partner B points and asks for one repeat; then switch roles.'
    elif skill == 'Speaking' and focus == 'interactive':
        stage4 = f'Model the question “What do you think about {first}?” Invite a partner answer using the curriculum example if available, then ask one follow-up.'
    elif skill == 'Writing' and focus == 'interactive':
        stage4 = f'Ask pairs to co-write a short message for a real reader. Check that it includes two target words, such as {first} and {second}, then invite one kind peer edit.'
    elif skill == 'Mediation' and focus == 'interactive':
        stage4 = f'Ask one learner to explain or rephrase the source idea for a partner, using a visual and the target word {first}. The listener confirms or asks for clarification.'
    else:
        stage4 = performance_prompt(skill, focus, words)
    return [
        f'Show the picture cards. Say each target word: {prompt_words}. Demonstrate one point or gesture. {interaction}',
        stage2,
        stage3,
        stage4,
        f'Check understanding with three observations: key information, use of the target skill, and completion at {meta["cefr"]} support level.',
        'Ask: “What word or idea do you remember?” Learners circle a self-rating or point to one face. Preview the next lesson skill.',
    ]


def make_answer_key(meta, words, examples):
    skill = meta['skill']; focus = meta['theme_type']; first, second, third = (words + words[:3])[:3]
    if skill == 'Listening':
        core = f'Listening order in Stage 3: 1. {second}; 2. {third}; 3. {first}.'
    elif skill == 'Reading':
        core = 'Circle the three target words shown in the word bank: ' + ', '.join(words[:3]) + '.'
    elif skill == 'Speaking':
        core = 'Responses vary. Accept a relevant detail tied to the source and an understandable target word/phrase; model: ' + (examples[0] if examples else first + '.')
    elif skill == 'Writing':
        core = f'Responses vary. Accept one legible target word or a sentence/frame that uses {first} or {second} with meaning appropriate to the source.'
    else:
        core = 'Open response. Look for the source main idea, a matching visual/gesture, and a clear check that the partner understood.'
    if focus == 'interactive':
        interaction = 'Interactive task: responses vary; check that both partners contribute, exchange relevant information, and take turns.'
    else:
        interaction = 'Receptive task: correct evidence is information the learner can locate in the model or teacher read-aloud; allow pointing or marking.'
    return [
        core,
        'Picture / word cards: ' + ', '.join(words[:4]) + '.',
        interaction,
        f'Formative criteria follow the selected curriculum outcome for {skill}: ' + (skill_outcomes_for_key(meta) or 'identify or communicate the scenario information at the listed CEFR level.'),
    ]


def skill_outcomes_for_key(meta):
    return meta.get('outcome', '')[:260]


def build_descriptors():
    descriptors = []
    issues = []
    for grade_code, filename, slug, label, cefr, learner_label in GRADE_FILES:
        path = CURRICULUM_DIR / filename
        if not path.exists():
            issues.append({'grade': label, 'issue': 'curriculum file missing', 'file': filename})
            continue
        data = json.loads(path.read_text(encoding='utf-8-sig'))
        scenarios = data.get('scenarios') or []
        if len(scenarios) != 8:
            issues.append({'grade': label, 'issue': f'expected 8 scenarios, found {len(scenarios)}', 'file': filename})
        for si, scenario in enumerate(scenarios, 1):
            title = scenario_name(scenario, si)
            vocab = extract_vocab(scenario)
            for ti in range(2):
                tname = theme_name(scenario, ti) or f'Theme {ti+1} — title not specified in curriculum'
                if 'title not specified' in tname:
                    issues.append({'grade': label, 'scenario': si, 'theme': ti+1, 'issue': 'theme title not specified'})
                focus = 'receptive' if ti == 0 else 'interactive'
                for li, (skill, _) in enumerate(SKILLS, 1):
                    words = words_for_lesson(vocab, si-1, ti, li-1)
                    outcomes = skill_outcomes(scenario, skill)
                    examples = quoted_examples(scenario, skill)
                    lesson_meta = {
                        'grade_code': grade_code, 'grade_slug': slug, 'grade_label': label,
                        'learner_label': data.get('proficiency_label') or data.get('learner_type') or learner_label,
                        'cefr': cefr, 'scenario_num': si, 'scenario_name': title,
                        'theme_num': ti+1, 'theme_name': tname, 'theme_type': focus,
                        'theme_type_label': 'Receptive' if ti == 0 else 'Interactive',
                        'lesson_num': li, 'skill': skill, 'source_file': filename,
                        'source_path': str(path), 'words': words, 'all_vocabulary': vocab,
                        'examples': examples, 'outcome': outcomes[0] if outcomes else '',
                        'objective': objective_for(scenario, skill, level_band(cefr), words),
                        'pdf_title': f'{label} · Scenario {si} · Theme {ti+1} · Lesson {li} · {skill}',
                    }
                    lesson_meta['id'] = f'{slug}_SC{si:02}_T{ti+1}_L{li}'
                    lesson_meta['file_name'] = f'{slug}_SC{si:02}_T{ti+1}_L{li}_{skill}.pdf'
                    lesson_meta['relative_pdf'] = f'{slug}/Scenario_{si:02}/{lesson_meta["file_name"]}'
                    descriptors.append((lesson_meta, scenario))
    return descriptors, issues


def generate_one(meta, scenario):
    path = OUT_DIR / meta['relative_pdf']
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = WorkbookDoc(str(path), meta)
    story = make_story(meta, scenario, meta['words'], meta['examples'])
    doc.build(story)
    return path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--package-only', action='store_true')
    parser.add_argument('--start', type=int, default=0, help='zero-based descriptor offset')
    parser.add_argument('--limit', type=int, default=None, help='maximum PDFs to generate in this batch')
    args = parser.parse_args()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    descriptors, issues = build_descriptors()
    print(f'Curriculum-derived workbook count: {len(descriptors)}')
    print(f'Curriculum data notes: {len(issues)}')
    if len(descriptors) != 1120:
        raise SystemExit(f'Expected 1120 workbook PDFs, found {len(descriptors)}; no output generated.')
    if args.dry_run:
        for issue in issues[:40]:
            print('DATA NOTE:', json.dumps(issue, ensure_ascii=False))
        for m, _ in descriptors[:5]:
            print('SAMPLE:', m['relative_pdf'], '|', m['cefr'], '|', m['scenario_name'], '|', m['theme_name'], '|', ', '.join(m['words']))
        return

    selected = descriptors[args.start:args.start + args.limit] if args.limit is not None else descriptors[args.start:]
    if not args.package_only:
        if args.start < 0 or args.start >= len(descriptors) or not selected:
            raise SystemExit('Invalid batch offset or empty batch.')
        if len(selected) > 100:
            raise SystemExit('PDF artifact batches may contain at most 100 outputs.')
        for idx, (meta, scenario) in enumerate(selected, 1):
            generate_one(meta, scenario)
            if idx % 10 == 0 or idx == len(selected):
                print(f'Generated batch item {idx}/{len(selected)} (overall {args.start + idx}/{len(descriptors)})')
    if args.limit is not None and not args.package_only:
        print('BATCH DONE')
        return

    records = []
    missing_pdf = []
    for meta, _ in descriptors:
        path = OUT_DIR / meta['relative_pdf']
        if not path.exists():
            missing_pdf.append(meta['relative_pdf'])
            continue
        records.append({
            'id': meta['id'], 'grade': meta['grade_label'], 'grade_slug': meta['grade_slug'],
            'cefr': meta['cefr'], 'scenario_number': meta['scenario_num'],
            'scenario_name': meta['scenario_name'], 'theme_number': meta['theme_num'],
            'theme_name': meta['theme_name'], 'theme_orientation': meta['theme_type'],
            'lesson_number': meta['lesson_num'], 'skill': meta['skill'],
            'file_name': meta['file_name'], 'relative_pdf': meta['relative_pdf'],
            'size_bytes': path.stat().st_size,
        })
    if missing_pdf:
        raise SystemExit(f'Packaging stopped: {len(missing_pdf)} PDFs are missing; first missing: {missing_pdf[0]}')

    manifest = {
        'generated_from': 'public/curriculums/*.json',
        'cefr_mapping_source': 'user-provided cefr levels.pdf',
        'theme_rule': {'theme_1': 'receptive', 'theme_2': 'interactive'},
        'lessons_per_theme': 5,
        'lesson_skill_order': [x[0] for x in SKILLS],
        'total_workbooks': len(records),
        'curriculum_data_notes': issues,
        'workbooks': records,
    }
    (OUT_DIR / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUT_DIR / 'data_notes.json').write_text(json.dumps(issues, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUT_DIR / 'README.txt').write_text(
        'AOA CURRICULUM WORKBOOK COLLECTION\n'
        '1120 four-page PDFs: 14 grade levels x 8 scenarios x 2 themes x 5 lessons.\n'
        'Theme 1 is receptive; Theme 2 is interactive. Five lessons focus on Listening, Reading, Speaking, Writing, and Mediation.\n'
        'CEFR grade mappings follow the user-provided cefr levels.pdf. The curriculum JSON supplies grade-specific scenarios, themes, learning outcomes, grammar, vocabulary, and projects.\n'
        'Teacher scripts, differentiation guidance, and answer / evidence keys appear on each PDF final page.\n'
        'Please read data_notes.json for source entries without a theme title.\n', encoding='utf-8')

    grade_zips = []
    for _, _, slug, _, _, _ in GRADE_FILES:
        archive = OUT_DIR / f'{slug}_AOA_Workbooks.zip'
        folder = OUT_DIR / slug
        with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
            for pdf in sorted(folder.rglob('*.pdf')):
                zf.write(pdf, pdf.relative_to(OUT_DIR).as_posix())
        grade_zips.append(archive)
        print(f'Packaged {slug}: {len(list(folder.rglob("*.pdf")))} PDFs')

    master = OUT_DIR / 'All_Grades_AOA_Workbooks_1120.zip'
    with zipfile.ZipFile(master, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for pdf in sorted(OUT_DIR.glob('Grade_*/Scenario_*/*.pdf')):
            zf.write(pdf, pdf.relative_to(OUT_DIR).as_posix())
        for name in ('manifest.json', 'data_notes.json', 'README.txt'):
            zf.write(OUT_DIR / name, name)
    print(f'Created master archive: {master} ({master.stat().st_size} bytes)')
    print('DONE')


if __name__ == '__main__':
    main()
