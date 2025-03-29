// Ensure the script is running in After Effects
var comp = app.project.activeItem;  // Get the active composition
if (comp && comp instanceof CompItem) {


    // Padding Function
    function padWithZeros(num, totalLength) {
        var numStr = num.toString();
        var zeros = "";
        for (var i = 0; i < totalLength - numStr.length; i++) {
            zeros += "0";
        }
        return zeros + numStr;
    }

    // Prompt user for base filename
    var baseFileName = prompt("Enter the base file name for your exports:", "URES_20250304-24cam");
    
    // If user cancels the prompt or doesn't enter anything, exit the script
    if (!baseFileName) {
        alert("Script cancelled. No filename was provided.");
    }

    // Specify the frame rate and frame export path
    var frameRate = comp.frameRate;
    var outputFolder = Folder.selectDialog("Select output folder for frames");
    
    if (outputFolder) {
        app.beginUndoGroup("Export Frames");  // Begin undo group

        //Loop through all frames in composition
        //comp.duration * frameRate
        for (var i = 0; comp.duration * frameRate; i++) {

            // Move the time indicator to the current frame
            comp.time = i / frameRate;

            //Pad frame index with correct number of 0's
            frameIndex = padWithZeros(i, 3);
            
            
            // Create a folder for the current frame if it doesn't exist
            var currentFolder = new Folder(outputFolder.fsName + "/Frame_" + frameIndex);
            if (!currentFolder.exists) {
                currentFolder.create();
            }

            //loop through all layers of composition
            for (var j = 1; j < comp.numLayers; j++) {
                //save frame
                comp.saveFrameToPng(comp.time, File(outputFolder.fsName+ "/Frame_" + frameIndex + "/" + baseFileName + "_" + String.fromCharCode(j + 64) + "_" + frameIndex + ".png"))
                //comp.saveFrameToPng(comp.time, File(outputFolder.fsName+ "/Frame_" + (i + 1) + "/URES_20250304-24cam_A_" + (i + 1) + ".png"))

                //Disable Visibilty of Layer
                var layer = comp.layer(j);
                layer.enabled = false;
            }

            //Save Last layer
            comp.saveFrameToPng(comp.time, File(outputFolder.fsName+ "/Frame_" + frameIndex + "/" + baseFileName + "_" + String.fromCharCode(comp.numLayers + 64) + "_" + frameIndex + ".png"))

            //loop through all layers again to enable them again
            for (var j = 1; j < comp.numLayers; j++) {
                //Enable Visibilty of Layer
                var layer = comp.layer(j);
                layer.enabled = true;
            }
        }

        alert("Frames Successfully Exported To PNG's");
        
        app.endUndoGroup();  // End undo group
    }
} else {
    alert("Please select a composition.");
}

//format numbers to always be 3 digits long
