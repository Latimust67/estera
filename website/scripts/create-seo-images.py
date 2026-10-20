"""Create original Estera social/brand graphics. Requires Pillow; not part of builds."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1] / 'public'
FONT = '/System/Library/Fonts/Helvetica.ttc'
BG, TEXT, ACCENT, LINE, MUTED = '#080a09', '#f3f1e9', '#c6f582', '#29332c', '#9baba0'

def ghost(draw, x, y, size, width, color):
    # Original vector-like mark matching the site's simple ghost identity.
    draw.arc((x, y, x+size, y+size), 180, 360, fill=color, width=width)
    points = [(x,y+size/2),(x,y+size*1.12),(x+size*.25,y+size*.94),(x+size*.5,y+size*1.12),(x+size*.75,y+size*.94),(x+size,y+size*1.12),(x+size,y+size/2)]
    draw.line(points, fill=color, width=width, joint='curve')
    r=size*.055
    for ex in [x+size*.34,x+size*.66]:
        draw.ellipse((ex-r,y+size*.5-r,ex+r,y+size*.5+r),fill=color)

im=Image.new('RGB',(2400,1260),BG)
d=ImageDraw.Draw(im)
for x in range(1400,2400,92): d.line((x,0,x,1260),fill=LINE,width=1)
for y in range(0,1260,92): d.line((1370,y,2400,y),fill=LINE,width=1)
for radius in [180,270,360]: d.ellipse((1900-radius,595-radius,1900+radius,595+radius),outline=LINE,width=3)
d.line((128,1080,2270,1080),fill=LINE,width=2)
ghost(d,1755,395,285,13,ACCENT)
d.text((124,92),'estera.',font=ImageFont.truetype(FONT,100),fill=TEXT)
d.text((130,305),'Your iPhone.',font=ImageFont.truetype(FONT,135),fill=TEXT)
d.text((130,465),'Somewhere else.',font=ImageFont.truetype(FONT,135),fill=ACCENT)
d.text((135,725),'Free, open-source location simulator for Mac',font=ImageFont.truetype(FONT,43),fill=TEXT)
d.text((135,810),'Pins. Routes. GPX. One free desktop app.',font=ImageFont.truetype(FONT,35),fill=MUTED)
d.text((135,1120),'APPLE SILICON   /   macOS 15+   /   USB   /   PREVIEW',font=ImageFont.truetype(FONT,27),fill=MUTED)
(ROOT/'assets').mkdir(exist_ok=True)
im.resize((1200,630),Image.Resampling.LANCZOS).save(ROOT/'assets/estera-social.png',optimize=True)
icon=Image.new('RGB',(720,720),BG)
d=ImageDraw.Draw(icon)
ghost(d,220,160,280,34,TEXT)
for size,name in [(96,'favicon-96.png'),(180,'apple-touch-icon.png')]:
    icon.resize((size,size),Image.Resampling.LANCZOS).save(ROOT/name,optimize=True)
print('Created social image (1200×630), favicon (96×96), and touch icon (180×180).')
