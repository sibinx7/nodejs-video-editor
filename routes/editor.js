var express = require("express");
var router = express.Router();
var path = require("path");
var EditorController = require('../controller/editor.ctrl');



router.get("/", EditorController.videoUploadForm)
router.post('/video-upload', EditorController.videoFileUpload)
router.get("/video", EditorController.videoEditor);

module.exports = router;