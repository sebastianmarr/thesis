languageDetectionDB.detections.find().forEach(importDetection);

function importDetection(detection) {

  var detectionProperties = {
    language: detection.detections[0].language,
    confidence: detection.detections[0].confidence
  }

  graphDB.nodes.update(
    {string: detection._id},
    {$set: {
      languageDetection: detectionProperties
    }},
    {multi: true}
  );
}
