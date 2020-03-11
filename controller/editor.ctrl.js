var path = require("path");
var multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

var uploadPath = path.join(__dirname, "../videos");
var storage = multer.diskStorage({
  destination: function(req, res, cb){
    console.log("Inside multer destination function...")
    cb(null, uploadPath)
  },
  filename: function(req, file, cb){
    console.log("Inside multer file name function")
    cb(null, "sample-video.mp4")
  }
});
var videoUpload = multer({storage: storage});

var videoEditorFile = videoUpload.single("video_file")


var EditorController = {
  videoFileUpload: function(req, res, next){
    console.log(JSON.stringify(req.body))
    console.log("Video file upload...")
    console.log(uploadPath)
    console.log(JSON.stringify(req.files))
    try{
      var video_file = req.body.video_file;
      var videoID = 102;
      videoEditorFile(req, res, function(err){
        if(!err){
          res.redirect("/editor/video?video-file="+102);    
        }else{
          throw new Error("Upload error")
        }
      })
      
    }catch(e){
      res.redirect("/");
    }
    
  },
  videoEditor: function(req, res, next){
    console.log("Enter /editor/video path")
    var video_path = path.join(__dirname, "../videos/sample-video.mp4");
    try{
      ffmpeg(video_path)
      .setStartTime("00:05:00")
      .setDuration('60')      
      .on("progress", function(){
        console.log("Progress information")
      })
      .on("end", function(){
        console.log("Video processed...")
        var video_file = new URL("/sample-video-edited.mp4", "http://localhost:8080");
        res.render("editor/editor", {
          video_path: video_file  
        })
      })
      .on("error", function(){
        console.log("Error")
        console.log(arguments)
        console.log("######")
        res.render("editor/editor", {
          message: "Video conversion failed..."
        })
      }).save(
        path.join(__dirname, "../videos/sample-video-edited.mp4")        
      );
      // output(path.join(__dirname, "../videos/sample-video-edited.mp4"))
    }catch(e){
      console.log(e)
      console.log("ffmpeg has issue...")
      res.render("editor/editor", {
        message: "Video conversion failed..."
      })
    }

    

    
  },
  videoUploadForm: function(req, res, next){
    var toView = {
      title: "Video Editor Form"
    }
    res.render("editor/index", toView)
  }
} 


module.exports = EditorController;