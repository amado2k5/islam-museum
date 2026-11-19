#!/usr/bin/env python3
"""Mouse and keyboard events for Word's Translator panel (a web view that scripted accessibility clicks do not reach).
   word_click.py click <x> <y>      left click at a screen point
   word_click.py type <text>        type text, then Return"""
import sys, time
import Quartz as Q

def click(x, y):
    for kind in (Q.kCGEventMouseMoved, Q.kCGEventLeftMouseDown, Q.kCGEventLeftMouseUp):
        Q.CGEventPost(Q.kCGHIDEventTap, Q.CGEventCreateMouseEvent(None, kind, (x, y), Q.kCGMouseButtonLeft)); time.sleep(0.15)

def typing(text):
    for ch in text + "\r":
        for down in (True, False):
            e = Q.CGEventCreateKeyboardEvent(None, 36 if ch == "\r" else 0, down)
            if ch != "\r": Q.CGEventKeyboardSetUnicodeString(e, 1, ch)
            Q.CGEventPost(Q.kCGHIDEventTap, e); time.sleep(0.04)

if sys.argv[1] == "click": click(float(sys.argv[2]), float(sys.argv[3]))
else: typing(sys.argv[2])
