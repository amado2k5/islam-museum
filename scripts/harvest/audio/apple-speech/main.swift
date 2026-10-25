// Apple on-device speech recognition for one audio file, as JSON segments with timestamps.
// An independent engine from mlx-whisper (Apple's own model, run on the Mac), used as the
// third pass of the verification step in docs/agents/audio-video-harvest.md §2.
// Usage: apple-speech <audio-file> <output.json> [locale, default ar-SA]
import Foundation
import Speech

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: apple-speech <audio> <out.json> [locale]\n".data(using: .utf8)!)
    exit(2)
}
let audioURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
let locale = Locale(identifier: args.count > 3 ? args[3] : "ar-SA")

guard let recognizer = SFSpeechRecognizer(locale: locale) else {
    FileHandle.standardError.write("no recognizer for \(locale.identifier)\n".data(using: .utf8)!)
    exit(1)
}
guard recognizer.supportsOnDeviceRecognition else {
    FileHandle.standardError.write("on-device recognition not available for \(locale.identifier); refusing to send audio to a server\n".data(using: .utf8)!)
    exit(1)
}

let auth = DispatchSemaphore(value: 0)
var status: SFSpeechRecognizerAuthorizationStatus = .notDetermined
SFSpeechRecognizer.requestAuthorization { s in status = s; auth.signal() }
auth.wait()
guard status == .authorized else {
    FileHandle.standardError.write("speech recognition not authorized (\(status.rawValue)); grant it in System Settings > Privacy & Security > Speech Recognition\n".data(using: .utf8)!)
    exit(1)
}

let request = SFSpeechURLRecognitionRequest(url: audioURL)
request.requiresOnDeviceRecognition = true
request.shouldReportPartialResults = false
request.taskHint = .dictation

let done = DispatchSemaphore(value: 0)
var failure: Error?
var segments: [[String: Any]] = []
recognizer.recognitionTask(with: request) { result, error in
    if let error = error { failure = error; done.signal(); return }
    guard let result = result, result.isFinal else { return }
    for seg in result.bestTranscription.segments {
        segments.append([
            "start": seg.timestamp,
            "end": seg.timestamp + seg.duration,
            "text": seg.substring,
            "confidence": seg.confidence,
        ])
    }
    done.signal()
}
done.wait()
if let failure = failure {
    FileHandle.standardError.write("recognition failed: \(failure.localizedDescription)\n".data(using: .utf8)!)
    exit(1)
}
let payload: [String: Any] = ["engine": "apple-speech-on-device", "locale": locale.identifier, "segments": segments]
let data = try JSONSerialization.data(withJSONObject: payload, options: [.prettyPrinted, .sortedKeys])
try data.write(to: outURL)
print("wrote \(segments.count) segments to \(outURL.path)")
