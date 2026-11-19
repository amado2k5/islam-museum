-- Clicks Translate in Word's Translator panel for the frontmost document and waits for the translated copy.
-- The panel is a web view that keeps its last "To" language; the button sits at a fixed place in the panel.
on run argv
  set stem to item 1 of argv
  tell application "Microsoft Word" to activate
  delay 1
  tell application "System Events" to tell process "Microsoft Word"
    click menu item "Translate Document" of menu 1 of menu item "Translate" of menu 1 of menu bar item "Tools" of menu bar 1
    delay 4
    set {wx, wy} to position of window 1
    set {ww, wh} to size of window 1
    click at {wx + ww - 55, wy + 362}
  end tell
  repeat 60 times
    delay 3
    tell application "Microsoft Word"
      if (count of documents) > 1 and (name of active document) does not contain stem then return "translated"
    end tell
  end repeat
  error "no translated copy after 3 minutes"
end run
