function annotateNode(detection) {

    var nodes = db.getSiblingDB('marr_fulldump')['nodes_tags'];
    var node = nodes.findOne({tag: detection._id});

    if (node) {

        node.detection = {
            lang: detection.detections[0].language,
            confidence: detection.detections[0].confidence
        };

        nodes.save(node);
    }
}

db.detections.find().forEach(annotateNode);
